



export function get_Date() {
    const now = new Date()
    return now.getDate();
}
export function getSundays(date) {
    const month = date.getMonth();
    const year = date.getFullYear();
    const startDate = date.getDate();

    let sundays = [];
    let cnt = 4;

    let cdate = new Date(year, month, startDate);
    while (cdate.getMonth() === month && cnt > 0) {
        if (cdate.getDay() === 0) {
            sundays.push(new Date(cdate));
            cnt = cnt - 1;
        }
        cdate.setDate(cdate.getDate() + 1);
    }
    let date2 = new Date(year, month + 1, 1);
    while (date2.getMonth() === month + 1 && cnt > 0) {
        if (date2.getDay() === 0) {
            sundays.push(new Date(date2));
            cnt = cnt - 1;
        }
        date2.setDate(date2.getDate() + 1);
    }
    return sundays;
}

export function getMaxDaysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
}

function sameDate(a, b) {
    return (
        a.getDate() === b.getDate() &&
        a.getMonth() === b.getMonth() &&
        a.getFullYear() === b.getFullYear()
    );
}

export function holidayChecker(holidays, date) {
    return holidays.some(d => sameDate(d, date));
}

export function sundayChecker(sun, date) {
    return sun.some(d => sameDate(d, date));
}

export function absentChecker(leaves, date) {
    return leaves.some(d => sameDate(d, date));
}


export function attendencePerform(periodsPresent, totalPeriods) {
    let attendance = (periodsPresent / totalPeriods) * 100;
    return Number(attendance.toFixed(2));
}

