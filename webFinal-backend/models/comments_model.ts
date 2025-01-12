import mongoose from "mongoose";

export interface IComments {
  content: string;
  writer: string;
  postId: string;
}

const commentsSchema = new mongoose.Schema<IComments>({
  writer: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  postId: {
    type: String,
    ref: "Posts",
    required: true,
  },
});

const commentsModel = mongoose.model<IComments>("Comments", commentsSchema);

export default commentsModel;
