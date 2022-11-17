export function getDayDateInterval(date: Date) {
    let dateIntervals = [];

    date.setHours(0, 0, 0, 0);
    let nextDay: Date = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);

    do {
        let startDate: Date = new Date(date);
        let endDate: Date = new Date(startDate);
        endDate.setHours(date.getHours() + 1);
        date = endDate;

        dateIntervals.push([startDate, endDate])
    } while (date < nextDay)


    return dateIntervals

}

