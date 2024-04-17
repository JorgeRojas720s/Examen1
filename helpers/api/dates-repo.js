import getConfig from "next/config";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { db } from "helpers/api";

const { serverRuntimeConfig } = getConfig();
const Date = db.Date;
const User = db.User;

export const datesRepo = {
  getAll,
  getById,
  create,
  update,
  delete: _delete,
};

async function getAll() {
  return await Date.find();
}

async function getById(id) {
  return await Date.findById(id);
}

async function unregisteredUser(params) { //revisa si el user existe
  if (!(await User.findOne({ id: params.userId }))) {
    throw {
      message: "The user with id " + params.userId + " is not registered",
      status: 401,
    };
  }
}

function searchDates(params, dates) { //busca ya existes una feha y hora igual
  for (const dateAux of dates) {
    if (dateAux.date === params.date && dateAux.hour === params.hour) {
      console.log("entrea date?");
      return true;
    }
  }
  return false;
}

function appointmentAlredyExists(params, dates) { //verfica si ya la existía
  if (dates.length !== 0) {
    if (searchDates(params, dates) === true) {
      throw {
        message: "There is already an appointment scheduled at that time",
        status: 401,
      };
    }
  }
}

async function create(params) {
  // validate
  await unregisteredUser(params);

  let dates = await Date.find();
  console.log("🚀 ~ create ~ dates:", dates);

  appointmentAlredyExists(params, dates);

  const date = new Date(params);

  await date.save();
}

async function update(id, params) {
  console.log("juaauuauauauauau");
  const date = await Date.findById(id);
  console.log("🚀 ~ update ~ date:", date);
  
  // validate
  if (!date) throw "Date not found";

  unregisteredUser(params);
  
  //Busca todas las fechas que no tengan ese userId
  let dates = await Date.find({ userId: { $ne: params.userId } });

  appointmentAlredyExists(params, dates);

  // copy params properties to user
  Object.assign(date, params);

  await date.save();
}

async function _delete(id) {
  await Date.findByIdAndDelete(id);
}
