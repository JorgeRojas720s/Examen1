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
  //   delete: _delete,
};

async function getAll() {
  return await Vacation.find();
}

async function getById(id) {
  return await Vacation.findById(id);
}

async function unregisteredUser(params) {  //revisa si el user existe
  if (!(await User.findOne({ id: params.userId }))) {
    throw {
      message: "The user with id " + params.userId + " is not registered",
      status: 401,
    };
  }
}

function dateOnVacationRange(params, dates) { //revisa si en el rango de vacaciones hay una cita
  
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

async function saveVacation(params) {
  const vacation = new Vacation(params);
  await vacation.save();
}

async function haveVacationsInRange(params, vacations) {
  for (const vacationsAux of vacations) {
    if (
      (params.startDate > vacationsAux.finishDate &&
        params.finishDate > vacationsAux.finishDate) ||
      (params.startDate < vacationsAux.satartDate &&
        params.finishDate < vacationsAux.startDate)
    ) {
        saveVacation(params);
    } else {
      throw {
        message: "Ya tienes vacaciones en ese periodo",
        status: 401,
      };
    }
  }
}

async function create(params) {
  // validate
  //revisa si el usuario esta registrado
  await unregisteredUser(params);

  if (params.startDate < params.finishDate) {
    let dates = await Date.find();
    //revisa si hay una cita en el rango de vacaoions
    dateOnVacationRange(params, dates);

    let vacations = await Vacation.find({ userId: params.userId });
    //revisa si puede sacar vacaciones en ese rango
    await haveVacationsInRange(params, vacations);

    await saveVacation(params);
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
    unregisteredUser(params);

    let dates = await Date.find();
    dateOnVacationRange(params, dates);

    //  let vacations = await Vacation.find({ userId: params.userId });
    //  let aux = "";
    //  console.log("kjsnvsbfdvbfdb")
    //  haveVacationsInRange(params, vacations, aux, vacation);

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
