import { createAction,props } from '@ngrx/store';

// Actions related to calendar component
export const changeSelectedDate = createAction("[Calendar] Date Changed",props<{ date:Date }>());
export const changePreviewMonth = createAction("[Calendar] Month Preview Changed",props<{ month:number }>());
export const changePreviewYear = createAction("[Calendar] Year Preview Changed",props<{ year:number }>());
export const changePreviewToToday = createAction("[Calendar] Date Preview Changed");
export const incrementPreviewMonth = createAction("[Calendar] Increment Month");
export const decrementPreviewMonth = createAction("[Calendar] Decrement Month");