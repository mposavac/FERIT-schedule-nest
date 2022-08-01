import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import { existsSync, mkdir, writeFileSync, statSync } from 'fs';
import moment from 'moment';
import { join } from 'path';

const fetchAndParse = async (date: string) => {
  const response = await axios.request({
    method: 'GET',
    url: `https://mrkve.etfos.hr/api/raspored/index.php?date=${date}`,
    responseType: 'arraybuffer',
    responseEncoding: 'binary',
  });
  const decoder = new TextDecoder('windows-1250');
  const dataString = decoder.decode(response.data);

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@',
    allowBooleanAttributes: true,
  });
  const data = parser.parse(dataString);
  if (Array.isArray(data?.raspored?.stavkaRasporeda))
    return data?.raspored?.stavkaRasporeda || [];
  else if (typeof data?.raspored?.stavkaRasporeda === 'object')
    return [data?.raspored?.stavkaRasporeda];
  else return [];
};

export const checkForJSON = async (start_date: Date, end_date: Date) => {
  const dir = join(__dirname, 'schedule_by_date');
  if (!existsSync(dir))
    mkdir(dir, { recursive: true }, (err) => {
      if (err) console.log(err);
    });

  const moment_start = moment(start_date);
  const moment_end = moment(end_date);
  for (let i = 0; i <= moment_end.diff(moment_start, 'days'); i++) {
    const curr_date = moment(start_date).add(i, 'days');
    const curr_date_f = moment(curr_date).format('YYYY-MM-DD');

    if (!existsSync(`${dir}/${curr_date_f}.json`)) {
      const raspored = await fetchAndParse(curr_date_f);
      writeFileSync(`${dir}/${curr_date_f}.json`, JSON.stringify(raspored));
    } else {
      const { mtime } = statSync(`${dir}/${curr_date_f}.json`);
      if (
        moment().diff(moment(mtime), 'days') >
        parseInt(process.env.SCHEDULE_UPDATE_PERIOD)
      ) {
        const raspored = await fetchAndParse(curr_date_f);
        writeFileSync(`${dir}/${curr_date_f}.json`, JSON.stringify(raspored));
      }
    }
  }
};
