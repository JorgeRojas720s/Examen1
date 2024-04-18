import { apiHandler, usersRepo } from 'helpers/api';
import { datesRepo } from 'helpers/api/dates-repo';
import { vacationsRepo } from 'helpers/api/vacations-repo';

export default apiHandler({
    get: getAll
});

async function getAll(req, res) {
    const vacations = await vacationsRepo.getAll();
    return res.status(200).json(vacations);
}
