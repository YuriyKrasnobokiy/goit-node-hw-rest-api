import request from "supertest";
import mongoose from "mongoose";
import app from "../app.js";

const { DB_HOST, PORT } = process.env;

describe("login", () => {
  let server = null;

  beforeAll(() => {
    mongoose
      .connect(DB_HOST)
      .then((server = app.listen(PORT, "run test server")))
      .catch((error) => {
        console.log(error.message);
      });
  });

  afterAll(() => {
    mongoose.connection
      .close()
      .then(server.close())
      .catch((error) => {
        console.log(error.message);
      });
  });
  test("login", async () => {
    const LoginedUser = {
      email: "user666@mail.com",
      password: "user666@mail.com",
    };
    const response = await request(app)
      .post("/api/users/login")
      .send(LoginedUser);
    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
    expect(
      typeof response.body.user.email && typeof response.body.user.subscription,
    ).toBe("string");
  });
});
