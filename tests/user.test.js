const request = require("supertest");
const jwt_decode = require("jwt-decode");
const app = require("../src/app");
const User = require("../src/models/user");
const { newUser, newUserId, newUser2, setUpDB } = require("./fixtures/db");

beforeEach(setUpDB);

const token = newUser.tokens[0].token;

test("Should not register with invalid password", async () => {
  await request(app)
    .post("/users")
    .send({
      name: "Muteshi",
      email: "muteshi@gmail.com",
      password: "Hi1@1",
    })
    .expect(400);
});
test("Should not register with same email", async () => {
  await request(app)
    .post("/users")
    .send({
      name: "Muteshi",
      email: "sara@gmail.com",
      password: "Hi1@1@123",
    })
    .expect(400);
});

test("Should register new user", async () => {
  const response = await request(app)
    .post("/users")
    .send({
      name: "Muteshi",
      email: "muteshi@gmail.com",
      password: "Hii12Nip@ss",
    })
    .expect(201);
  //expect that the new user is saved in DB
  const newUser = jwt_decode(response.body.token);
  const user = await User.findById(newUser._id);
  expect(user).not.toBeNull();
  //expect that the token is in the response object
  expect(response.body).toMatchObject({
    token: user.tokens[0].token,
  });
  //passwords should not be plain
  expect(user.password).not.toBe("Hii12Nip@ss");
});

test("Should login user", async () => {
  const res = await request(app)
    .post("/users/login")
    .send({
      email: newUser.email,
      password: newUser.password,
    })
    .expect(200);
  //user second token matches token in response
  const user = await User.findById(newUserId);
  expect(user.tokens[1].token).toBe(res.body.token);
});

test("Should not login non existent user", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: "mimi@gmail.com",
      password: "mimi543",
    })
    .expect(400);
});
test("Should not login inactive user", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: newUser2.email,
      password: newUser2.password,
    })
    .expect(400);
});

test("Should get profile for user", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${token}`)
    .send()
    .expect(200);
});

test("Should not get profile for unauthenticated  user", async () => {
  await request(app).get("/users/me").send().expect(401);
});

test("Should delete account for  user", async () => {
  const res = await request(app)
    .delete("/users/delete-account")
    .set("Authorization", `Bearer ${newUser2.tokens[0].token}`)
    .send()
    .expect(200);

  const user = await User.findById(res.body._id);

  expect(user).toBeNull();
});

test("Should not delete a super user account", async () => {
  const res = await request(app)
    .delete("/users/delete-account")
    .set("Authorization", `Bearer ${token}`)
    .send()
    .expect(401);

  const user = await User.findById(newUser._id);

  expect(user._id).toEqual(newUser._id);
});

test("Should not delete account for unauthenticated user", async () => {
  await request(app).delete("/users/delete-account").send().expect(401);
});

test("Should update valid user fields", async () => {
  await request(app)
    .patch("/users/edit-account")
    .set("Authorization", `Bearer ${token}`)
    .send({ name: "Paul Muteshi" })
    .expect(200);
  const user = await User.findById(newUserId);
  expect(user.name).toEqual("Paul Muteshi");
});

test("Should not update invalid user fields", async () => {
  await request(app)
    .patch("/users/edit-account")
    .set("Authorization", `Bearer ${token}`)
    .send({ location: "Kitengela" })
    .expect(400);
});

test("Should logout user", async () => {
  await request(app)
    .post("/users/logout")
    .set("Authorization", `Bearer ${token}`)
    .send()
    .expect(200);
  const user = await User.findById(newUserId);
  expect(user.tokens.includes(token)).toBeFalsy();
});

test("Should clear all user tokens/sessions", async () => {
  await request(app)
    .post("/users/logout-all")
    .set("Authorization", `Bearer ${token}`)
    .send()
    .expect(200);
  const user = await User.findById(newUserId);
  expect(user.tokens.length).toEqual(0);
});
