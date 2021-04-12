import { createSelector } from '@ngrx/store';
import { numberToFullMonthMappings, numberToShortMonthMappings } from './calendar.constants';

const getCalendarState = createSelector(
    state => state["global"]["calendar"],
    (calendarState) => calendarState 
)

export const getSelectedDate = createSelector(
  getCalendarState,
  (calendarState) => {
    return calendarState.selectedDate;
  }
);

export const getPreviewMonth = createSelector(
  getCalendarState,
  (calendarState) => {
    return calendarState.selectedMonth;
  }
);

export const getPreviewMonthShortName = createSelector(
  getPreviewMonth,
  (month: number) => {
    return numberToShortMonthMappings[month];
  }
)

export const getPreviewMonthName = createSelector(
  getPreviewMonth,
  (month: number) => {
    return numberToFullMonthMappings[month];
  }
)

export const getPreviewYear = createSelector(
  getCalendarState,
  (calendarState) => {
    return calendarState.selectedYear;
  }
);

export const getPreviewMonthAndYear = createSelector(
  getCalendarState,
  (calendarState) => {
    return [ calendarState.selectedMonth, calendarState.selectedYear];
  }
);