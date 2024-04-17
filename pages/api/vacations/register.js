import { apiHandler, usersRepo } from 'helpers/api';
import { vacationsRepo } from 'helpers/api/vacations-repo';
 import { ValidationError } from 'yup';

export default apiHandler({
    post: register
});

async function register(req, res) {
    try {
        const vacation = await vacationsRepo.create(req.body);
        return res.status(200).json({ response: vacation === null ? "" : "vacation created" });
    } catch (error) {
        return res.status(error.status || 500).json({ error: error.message });
    }
 }
