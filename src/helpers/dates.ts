import moment from 'moment';

export const dateToString = (date: Date) => moment(date).format('YYYY-MM-DD');
