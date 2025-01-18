import mongoose, { Schema } from "mongoose";

export interface IComments {
  content: string;
  owner: Schema.Types.ObjectId;
  date: Date;
  postId: string;
}

const commentsSchema = new mongoose.Schema<IComments>({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  postId: {
    type: String,
    ref: "Posts",
    required: true,
  },
});

const commentsModel = mongoose.model<IComments>("Comments", commentsSchema);

export default commentsModel;
