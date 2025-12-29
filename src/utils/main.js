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
    const day = new Date(current);

    if (holidayChecker(holidays, day) || sundayChecker(sundays, day)) {
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
    const dayString = day.toUTCString().split(' ').slice(1, 4).join(' '); // "29 Dec 2025"

    result.push({
      day: dayString,         // <-- item.day will now have full date
      date: day,              // keep actual Date object too
      attendence: attendencePerform(present, held),
      absent: absent
    });

    current.setUTCDate(current.getUTCDate() + 1);
  }

  return result;
}

export default attendenceCalculator;
