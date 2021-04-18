import { createSelector } from '@ngrx/store';

export const searchString = createSelector(
    state => state["global"]["searchString"],
    (searchString) => searchString
)