import { Document, Model, Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser {
  name: string;
  phone: string;
  password?: string;
  role: "ADMIN";
  imageProfile?: string; 
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserDocument extends IUser, Document {
  comparePassword(password: string): Promise<boolean>;
}

export type UserDocument = IUser & Document & IUserDocument

const UserSchema = new Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: [true, "Nama wajib diisi!"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Nomor HP wajib ada buat login!"],
      unique: true,
      trim: true,
      match: [
        /^[0-9]{10,15}$/,
        "Nomor HP kaga valid, Masukin angka aja (10-15 digit)",
      ],
    },
    password: {
      type: String,
      required: [true, "Password wajib ada biar aman!"],
      minlength: [8, "Password minimal 8 karakter lah"],
      select: false,
    },
    imageProfile: {
      type: String,
      default: "",
      trim: true,
    },
    role: {
      type: String,
      enum: ["ADMIN"],
      default: "ADMIN",
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
    collection: "users",
    toJSON: {
      transform: (_doc, ret: Partial<IUserDocument>) => {
        delete (ret as any)._id;
        delete ret.password;
        return ret;
      },
    },
  },
);

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password as string, salt);
});

UserSchema.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.password as string);
};

const User =
  (models.User as Model<IUserDocument>) ||
  model<IUserDocument>("User", UserSchema);

export default User;
