import getConfig from "next/config";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { db } from "helpers/api";

const { serverRuntimeConfig } = getConfig();
const User = db.User;

export const usersRepo = {
  authenticate,
  getAll,
  getById,
  create,
  update,
  delete: _delete,
};

async function authenticate({ username, password }) {
  console.log("holaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", username);
  const user = await User.findOne({ username });
  console.log("byeeeeeeeeeeeeeeee", password);
  if (!(user && bcrypt.compareSync(password, user.password))) {
    throw "Username or password is incorrect";
  }

  // create a jwt token that is valid for 7 days
  const token = jwt.sign({ sub: user.id }, serverRuntimeConfig.secret, {
    expiresIn: "7d",
  });
  console.log("Tokeeeeeeeeeeeeeen", token);
  return {
    ...user.toJSON(),
    token,
  };
}

async function getAll() {
  return await User.find();
}

async function getById(id) {
  console.log("Probannndo");
  return await User.findOne({ id: id }); 
}

async function create(params) {
  // validate
  if (await User.findOne({ id: params.id })) {
    throw {
      message: 'ID "' + params.id + '" already exists',
      status: 401,
    };
  }
  if (await User.findOne({ username: params.username })) {
    throw {
      message: 'Username "' + params.username + '" is already taken',
      status: 400,
    };
  }
  if (await User.findOne({ email: params.email })) {
    throw {
      message: 'Email "' + params.email + '" is already in use',
      status: 406,
    };
  }

  const user = new User(params);

  // hash password
  if (params.password) {
    console.log("Creando hash para la contra");
    user.password = bcrypt.hashSync(params.password, 10);
    //es user.password porque es el atributo de User, antes era hash porque se colocaba hash
  }

  // save user
  await user.save();
}

async function update(id, params) {
  const user = await User.findOne({ id: id });
  console.log("🚀 ~ update ~ user:", user);

  // validate
  if (!user) throw "User not found";
  if (
    user.username !== params.username &&
    (await User.findOne({ username: params.username }))
  ) {
    throw 'Username "' + params.username + '" is already taken';
  }

  // hash password if it was entered
  if (params.password) {
    params.password = bcrypt.hashSync(params.password, 10);
  }

  // copy params properties to user
  Object.assign(user, params);

  await user.save();
}

async function _delete(id) {
  await User.findOneAndDelete({id: id});
}
