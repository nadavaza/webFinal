import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import postModel from "../models/posts_model";
import { Express } from "express";
import userModel, { IUser } from "../models/users_model";

var app: Express;

beforeAll(async () => {
  console.log("beforeAll");
  app = await initApp();
  await userModel.deleteMany();
  await postModel.deleteMany();
});

afterAll((done) => {
  console.log("afterAll");
  mongoose.connection.close();
  done();
});

const baseUrl = "/auth";

type User = IUser & {
  accessToken?: string;
  refreshToken?: string;
};

const testUser: User = {
  userName: "testuser",
  password: "testpassword",
};

describe("Auth API Tests", () => {
  test("Auth test register", async () => {
    const response = await request(app)
      .post(baseUrl + "/register")
      .send(testUser);
    expect(response.statusCode).toBe(200);
  });

  test("Auth test register fail - duplicate userName", async () => {
    const response = await request(app)
      .post(baseUrl + "/register")
      .send(testUser);
    expect(response.statusCode).not.toBe(200);

    expect(response.body.errorResponse).toHaveProperty("errmsg", expect.stringContaining("duplicate key error"));
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
        userName: "",
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
    const refreshToken = response.body.refreshToken;
    expect(accessToken).toBeDefined();
    expect(refreshToken).toBeDefined();
    expect(response.body._id).toBeDefined();
    testUser.accessToken = accessToken;
    testUser.refreshToken = refreshToken;
    testUser._id = response.body._id;
  });

  test("Check tokens are not the same", async () => {
    const response = await request(app)
      .post(baseUrl + "/login")
      .send(testUser);
    const accessToken = response.body.accessToken;
    const refreshToken = response.body.refreshToken;

    expect(accessToken).not.toBe(testUser.accessToken);
    expect(refreshToken).not.toBe(testUser.refreshToken);
  });

  test("Auth test login fail - incorrect password", async () => {
    const response = await request(app)
      .post(baseUrl + "/login")
      .send({
        userName: testUser.userName,
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
    const response = await request(app)
      .post(baseUrl + "/refresh")
      .send({
        refreshToken: testUser.refreshToken,
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();
    testUser.accessToken = response.body.accessToken;
    testUser.refreshToken = response.body.refreshToken;
  });

  test("Auth test logout", async () => {
    const response = await request(app)
      .post(baseUrl + "/login")
      .send(testUser);
    expect(response.statusCode).toBe(200);
    testUser.accessToken = response.body.accessToken;
    testUser.refreshToken = response.body.refreshToken;

    const response2 = await request(app)
      .post(baseUrl + "/logout")
      .send({
        refreshToken: testUser.refreshToken,
      });
    expect(response2.statusCode).toBe(200);

    const response3 = await request(app)
      .post(baseUrl + "/refresh")
      .send({
        refreshToken: testUser.refreshToken,
      });
    expect(response3.statusCode).not.toBe(200);
  });
  test("Auth test delete user", async () => {
    const loginResponse = await request(app)
      .post(baseUrl + "/login")
      .send(testUser);
    const accessToken = loginResponse.body.accessToken;

    const deleteResponse = await request(app)
      .delete(baseUrl + "/delete")
      .send({ userName: testUser.userName })
      .set("Authorization", "JWT " + accessToken);
    expect(deleteResponse.statusCode).toBe(200);
  });

  test("Auth test delete user fail - non existing user", async () => {
    const nonExistingUserUserName = "nonExistentuserName";

    const response = await request(app)
      .delete(baseUrl + "/delete")
      .send({ userName: nonExistingUserUserName })
      .set("Authorization", "JWT " + testUser.accessToken);
    expect(response.statusCode).toBe(400);
  });
});
