import { createSelector } from '@ngrx/store';
import { ColorState } from './colors.reducer';

export const getPickedColors = createSelector(
    state => state['colors'],
    (state:ColorState) => {
        return { 
            pickedColors: state.pickedColors,
            noColorSelected: state.noColorSelected
        }
    }
)