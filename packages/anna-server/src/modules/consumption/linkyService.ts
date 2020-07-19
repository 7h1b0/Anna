import linky from '@bokub/linky';
import isBefore from 'date-fns/isBefore';
import addDays from 'date-fns/addDays';
import format from 'date-fns/format';

// import { schedule } from 'services/scheduleService';
import { findLastEntry, save } from 'modules/consumption/model';
import * as logger from 'utils/logger';

const LINKY_USER = process.env.LINKY_USER;
const LINKY_PASSWORD = process.env.LINKY_PASSWORD;

function formatDate(date: Date): string {
  return format(date, 'dd/MM/yyyy');
}

export async function getRange() {
  const yesterday = addDays(new Date(), -1);

  const lastEntry = await findLastEntry();
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

export function run() {
  logger.info('Linky service disabled');
  // schedule('linky', '0 0 10 * * *', fetchLinkyData);
}
