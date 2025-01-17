import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import commentsModel, { IComments } from "../models/comments_model";
import postModel, { IPost } from "../models/posts_model";
import userModel, { IUser } from "../models/users_model";
import { Express } from "express";

var app: Express;

type User = IUser & { token?: string };
const testUser: User = {
  password: "testpassword",
  email: "test@email",
  userName: "testuser",
  photo: "",
};

const testPost: IPost = {
  title: "Test Post",
  content: "This is a test post content",
  owner: "testuser",
  photo: "",
  date: new Date(),
  likes: [],
};

const testComment: IComments = {} as IComments;

let postId: string;

beforeAll(async () => {
  app = await initApp();
  await userModel.deleteMany();
  await postModel.deleteMany();
  await commentsModel.deleteMany();

  await request(app).post("/auth/register").send(testUser);
  const loginResponse = await request(app).post("/auth/login").send(testUser);
  testUser.token = loginResponse.body.accessToken;
  testUser._id = loginResponse.body._id;
  expect(testUser.token).toBeDefined();

  const postResponse = await request(app)
    .post("/posts")
    .set("Authorization", "JWT " + testUser.token)
    .send(testPost);
  postId = postResponse.body._id;
  expect(postId).toBeDefined();

  testComment.content = "This is a test comment";
  testComment.postId = postId;
  if (testUser._id) {
    testComment.owner = testUser._id;
  } else {
    throw new Error("User ID is undefined");
  }
});

afterAll((done) => {
  console.log("afterAll");
  mongoose.connection.close();
  done();
});

describe("Comments API Tests", () => {
  test("Create comment on a post", async () => {
    const response = await request(app)
      .post(`/comments`)
      .set("Authorization", "JWT " + testUser.token)
      .send(testComment);

    expect(response.statusCode).toBe(201);
    expect(response.body.content).toBe(testComment.content);
    expect(response.body.postId).toBe(postId);
  });

  test("Fail to create comment without token", async () => {
    const response = await request(app).post(`/comments`).send(testComment);

    expect(response.statusCode).toBe(401);
  });

  test("Delete a comment", async () => {
    const response = await request(app)
      .post(`/comments`)
      .set("Authorization", "JWT " + testUser.token)
      .send(testComment);

    const commentId = response.body._id;

    // Now delete the comment
    const deleteResponse = await request(app)
      .delete(`/comments/${commentId}`)
      .set("Authorization", "JWT " + testUser.token);

    expect(deleteResponse.statusCode).toBe(200);
  });

  test("Fail to delete a comment with invalid token", async () => {
    // Create a comment
    const commentResponse = await request(app)
      .post(`/comments`)
      .set("Authorization", "JWT " + testUser.token)
      .send(testComment);

    const commentId = commentResponse.body._id;

    // Attempt to delete with invalid token
    const deleteResponse = await request(app).delete(`/comments/${commentId}`).set("Authorization", "JWT invalidtoken");

    expect(deleteResponse.statusCode).toBe(401);
  });
});
