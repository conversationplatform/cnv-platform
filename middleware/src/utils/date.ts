export function getDayDateInterval(date: Date) {
    const dateIntervals = [];

    date.setHours(0, 0, 0, 0);
    const nextDay: Date = new Date(date);
    nextDay.setUTCDate(nextDay.getUTCDate() + 1);

    do {
        const startDate: Date = new Date(date);
        const endDate: Date = new Date(startDate);
        endDate.setUTCHours(date.getUTCHours() + 1);
        date = endDate;
        dateIntervals.push([startDate, endDate]);
    } while (date < nextDay);

    return dateIntervals;
}
