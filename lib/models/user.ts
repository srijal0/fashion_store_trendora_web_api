// import mongoose, { Schema, models } from "mongoose";

// const UserSchema = new Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     bio: {
//       type: String,
//       default: null,
//     },
//     phone: {
//       type: String,
//       default: null,
//     },
//     image: {
//       type: String,
//       default: null,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// const User = models.User || mongoose.model("User", UserSchema);

// export default User;

import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {              // ✅ ADDED
      type: String,
      required: true,
    },
    role: {                  // ✅ ADDED
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    bio: {
      type: String,
      default: null,
    },
    phone: {
      type: String,
      default: null,
    },
    image: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const User = models.User || mongoose.model("User", UserSchema);
export default User;