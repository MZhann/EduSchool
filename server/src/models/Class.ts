import mongoose, { Schema, Document, Types } from "mongoose";

export interface IClass extends Document {
  _id: Types.ObjectId;
  name: string;
  teacher: Types.ObjectId;
  joinCode: string;
  joinPassword: string;
  students: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const classSchema = new Schema<IClass>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    teacher: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    joinCode: {
      type: String,
      required: true,
      unique: true,
    },
    joinPassword: {
      type: String,
      required: true,
    },
    students: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

classSchema.index({ teacher: 1 });
classSchema.index({ joinCode: 1 }, { unique: true });

export const Class = mongoose.model<IClass>("Class", classSchema);
