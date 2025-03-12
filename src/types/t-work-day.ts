import { TNullable } from "./t-nullable";

export type TWorkDay = {
    date: TNullable<Date>;
    dayOfWeek?: number;
    startHour: number;
    startMinute: number;
    endHour: number;
    endMinute: number;
}
