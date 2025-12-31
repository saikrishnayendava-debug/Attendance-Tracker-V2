export function get_Date() {
    const now = new Date()
    return now.getDate();
}

export function getSundays(date) {
    const validDate = date instanceof Date ? date : new Date(date);
    
    const month = validDate.getMonth();
    const year = validDate.getFullYear();
    const startDate = validDate.getDate();

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
    // Safety checks to prevent crash
    if (!a || !b) return false;
    
    const dateA = a instanceof Date ? a : new Date(a);
    const dateB = b instanceof Date ? b : new Date(b);
    
    if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) return false;
    
    return (
        dateA.getDate() === dateB.getDate() &&
        dateA.getMonth() === dateB.getMonth() &&
        dateA.getFullYear() === dateB.getFullYear()
    );
}

export function holidayChecker(holidays, date) {
    if (!holidays || !Array.isArray(holidays)) return false;
    return holidays.some(d => sameDate(d, date));
}

export function sundayChecker(sun, date) {
    if (!sun || !Array.isArray(sun)) return false;
    
    // Auto-detect Sundays
    const validDate = date instanceof Date ? date : new Date(date);
    if (!isNaN(validDate.getTime()) && validDate.getDay() === 0) return true;
    
    return sun.some(d => sameDate(d, date));
}

export function absentChecker(leaves, date) {
    if (!leaves || !Array.isArray(leaves)) return false;
    return leaves.some(d => sameDate(d, date));
}

export function attendencePerform(periodsPresent, totalPeriods) {
    if (totalPeriods === 0) return 0;
    let attendance = (periodsPresent / totalPeriods) * 100;
    return Number(attendance.toFixed(2));
}
