const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const isCidr = require("is-cidr");

const siteSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    admin: {
      type: String,
      required: true,
      trim: true,
    },
    ipAddress: {
      type: String,
      required: true,
      index: { unique: true, dropDups: true },
      trim: true,
      validate(value) {
        if (!(isCidr.v4(value) || isCidr.v6(value))) {
          throw new Error("Invalid IP address");
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

//hash the plain text password
siteSchema.pre("save", async function (next) {
  const site = this;

  if (site.isModified("password")) {
    site.password = await bcrypt.hash(site.password, 8);
  }
  next();
});

// Remove router password from response
siteSchema.methods.toJSON = function () {
  const site = this;
  const siteData = site.toObject();
  delete siteData.password;
  return siteData;
};

// siteSchema.statics.loginIntoRouter = async (url, username, password) => {
//   try {
//     const { data, status } = await checkUser(url, username, password);
//     for (const user in data) {
//       if (user.group !== "full") {
//         throw new Error("Access denied");
//       }
//     }
//     return status;
//   } catch (error) {
//     if (error & (error.response.status === 401)) {
//       throw new Error("Access denied");
//     }
//     if (error & (error.response === "undefined")) {
//       throw new Error("Unable to add router");
//     }
//   }
// };

const Site = mongoose.model("Site", siteSchema);

module.exports = Site;
