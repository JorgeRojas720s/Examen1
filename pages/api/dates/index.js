import { apiHandler, usersRepo } from 'helpers/api';
import { datesRepo } from 'helpers/api/dates-repo';

export default apiHandler({
    get: getAll
});

async function getAll(req, res) {
    const dates = await datesRepo.getAll();
    return res.status(200).json(dates);
}
