import getConfig from "next/config";
import mongoose from "mongoose";

const { serverRuntimeConfig } = getConfig();
const Schema = mongoose.Schema;

mongoose.connect(
  process.env.MONGODB_URI || serverRuntimeConfig.connectionString
);
mongoose.Promise = global.Promise;

export const db = {
  User: userModel(),
  Date: dateModel(),
  Vacation: vacationModel(),
};

// mongoose models with schema definitions

function userModel() {
  const schema = new Schema(
    {
      id: { type: Number, unique: true, required: true },
      username: { type: String, unique: true, required: true },
      firstName: { type: String, required: true },
      email: {
        type: String,
        required: true,
        unique: true,
        match: /^\S+@\S+\.\S+$/,
      },
      password: { type: String, required: true, minlength: 6 },
      role: {
        type: String,
        enum: ["administrador", "empleado"],
        required: true,
      },
    },
    {
      // add createdAt and updatedAt timestamps
      timestamps: true,
    }
  );

  schema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      delete ret._id;
      delete ret.hash;
    },
  });

  return mongoose.models.User || mongoose.model("User", schema);
}

function dateModel() {
  const schema = new Schema({
    date: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^\d{4}-\d{2}-\d{2}$/.test(v);
        },
        message: (props) =>
          `${props.value} is not a valid date format (YYYY-MM-DD)!`,
      },
    },
    hour: { type: String, required: true },
    userId: { type: Number, ref: "users", required: true },
    description: { type: String, required: false },
    state: {
      type: String,
      enum: ["pendiente", "completada", "cancelada"],
      required: true,
    },
  });

  schema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      delete ret._id;
      delete ret.hash;
    },
  });

  return mongoose.models.Date || mongoose.model("Date", schema);
}

function vacationModel() {
  const schema = new Schema(
    {
      userId: { type: Number, ref: "users", required: true },
      startDate: {
        type: String,
        required: true,
        validate: {
          validator: function (v) {
            return /^\d{4}-\d{2}-\d{2}$/.test(v);
          },
          message: (props) =>
            `${props.value} is not a valid date format (YYYY-MM-DD)!`,
        },
      },
      finishDate: {
        type: String,
        required: true,
        validate: {
          validator: function (v) {
            return /^\d{4}-\d{2}-\d{2}$/.test(v);
          },
          message: (props) =>
            `${props.value} is not a valid date format (YYYY-MM-DD)!`,
        },
      },
      state: {
        type: String,
        enum: ["aprobado", "pendiente", "rechazado"],
        required: true,
      },
      comments: { type: String, required: false },
    },
    { timestamps: false }
  );

  schema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      delete ret._id;
      delete ret.hash;
    },
  });

  return mongoose.models.Vacation || mongoose.model("Vacation", schema);
}
