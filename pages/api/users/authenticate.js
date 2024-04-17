import { apiHandler, usersRepo } from "helpers/api";

export default apiHandler({
  post: authenticate,
});

async function authenticate(req, res) {
  console.log("Autneticateeeeeeeeeeeee:", req.body);

  try {
    const user = await usersRepo.authenticate(req.body);
    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}
