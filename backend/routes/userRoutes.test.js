
const request = require("supertest");

const db = require("../db");
const app = require("../app");
const User = require("../models/userModel");

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    user_ids,
    recipe_ids, 
    tokens,
  } = require("./_testCommon");

  beforeAll(commonBeforeAll);
  beforeEach(commonBeforeEach);
  afterEach(commonAfterEach);
  afterAll(commonAfterAll);

  /************************************** GET /users */

describe("GET /users", function () {
  test("works for users", async function () {
    const u1Token = tokens["u1Token"];
    const resp = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
      users: [
        {
          username: "u1",
          firstName: "U1F",
          lastName: "U1L",
          email:"user1@user.com",
        },
        {
          username: "u2",
          firstName: "U2F",
          lastName: "U2L",
          email:"user2@user.com",
        },
        {
          username: "u3",
          firstName: "U3F",
          lastName: "U3L",
          email:"user3@user.com",
        }
      ],
    });
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
      .get("/users");
    expect(resp.statusCode).toEqual(401);
  });
});

/************************************** GET /users/:username */

describe("GET /users/:username", function() {
  
  test("works for users", async function () {
    const u1Token = tokens["u1Token"];
    const resp = await request(app)
      .get("/users/u1")
      .set("Authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
      user: {
        username: "u1",
        firstName: "U1F",
        lastName: "U1L",
        email: "user1@user.com",
      },
    });
  });

  test("unauth for wrong user", async function () {
    const u1Token = tokens["u1Token"];
    const resp = await request(app)
      .get(`/users/u3`)
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
      .get(`/users/u1`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth if user not found", async function () {
    const u1Token = tokens["u1Token"];
    const resp = await request(app)
      .get(`/users/nope`)
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });

});

/************************************** PATCH /users/:username */

describe("PATCH /users/:username", () => {
  test("works for users", async function () {
    const u1Token = tokens["u1Token"];
    const resp = await request(app)
      .patch(`/users/u1`)
      .send({
        firstName: "New",
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({ 
      user: {
        username: "u1",
        firstName: "New",
        lastName: "U1L",
        email: "user1@user.com",
      },
    });
  });

});