import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import postModel from "../models/posts_model";
import { Express } from "express";
import userModel, { IUser } from "../models/users_model";

var app: Express;

beforeAll(async () => {
  app = await initApp();
  await userModel.deleteMany();
  await postModel.deleteMany();
});

afterAll((done) => {
  mongoose.connection.close();
  done();
});

const baseUrl = "/auth";

type User = IUser & {
  accessToken?: string;
  refreshToken?: string;
};

const testUser: User = {
  email: "test@email",
  userName: "testuser",
  password: "testpassword",
  photo: "",
};

describe("Auth API Tests", () => {
  test("Auth test register", async () => {
    const response = await request(app)
      .post(baseUrl + "/register")
      .send(testUser);
    expect(response.statusCode).toBe(200);
  });

  test("Auth test register fail - duplicate email", async () => {
    const response = await request(app)
      .post(baseUrl + "/register")
      .send(testUser);
    expect(response.statusCode).not.toBe(200);
  });

  test("Auth test register fail - missing fields", async () => {
    const response = await request(app)
      .post(baseUrl + "/register")
      .send({
        userName: "sdsdfsd",
      });
    expect(response.statusCode).not.toBe(200);
    const response2 = await request(app)
      .post(baseUrl + "/register")
      .send({
        email: "",
        password: "sdfsd",
      });
    expect(response2.statusCode).not.toBe(200);
  });

  test("Auth test login", async () => {
    const response = await request(app)
      .post(baseUrl + "/login")
      .send(testUser);
    expect(response.statusCode).toBe(200);
    const accessToken = response.body.accessToken;
    expect(accessToken).toBeDefined();
    expect(response.body._id).toBeDefined();
    testUser.accessToken = accessToken;
    testUser._id = response.body._id;
  });

  test("Check tokens are not the same", async () => {
    const response = await request(app)
      .post(baseUrl + "/login")
      .send(testUser);
    const accessToken = response.body.accessToken;

    expect(accessToken).not.toBe(testUser.accessToken);
  });

  test("Auth test login fail - incorrect password", async () => {
    const response = await request(app)
      .post(baseUrl + "/login")
      .send({
        email: testUser.email,
        password: "sdfsd",
      });
    expect(response.statusCode).not.toBe(200);

    const response2 = await request(app)
      .post(baseUrl + "/login")
      .send({
        userName: "dsfasd",
        password: "sdfsd",
      });
    expect(response2.statusCode).not.toBe(200);
  });

  test("Auth test refresh token", async () => {
    const response = await request(app).post(baseUrl + "/refresh");

    expect(response.statusCode).toBe(200);
    expect(response.body.accessToken).toBeDefined();
    testUser.accessToken = response.body.accessToken;
  });

  test("Auth test logout", async () => {
    const response = await request(app)
      .post(baseUrl + "/login")
      .send(testUser);
    expect(response.statusCode).toBe(200);
    testUser.accessToken = response.body.accessToken;

    const response2 = await request(app).post(baseUrl + "/logout");
    expect(response2.statusCode).toBe(200);

    const response3 = await request(app).post(baseUrl + "/refresh");
    expect(response3.statusCode).not.toBe(200);
  });
});
