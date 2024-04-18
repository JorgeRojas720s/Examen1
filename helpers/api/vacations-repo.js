import getConfig from "next/config";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { db } from "helpers/api";

const { serverRuntimeConfig } = getConfig();
const Vacation = db.Vacation;
const User = db.User;
const Date = db.Date;

export const vacationsRepo = {
  getAll,
  getById,
  create,
  update,
  delete: _delete,
};

async function getAll() {
  return await Vacation.find();
}

async function getById(id) {
  return await Vacation.findById(id);
}

async function unregisteredUser(params) {
  //revisa si el user esta registrado
  if (!(await User.findOne({ id: params.userId }))) {
    throw {
      message: "The user with id " + params.userId + " is not registered",
      status: 401,
    };
  }
}

function dateOnVacationRange(params, dates) { //revisa si en el rango de vacaciones hay una cit
  for (const datesAux of dates) {
    if (
      datesAux.date >= params.startDate &&
      datesAux.date <= params.finishDate
    ) {
      console.log("eoleeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
      throw {
        message:
          "It is not possible to take vacations from " +
          params.startDate +
          " to " +
          params.finishDate +
          " because there is an appointment on:" +
          datesAux.date,
        status: 401,
      };
    }
  }
}

async function haveVacationsInRange(params, vacations) { //revisa si puede sacar vacaciones en ese rango
  for (const vacationsAux of vacations) {
    if (
      (params.startDate > vacationsAux.finishDate &&
        params.finishDate > vacationsAux.finishDate) ||
      (params.startDate < vacationsAux.satartDate &&
        params.finishDate < vacationsAux.startDate)
    ) {
      saveVacation(params);
      return true;
    } else {
      throw {
        message: "You already have vacations in that period",
        status: 401,
      };
    }
  }
  return false;
}

async function saveVacation(params) {
  const vacation = new Vacation(params);
  await vacation.save();
}

async function create(params) {
  // validate
  await unregisteredUser(params);

  if (params.startDate < params.finishDate) {
    let dates = await Date.find();

    dateOnVacationRange(params, dates);

    let vacations = await Vacation.find({ userId: params.userId });

    if (!(await haveVacationsInRange(params, vacations))) {
      await saveVacation(params);
    }
  } else {
    throw {
      message: "Start date is greater than end date",
      status: 401,
    };
  }
}

async function update(id, params) {
  const vacation = await Vacation.findById(id);

  // validate
  if (!vacation) throw "Vacation not found";

  if (params.startDate < params.finishDate) {
    await unregisteredUser(params);

    let dates = await Date.find();
    dateOnVacationRange(params, dates);

    // copy params properties to user
    Object.assign(vacation, params);
    await vacation.save();
  } else {
    throw {
      message: "Start date is greater than end date",
      status: 401,
    };
  }
}

async function _delete(id) {
  try {
    await Vacation.findByIdAndDelete(id);
  } catch (error) {
    throw "The ID entered does not exist in the database";
  }
}
