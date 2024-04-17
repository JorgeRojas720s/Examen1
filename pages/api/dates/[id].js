import { apiHandler, usersRepo } from "helpers/api";
import { datesRepo } from "helpers/api/dates-repo";

export default apiHandler({
  get: getById,
  put: update,
  delete: _delete,
});

async function getById(req, res) {
  const date = await datesRepo.getById(req.query.id);

  if (!date) throw "Date Not Found";

  return res.status(200).json(date);
}

async function update(req, res) {
  console.log("pepepepe")
  await datesRepo.update(req.query.id, req.body);
  return res.status(200).json({ message: "date updated" });
}

async function _delete(req, res) {
  await datesRepo.delete(req.query.id);
  return res.status(200).json({ message: "date deleted" });
}
