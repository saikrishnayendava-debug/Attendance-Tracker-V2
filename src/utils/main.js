import {
  absentChecker,
  holidayChecker,
  sundayChecker,
  attendencePerform
} from './utils.js';

function attendenceCalculator(
  holidays,
  leaves,
  daysToPredict,
  periods_present,
  total_periods_held,
  startDate,
  sundays,
  periods_per_day
) {
  const result = [];
  let present = periods_present;
  let held = total_periods_held;

  // Use UTC
  let current = new Date(Date.UTC(
    startDate.getUTCFullYear(),
    startDate.getUTCMonth(),
    startDate.getUTCDate()
  ));

  for (let i = 0; i < daysToPredict; i++) {
    const day = new Date(Date.UTC(
      current.getUTCFullYear(),
      current.getUTCMonth(),
      current.getUTCDate()
    ));

    // Skip Sundays (automatically detected) and holidays
    if (sundayChecker(sundays, day) || holidayChecker(holidays, day)) {
      current.setUTCDate(current.getUTCDate() + 1);
      continue;
    }

    const absent = absentChecker(leaves, day);

    if (absent) {
      held += periods_per_day;
    } else {
      present += periods_per_day;
      held += periods_per_day;
    }

    // Set day as full UTC date string
    const dayString = day.toUTCString().split(' ').slice(1, 4).join(' ');

    result.push({
      day: dayString,
      date: day,
      attendence: attendencePerform(present, held),
      absent: absent
    });

    current.setUTCDate(current.getUTCDate() + 1);
  }

  return result;
}

export default attendenceCalculator;
