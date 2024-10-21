import {toZonedTime } from 'date-fns-tz';


export const convertToUTC = (dateString: string, timeString: string, timeZone: string): string => {
    const localDateTimeString: string = `${dateString}T${timeString}:00`;

    const localDate: Date = new Date(localDateTimeString);
    const utcDate: Date = toZonedTime(localDate, timeZone);

    const isoString: string = utcDate.toISOString();
    return isoString;
};

export const getTimeZone = (): string => {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return timeZone;
};
