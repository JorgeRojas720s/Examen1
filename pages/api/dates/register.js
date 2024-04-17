import { apiHandler, usersRepo } from 'helpers/api';
import { datesRepo } from 'helpers/api/dates-repo';
 import { ValidationError } from 'yup';

export default apiHandler({
    post: register
});

async function register(req, res) {
    try {
        const date = await datesRepo.create(req.body);
        return res.status(200).json({ response: date === null ? "" : "date created" });
    } catch (error) {
        return res.status(error.status || 500).json({ error: error.message });
    }
 }
