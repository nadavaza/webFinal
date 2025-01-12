import mongoose from "mongoose";

export interface IPost {
  title: string;
  content: string;
  owner: string;
}

const postSchema = new mongoose.Schema<IPost>(
  {
    title: {
      type: String,
      required: true,
    },
    content: String,
    owner: {
      type: String,
      ref: "Users",
      required: true,
    }
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } });


postSchema.virtual("comments", {
  ref: "Comments", 
  localField: "_id",
  foreignField: "postId",
});

const postModel = mongoose.model<IPost>("Posts", postSchema);

export default postModel;
