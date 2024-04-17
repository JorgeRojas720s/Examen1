import { apiHandler, usersRepo } from "helpers/api";
import { datesRepo } from "helpers/api/dates-repo";
import { vacationsRepo } from "helpers/api/vacations-repo";

export default apiHandler({
  get: getById,
  put: update,
  delete: _delete,
});

async function getById(req, res) {
  const vacation = await vacationsRepo.getById(req.query.id);

  if (!vacation) throw "Vacation Not Found";

  return res.status(200).json(vacation);
}

async function update(req, res) {
  console.log("pepepepe")
  await vacationsRepo.update(req.query.id, req.body);
  return res.status(200).json({ message: "vacation updated" });
}

async function _delete(req, res) {
  await vacationsRepo.delete(req.query.id);
  return res.status(200).json({ message: "vacation deleted" });
}
