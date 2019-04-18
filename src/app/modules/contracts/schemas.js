import { USER_AUTH } from '../../configs/constants';

export default {
    getUserContracts: {
        authentication: true,
        authenticationType: USER_AUTH
    },
    getOne: {
        authentication: true,
        authenticationType: USER_AUTH
    }
};
