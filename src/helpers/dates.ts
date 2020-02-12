import moment from 'moment';

export const dateToString = (date: string) => moment(date).format('YYYY-MM-DD');
