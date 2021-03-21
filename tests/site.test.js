const request = require("supertest");
const app = require("../src/app");
const Site = require("../src/models/site");

const {
  newUser,
  newUser2,
  newUser3,
  newSite1,
  newSite3,
  setUpDB,
} = require("./fixtures/db");

beforeEach(setUpDB);

const newSiteTest = {
  name: "Testing tena",
  admin: "muteshi",
  ipAddress: "192.168.25.1/24",
  password: "!2A45a",
  owner: newUser._id,
};

test("Should create site for user", async () => {
  const res = await request(app)
    .post("/sites")
    .set("Authorization", `Bearer ${newUser.tokens[0].token}`)
    .send(newSiteTest)
    .expect(201);

  const site = await Site.findById(res.body._id);

  expect(site).not.toBeNull();
  expect(site.admin).toEqual("muteshi");
});

test("Should update a site", async () => {
  const res = await request(app)
    .patch(`/sites/edit/${newSite1._id}`)
    .set("Authorization", `Bearer ${newUser.tokens[0].token}`)
    .send({ ipAddress: "192.168.117.1/24" })
    .expect(200);

  const site = await Site.findById(res.body._id);

  expect(site.ipAddress).toEqual("192.168.117.1/24");
});

test("superuser should update any site", async () => {
  const res = await request(app)
    .patch(`/sites/edit/${newSite3._id}`)
    .set("Authorization", `Bearer ${newUser.tokens[0].token}`)
    .send({ name: "Agathe Nzuri" })
    .expect(200);

  const site = await Site.findById(res.body._id);

  expect(site.name).toEqual("Agathe Nzuri");
});

test("non superuser should not update any site", async () => {
  const res = await request(app)
    .patch(`/sites/edit/${newSite1._id}`)
    .set("Authorization", `Bearer ${newUser3.tokens[0].token}`)
    .send({ name: "Paul muteshi" })
    .expect(401);

  const site = await Site.findById(newSite1._id);
  //name not changed
  expect(site.name).toEqual("Paul Muteshi");
});

test("disabled user should not update any site", async () => {
  const res = await request(app)
    .patch(`/sites/edit/${newSite1._id}`)
    .set("Authorization", `Bearer ${newUser2.tokens[0].token}`)
    .send({ name: "Paul muteshi" })
    .expect(401);

  const site = await Site.findById(newSite1._id);
  //name not changed
  expect(site.name).toEqual("Paul Muteshi");
});

test("Should not create a site with same IP address", async () => {
  const res = await request(app)
    .post("/sites")
    .set("Authorization", `Bearer ${newUser.tokens[0].token}`)
    .send(newSite1)
    .expect(400);
});

test("User should get sites they own", async () => {
  const res = await request(app)
    .get("/sites")
    .set("Authorization", `Bearer ${newUser.tokens[0].token}`)
    .send()
    .expect(200);
  //superusers own all sites
  expect(res.body.length).toEqual(3);
});

test("Superuser should get all sites", async () => {
  const res = await request(app)
    .get("/sites")
    .set("Authorization", `Bearer ${newUser.tokens[0].token}`)
    .send()
    .expect(200);

  expect(res.body.length).toEqual(3);
});

test("Only superuser to delete sites", async () => {
  const res = await request(app)
    .delete(`/sites/delete/${newSite1._id}`)
    .set("Authorization", `Bearer ${newUser2.tokens[0].token}`)
    .send()
    .expect(401);

  const site = await Site.findById(newSite1._id);
  expect(site).not.toBeNull();
});

test("should fetch a single site", async () => {
  const res = await request(app)
    .get(`/sites/${newSite1._id}`)
    .set("Authorization", `Bearer ${newUser.tokens[0].token}`)
    .send()
    .expect(200);
});
