import { createSelector } from '@ngrx/store';

export const getPickedColors = createSelector(
    state => state["global"]["colors"],
    (state) => {
        return { 
            pickedColors: state.pickedColors,
            noColorSelected: state.noColorSelected
        }
    }
)