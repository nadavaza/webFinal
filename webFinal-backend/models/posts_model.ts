import mongoose, { Schema } from "mongoose";

export interface IPost {
  title: string;
  content: string;
  owner: Schema.Types.ObjectId;
  photo: string;
  date: Date;
  likes: Schema.Types.ObjectId[];
}

const postSchema = new mongoose.Schema<IPost>(
  {
    title: {
      type: String,
      required: true,
    },
    content: String,
    owner: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    photo: {
      type: String,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Users",
      },
    ],
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

postSchema.virtual("comments", {
  ref: "Comments",
  localField: "_id",
  foreignField: "postId",
});

const postModel = mongoose.model<IPost>("Posts", postSchema);

export default postModel;
