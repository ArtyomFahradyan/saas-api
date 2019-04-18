import moment from 'moment';

export const isValidDate = (value) => {
    return  moment(value).isValid();
};
