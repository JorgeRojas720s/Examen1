import getConfig from "next/config";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { db } from "helpers/api";

const { serverRuntimeConfig } = getConfig();
const Date = db.Date;
const User = db.User;
const Vacation = db.Vacation;

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

async function unregisteredUser(params) {//revisa si el user existe
  if (!(await User.findOne({ id: params.userId }))) {
    throw {
      message: "The user with id " + params.userId + " is not registered",
      status: 401,
    };
  }
}

function searchDates(params, dates) {//busca si ya existe una feha y hora igual
  for (const dateAux of dates) {
    console.log(
      "🚀 ~ searchDates ~ dateAuxfdgvfdvfdvd:",
      dateAux.date,
      params.date,
      dateAux.hour,
      params.hour
    );

    if (dateAux.date === params.date && dateAux.hour == params.hour) {
      //doble igual porque no ocupo que verifique que son del mismo tipo
      console.log("entrea dateddddddddddddd?");
      return true;
    }
  }
  return false;
}

function appointmentAlredyExists(params, dates) { //verfica si ya la existía una cita
  if (dates.length !== 0) {
    if (searchDates(params, dates) === true) {
      throw {
        message: "There is already an appointment scheduled at that time",
        status: 401,
      };
    }
  }
}


function dateOnVacationRange(params, vacations){ //revisa si la cita esta dentro de un rango de vacaciones

  for (const vacationsAux of vacations) {
      if(params.date >= vacationsAux.startDate && params.date <= vacationsAux.finishDate 
        && vacationsAux.state !== "rechazado"){
        throw {
          message:
            "It is possible for us to schedule an appointment on the date " +
            params.date +
            " because there are vacations from " +
            vacationsAux.startDate +
            " to " +
            vacationsAux.finishDate,
          status: 401,
        };
      }
  }

}

async function create(params) {
  // validate
  await unregisteredUser(params);

  let dates = await Date.find();

  appointmentAlredyExists(params, dates);

  let vacations = await Vacation.find();
  dateOnVacationRange(params,vacations)

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

  let vacations = await Vacation.find();
  dateOnVacationRange(params,vacations);

  // copy params properties to user
  Object.assign(date, params);

  await date.save();
}

async function _delete(id) {
  try {
    await Date.findByIdAndDelete(id);
  } catch (error) {
    throw "The ID entered does not exist in the database";
  }
}