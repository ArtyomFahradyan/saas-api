import { USER_AUTH } from '../../configs/constants';

export default {
    getUserContracts: {
        authentication: true,
        authenticationType: USER_AUTH
    },
    getOne: {
        authentication: true,
        authenticationType: USER_AUTH
    },
    setReminder: {
        authentication: true,
        authenticationType: USER_AUTH
    },
    delete: {
        authentication: true,
        authenticationType: USER_AUTH
    }
};
