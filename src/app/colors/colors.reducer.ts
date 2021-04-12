import { createReducer, on} from '@ngrx/store';
import { resetColorState, addColor, removeColor } from './colors.actions';
import { colorDefinitions, allColors} from './colors.constant';

export interface ColorState {
    pickedColors:Array<string>;
    noColorSelected:boolean;
}

const initialState:ColorState = {
    pickedColors: allColors,
    noColorSelected: true
}

export const colorReducer = createReducer(
  initialState,
  on(addColor, (state, { color }) => {
    if (color.toUpperCase() in colorDefinitions) {
      if (state.noColorSelected == true) {
        return {
          ...state,
          noColorSelected: false,
          pickedColors: [color.toUpperCase()],
        };
      } else {
        let tempColors: Array<string> = state.pickedColors.filter(
          (pickedColor) => pickedColor != color.toUpperCase()
        );
        tempColors.push(color.toUpperCase());
        return {
          ...state,
          pickedColors: tempColors,
        };
      }
    } else {
      return {
        ...state,
      };
    }
  }),
  on(removeColor, (state, { color }) => {
    if (
      color.toUpperCase() in colorDefinitions &&
      state.noColorSelected == false &&
      state.pickedColors.includes(color.toUpperCase())
    ) {
      let tempColors: Array<string> = state.pickedColors.filter(
        (pickedColor) => pickedColor != color.toUpperCase()
      );
      if (tempColors.length == 0) {
        return {
          ...state,
          pickedColors: allColors,
          noColorSelected: true,
        };
      } else {
        return {
          ...state,
          pickedColors: tempColors,
        };
      }
    } else {
      return {
        ...state,
      };
    }
  }),
  on(resetColorState, (state) => {
    return {
      ...state,
      pickedColors: allColors,
      noColorSelected: true,
    };
  })
);