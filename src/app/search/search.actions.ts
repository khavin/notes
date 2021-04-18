import { createAction, props } from '@ngrx/store';

export const search = createAction("[Search] Search String Added ",props<{ searchString:string }>());