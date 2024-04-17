import { apiHandler, usersRepo } from 'helpers/api';

export default apiHandler({
    post: register
});

async function register(req, res) {
    try {
        const user = await usersRepo.create(req.body);
        return res.status(200).json({ response: user === null ? "" : "User created" });
    } catch (error) {
        return res.status(error.status || 500).json({ error: error.message });
    }
 }
