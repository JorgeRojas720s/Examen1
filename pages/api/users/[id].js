import { apiHandler, usersRepo } from "helpers/api";
console.log("eoooooooooooooooooooooooooooo?");

export default apiHandler({
  get: getById,
  put: update,
  delete: _delete,
});

async function getById(req, res) {
  console.log("Tamooooooooooooooooooooooooos aqui?");
  const user = await usersRepo.getById(req.query.id);

  if (!user) throw "User Not Found";

  return res.status(200).json(user);
}

async function update(req, res) {
  await usersRepo.update(req.query.id, req.body);
  return res.status(200).json({ message: "user updated" });
}

async function _delete(req, res) {
  await usersRepo.delete(req.query.id);
  return res.status(200).json({ message: "user deleted" });
}
