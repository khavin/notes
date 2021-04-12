import { createReducer, on } from '@ngrx/store';
import { resetCalendarState, changeSelectedDate, changePreviewMonth, changePreviewYear, changePreviewToToday, incrementPreviewMonth, decrementPreviewMonth } from './calendar.actions';

export interface CalendarState {
  selectedDate: Date;
  selectedMonth: number;
  selectedYear: number;
}

// Get current date
let currentDate:Date = new Date();

const initialState: CalendarState = {
  selectedDate: currentDate,
  selectedMonth: currentDate.getMonth(),
  selectedYear: currentDate.getFullYear()
};

export const calendarReducer = createReducer(
  initialState,
  on(changeSelectedDate, (state, { date }) => {
    return {
      ...state,
      selectedDate: date,
    };
  }),
  on(changePreviewMonth, (state, { month }) => {
    return {
      ...state,
      selectedMonth: month,
    };
  }),
  on(changePreviewYear, (state, { year }) => {
    return {
      ...state,
      selectedYear: year,
    };
  }),
  on(incrementPreviewMonth, (state) => {
    let newMonth:number = state.selectedMonth + 1;
    let newYear:number = state.selectedYear;
    if(state.selectedMonth == 11){
      newMonth = 0;
      newYear = newYear + 1;
    }
    return {
      ...state,
      selectedMonth: newMonth,
      selectedYear: newYear
    };
  }),
  on(decrementPreviewMonth, (state) => {
    let newMonth:number = state.selectedMonth - 1;
    let newYear:number = state.selectedYear;
    if(state.selectedMonth == 0){
      newMonth = 11;
      newYear = newYear - 1;
    }
    return {
      ...state,
      selectedMonth: newMonth,
      selectedYear: newYear
    };
  }),
  on(changePreviewToToday, (state) => {
    return {
      ...state,
      selectedMonth: state.selectedDate.getMonth(),
      selectedYear: state.selectedDate.getFullYear()
    }
  }),
  on(resetCalendarState, (state) => {
    let currentDate:Date = new Date();
    return {
      ...state,
      selectedDate: currentDate,
      selectedMonth: currentDate.getMonth(),
      selectedYear: currentDate.getFullYear(),
    };
  })
);
