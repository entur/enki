import moment from 'moment';

export const dateToString = date => moment(date).format('YYYY-MM-DD');
