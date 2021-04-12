import { createAction,props } from '@ngrx/store';

export const createNote = createAction("[Notes] Note Created",props<{ id: string, title?: string, content?: string, color: string, tags?: Array<string> }>());
export const editNote = createAction("[Notes] Note Edited",props<{ id: string, title?: string, content?: string, color?: string, tags?: Array<string> }>());
export const deleteNote = createAction("[Notes] Note Deleted",props<{ id: string }>());