import { createSelector } from '@ngrx/store';
import { CalendarState } from './calendar.reducer';
import { numberToFullMonthMappings, numberToShortMonthMappings } from './calendar.constants';

const getCalendarState = createSelector(
    state => state['calendar'],
    (calendarState) => calendarState 
)

export const getSelectedDate = createSelector(
  getCalendarState,
  (calendarState: CalendarState) => {
    return calendarState.selectedDate;
  }
);

export const getPreviewMonth = createSelector(
  getCalendarState,
  (calendarState: CalendarState) => {
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
  (calendarState: CalendarState) => {
    return calendarState.selectedYear;
  }
);

export const getPreviewMonthAndYear = createSelector(
  getCalendarState,
  (calendarState: CalendarState) => {
    return [ calendarState.selectedMonth, calendarState.selectedYear];
  }
);