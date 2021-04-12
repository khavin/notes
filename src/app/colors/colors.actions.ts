 import { createAction, props} from '@ngrx/store';

 export const addColor = createAction("[Colors] Color Added",props<{ color:string }>());
 export const removeColor = createAction("[Colors] Color Removed",props<{ color:string }>());
 export const resetColorState = createAction("[Colors] Colors State Reset");