import { readFileSync, stat } from 'fs';
import moment from 'moment';
import { join } from 'path';

export const extractFromJSON = async (start_date: Date, end_date: Date) => {
  const dir = join(__dirname, 'schedule_by_date');
  const moment_start = moment(start_date);
  const moment_end = moment(end_date);
  const extractedData = [];
  for (let i = 0; i <= moment_end.diff(moment_start, 'days'); i++) {
    const curr_date = moment(start_date).add(i, 'days');
    const curr_date_f = moment(curr_date).format('YYYY-MM-DD');
    try {
      const file = readFileSync(`${dir}/${curr_date_f}.json`, 'utf-8');
      extractedData.push(JSON.parse(file));
    } catch (e) {
      console.log(e);
    }
  }

  return extractedData;
};
