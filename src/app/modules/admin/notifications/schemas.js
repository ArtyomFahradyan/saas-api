import { ADMIN_AUTH } from '../../../configs/constants';

export default {
    getAll: {
        authentication: true,
        authenticationType: ADMIN_AUTH
    },
    getOne: {
        authentication: true,
        authenticationType: ADMIN_AUTH
    }
};
