import express from "express";
const router = express.Router();
import postsController from "../controllers/posts_controller";
import { authMiddleware } from "../controllers/auth_controller";

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: The Posts API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - title
 *         - content
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the post
 *         title:
 *           type: string
 *           description: The title of the post
 *         content:
 *           type: string
 *           description: The content of the post
 *         owner:
 *           type: string
 *           description: The owner id of the post
 *       example:
 *         _id: 245234t234234r234r23f4
 *         title: My First Post
 *         content: This is the content of my first post.
 *         author: 324vt23r4tr234t245tbv45by
 */

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get all posts
 *     description: Retrieve a list of all posts
 *     tags:
 *       - Posts
 *     responses:
 *       200:
 *         description: A list of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       500:
 *         description: Server error
 */
router.get(
  "/",
  authMiddleware,
  postsController.getAllHandler(postsController, "owner", [
    { path: "owner", select: "userName photo" },
    { path: "comments", select: "owner" },
    { path: "likes", select: "" },
  ])
);

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Get a post by ID
 *     description: Retrieve a single post by its ID
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the post
 *     responses:
 *       200:
 *         description: A single post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
router.get(
  "/:id",
  authMiddleware,
  postsController.getByIdHandler(postsController, [
    { path: "owner", select: "userName photo" },
    { path: "comments", select: "", populate: { path: "owner", select: "" } },
    { path: "likes", select: "userName" },
  ])
);

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a new post
 *     description: Create a new post
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the post
 *               content:
 *                 type: string
 *                 description: The content of the post
 *               owner:
 *                 type: string
 *                 description: The owner of the post
 *             required:
 *               - title
 *               - content
 *               - owners
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */

router.post(
  "/",
  authMiddleware,
  postsController.createHandler(
    postsController,
    [
      { path: "owner", select: "userName photo" },
      { path: "comments", select: "", populate: { path: "owner", select: "" } },
      { path: "likes", select: "userName" },
    ],
    (req) => {
      req.body.owner = req.params.userId;
    }
  )
);

/**
 * @swagger
 * /posts:
 *   update:
 *     summary: update a post
 *     description: update a post
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the post
 *               content:
 *                 type: string
 *                 description: The content of the post
 *               owner:
 *                 type: string
 *                 description: The owner of the post
 *             required:
 *               - title
 *               - content
 *               - owners
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.put(
  "/:id",
  authMiddleware,
  postsController.updateHandler(postsController, [
    { path: "owner", select: "userName photo" },
    { path: "comments", select: "", populate: { path: "owner", select: "" } },
    { path: "likes", select: "userName" },
  ])
);

/**
 * @swagger
 * posts/{id}:
 *   delete:
 *     summary: Delete a post by ID
 *     description: Delete a single post by its ID
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the post
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", authMiddleware, postsController.deleteItem.bind(postsController));

router.post("/likePost/:id", authMiddleware, postsController.likePost.bind(postsController));

export default router;
