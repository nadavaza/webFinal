import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import postModel from "../models/posts_model";
import { Express } from "express";
import userModel, { IUser } from "../models/users_model";

var app: Express;

type User = IUser & { token?: string };
const testUser: User = {
  userName: "testuser",
  email: "test@email",
  password: "testpassword",
  photo: "",
};

beforeAll(async () => {
  app = await initApp();
  await postModel.deleteMany();

  await userModel.deleteMany();
  await request(app).post("/auth/register").send(testUser);
  const res = await request(app).post("/auth/login").send(testUser);
  testUser.token = res.body.accessToken;
  testUser._id = res.body._id;
  expect(testUser.token).toBeDefined();
});

afterAll((done) => {
  mongoose.connection.close();
  done();
});

let postId = "";
describe("Posts Tests", () => {
  test("Posts test get all", async () => {
    const response = await request(app)
      .get("/posts")
      .set("Authorization", "JWT " + testUser.token);
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(0);
  });

  test("Test Create Post", async () => {
    const response = await request(app)
      .post("/posts")
      .set({ authorization: "JWT " + testUser.token })
      .send({
        title: "Test Post",
        content: "Test Content",
        owner: testUser._id,
      });
    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe("Test Post");
    expect(response.body.content).toBe("Test Content");
    postId = response.body._id;
  });

  test("Test get post by id", async () => {
    const response = await request(app)
      .get("/posts/" + postId)
      .set({ authorization: "JWT " + testUser.token });
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe("Test Post");
    expect(response.body.content).toBe("Test Content");
  });

  test("Test Create Post 2", async () => {
    const response = await request(app)
      .post("/posts")
      .set({ authorization: "JWT " + testUser.token })
      .send({
        title: "Test Post 2",
        content: "Test Content 2",
        owner: testUser._id,
      });
    expect(response.statusCode).toBe(201);
  });

  test("Posts test get all 2", async () => {
    const response = await request(app)
      .get("/posts")
      .set({ authorization: "JWT " + testUser.token });
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(2);
  });

  test("Test Delete Post", async () => {
    const response = await request(app)
      .delete("/posts/" + postId)
      .set({ authorization: "JWT " + testUser.token });
    expect(response.statusCode).toBe(200);
    const response2 = await request(app)
      .get("/posts/" + postId)
      .set({ authorization: "JWT " + testUser.token });
    expect(response2.statusCode).toBe(404);
  });

  test("Test Create Post fail", async () => {
    const response = await request(app)
      .post("/posts")
      .set({ authorization: "JWT " + testUser.token })
      .send({
        content: "Test Content 2",
      });
    expect(response.statusCode).toBe(400);
  });
});
