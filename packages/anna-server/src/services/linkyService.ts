import linky from '@bokub/linky';
import isBefore from 'date-fns/isBefore';
import addDays from 'date-fns/addDays';
import format from 'date-fns/format';

import { findLastEntry, save, Consumption } from 'modules/consumption/model';
import * as logger from 'utils/logger';

const LINKY_USER = process.env.LINKY_USER;
const LINKY_PASSWORD = process.env.LINKY_PASSWORD;

function formatDate(date: Date): string {
  return format(date, 'dd/MM/yyyy');
}

async function getLastEntryInDatabase(): Promise<Consumption | undefined> {
  return findLastEntry();
}

export async function getRange() {
  const yesterday = addDays(new Date(), -1);

  const lastEntry = await getLastEntryInDatabase();
  if (!lastEntry) {
    const lastWeek = addDays(yesterday, -7);

    return {
      start: formatDate(lastWeek),
      end: formatDate(yesterday),
    };
  }

  const dayAfterLastEntry = addDays(new Date(lastEntry.date), 1);

  if (isBefore(dayAfterLastEntry, yesterday)) {
    return {
      start: formatDate(dayAfterLastEntry),
      end: formatDate(yesterday),
    };
  }
  return null;
}

export async function fetchLinkyData() {
  try {
    logger.info('Retrieving Linky value');
    const range = await getRange();

    if (range) {
      const session = await linky.login(LINKY_USER, LINKY_PASSWORD);
      logger.info(JSON.stringify(range));
      const data: {
        date: string;
        value: number;
      }[] = await session.getDailyData(range);

      await save(
        data.map((consumption) => ({
          date: new Date(consumption.date),
          value: consumption.value,
        })),
      );
    } else {
      logger.info(`Last entries is yesterday`);
    }
  } catch (err) {
    logger.error(`Error while retrieving Linky value: ${err.message}`);
  }
}

const ONE_DAY = 24 * 60 * 60 * 1000;
export function run() {
  logger.info('Linky service launched');
  fetchLinkyData();
  setInterval(() => fetchLinkyData(), ONE_DAY);
}
