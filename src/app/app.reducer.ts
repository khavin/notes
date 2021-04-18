import { createReducer, on } from '@ngrx/store';
import { colorDefinitions, allColors } from './colors/colors.constant';
import {
  resetCalendarState,
  changeSelectedDate,
  changePreviewMonth,
  changePreviewYear,
  changePreviewToToday,
  incrementPreviewMonth,
  decrementPreviewMonth,
} from './calendar/calendar.actions';
import {
  resetColorState,
  addColor,
  removeColor,
} from './colors/colors.actions';
import {
  createNote,
  editNote,
  deleteNote,
  selectNote,
} from './notes/notes.actions';

export interface Note {
  id: string;
  title?: string;
  content?: string;
  color: string;
  lastModified?: Date;
  tags?: Array<string>;
}

let currentDate: Date = new Date();

const initialState: Object = {
  calendar: {
    selectedDate: currentDate.toISOString().split('T')[0],
    selectedMonth: currentDate.getMonth(),
    selectedYear: currentDate.getFullYear(),
  },
  colors: {
    pickedColors: allColors,
    noColorSelected: true,
  },
  notes: {
    notesByID: {
      'test 0': {
        id: 'test 0',
        title: 'Her bday',
        content: 'Its her 24th bday',
        color: 'BLUE',
        tags: [],
        lastModified: new Date(2021, 2, 28),
      },
      'test -1': {
        id: 'test -1',
        title: 'Her bday',
        content: 'Its her 24th bday',
        color: '',
        tags: [],
        lastModified: new Date(2021, 2, 22),
      },
      'test 1': {
        id: 'test 1',
        title: 'First note',
        content: 'Its first',
        color: 'BLUE',
        tags: [],
        lastModified: new Date(),
      },
      'test 2': {
        id: 'test 2',
        title: 'Second note',
        content: 'Its second',
        color: 'ORANGE',
        tags: [],
        lastModified: new Date(),
      },
    },
    selectedNoteID: null,
  },
  tags: {
    tagsList: [],
    selectedTags: [],
  },
  searchStrings: [],
};

export const globalReducer = createReducer(
  initialState,
  on(changeSelectedDate, (state, { date }) => {
    return {
      ...state,
      calendar: {
        ...state['calendar'],
        selectedDate: date.toISOString().split('T')[0],
      },
      notes: {
        ...state['notes'],
        selectedNoteID: null,
      },
    };
  }),
  on(changePreviewMonth, (state, { month }) => {
    return {
      ...state,
      calendar: {
        ...state['calendar'],
        selectedMonth: month,
      },
    };
  }),
  on(changePreviewYear, (state, { year }) => {
    return {
      ...state,
      calendar: {
        ...state['calendar'],
        selectedYear: year,
      },
    };
  }),
  on(incrementPreviewMonth, (state) => {
    let newMonth: number = state['calendar']['selectedMonth'] + 1;
    let newYear: number = state['calendar']['selectedYear'];
    if (state['calendar']['selectedMonth'] == 11) {
      newMonth = 0;
      newYear = newYear + 1;
    }
    return {
      ...state,
      calendar: {
        ...state['calendar'],
        selectedMonth: newMonth,
        selectedYear: newYear,
      },
    };
  }),
  on(decrementPreviewMonth, (state) => {
    let newMonth: number = state['calendar']['selectedMonth'] - 1;
    let newYear: number = state['calendar']['selectedYear'];
    if (state['calendar']['selectedMonth'] == 0) {
      newMonth = 11;
      newYear = newYear - 1;
    }
    return {
      ...state,
      calendar: {
        ...state['calendar'],
        selectedMonth: newMonth,
        selectedYear: newYear,
      },
    };
  }),
  on(changePreviewToToday, (state) => {
    let currentDate: Date = new Date();
    return {
      ...state,
      calendar: {
        ...state['calendar'],
        selectedDate: currentDate.toISOString().split('T')[0],
        selectedMonth: currentDate.getMonth(),
        selectedYear: currentDate.getFullYear(),
      },
    };
  }),
  on(resetCalendarState, (state) => {
    let currentDate: Date = new Date();
    return {
      ...state,
      calendar: {
        ...state['calendar'],
        selectedDate: currentDate.toISOString().split('T')[0],
        selectedMonth: currentDate.getMonth(),
        selectedYear: currentDate.getFullYear(),
      },
    };
  }),
  on(addColor, (state, { color }) => {
    if (color.toUpperCase() in colorDefinitions) {
      if (state['colors']['noColorSelected'] == true) {
        return {
          ...state,
          colors: {
            ...state['colors'],
            noColorSelected: false,
            pickedColors: [color.toUpperCase()],
          },
          notes: {
            ...state['notes'],
            selectedNoteID: null,
          },
        };
      } else {
        let tempColors: Array<string> = state['colors']['pickedColors'].filter(
          (pickedColor) => pickedColor != color.toUpperCase()
        );
        tempColors.push(color.toUpperCase());
        return {
          ...state,
          colors: {
            ...state['colors'],
            pickedColors: tempColors,
          },
          notes: {
            ...state['notes'],
            selectedNoteID: null,
          },
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
      state['colors']['noColorSelected'] == false &&
      state['colors']['pickedColors'].includes(color.toUpperCase())
    ) {
      let tempColors: Array<string> = state['colors']['pickedColors'].filter(
        (pickedColor) => pickedColor != color.toUpperCase()
      );
      if (tempColors.length == 0) {
        return {
          ...state,
          colors: {
            ...state['colors'],
            pickedColors: allColors,
            noColorSelected: true,
          },
          notes: {
            ...state['notes'],
            selectedNoteID: null,
          },
        };
      } else {
        return {
          ...state,
          colors: {
            ...state['colors'],
            pickedColors: tempColors,
          },
          notes: {
            ...state['notes'],
            selectedNoteID: null,
          },
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
      colors: {
        ...state['colors'],
        pickedColors: allColors,
        noColorSelected: true,
      },
    };
  }),
  on(createNote, (state, { id, title, content, color, tags }) => {

    let lastModified = new Date();
    let editedCalendar:Object = {};
    let note: Note = {
      id: id,
      title: title ? title : '',
      content: content ? content : '',
      color: color ? color : null,
      lastModified: lastModified,
      tags: tags ? tags : [],
    };
    editedCalendar = {
      selectedDate: lastModified.toISOString().split('T')[0],
      selectedMonth: lastModified.getMonth(),
      selectedYear: lastModified.getFullYear(),
    };
    // Only create a note when there is a title or content
    return {
      ...state,
      notes: {
        ...state['notes'],
        notesByID: {
          ...state['notes']['notesByID'],
          [id]: note,
        },
        selectedNoteID: id,
      },
      calendar: {
        ...state['calendar'],
        ...editedCalendar,
      },
      colors: {
        ...state['colors'],
        pickedColors: allColors,
        noColorSelected: true,
      },
    };
  }),
  on(editNote, (state, { id, title, content, color, tags }) => {
    let noEdits: boolean = true;
    let editedParams: Object = {};
    if (id in state['notes']['notesByID']) {

      let prevNoteIter: Note = state['notes']['notesByID'][id];

      // Check if note is changed
      let titleChanged = false;
      let contentChanged = false;
      let colorChanged = false;
      let tagsChanged = false;

      if (title != null && title != prevNoteIter.title) {
        titleChanged = true;
        editedParams['title'] = title;
      }

      if (content != null && content != prevNoteIter.content) {
        contentChanged = true;
        editedParams['content'] = content;
      }

      if (color != null && color != prevNoteIter.color) {
        colorChanged = true;
        editedParams['color'] = color;
      }

      let newTags = [];
      let removedTags = [];

      if (prevNoteIter.tags && tags) {
        newTags = tags.filter((tag) => !prevNoteIter.tags.includes(tag));
        removedTags = prevNoteIter.tags.filter((tag) => !tags.includes(tag));
      }

      if (tags != null && removedTags.length + newTags.length > 0) {
        tagsChanged = true;
        editedParams['tags'] =  tags;
      }

      if (
        Object.keys(editedParams).length > 0 &&
        (titleChanged || contentChanged || colorChanged || tagsChanged)
      ) {
        noEdits = false;
      }
    }
    if (!noEdits && id in state['notes']['notesByID']) {
      let lastModified: Date = new Date();
      let calendarEdits: boolean = false;
      let editedCalendar: Object = {};
      if (
        state['calendar']['selectedDate'] !=
          lastModified.toISOString().split('T')[0] ||
        state['calendar']['selectedMonth'] != lastModified.getMonth() ||
        state['calendar']['selectedYear'] != lastModified.getFullYear()
      ) {
        calendarEdits = true;
        editedCalendar = {
          selectedDate: lastModified.toISOString().split('T')[0],
          selectedMonth: lastModified.getMonth(),
          selectedYear: lastModified.getFullYear(),
        };
      }
      if (calendarEdits) {
        return {
          ...state,
          notes: {
            ...state['notes'],
            notesByID: {
              ...state['notes']['notesByID'],
              [id]: {
                ...state['notes']['notesByID'][[id]],
                lastModified: lastModified,
                ...editedParams,
              },
            },
          },
          calendar: {
            ...state['calendar'],
            ...editedCalendar,
          },
        };
      } else {
        return {
          ...state,
          notes: {
            ...state['notes'],
            notesByID: {
              ...state['notes']['notesByID'],
              [id]: {
                ...state['notes']['notesByID'][[id]],
                lastModified: lastModified,
                ...editedParams,
              },
            },
          },
        };
      }
    } else {
      return {
        ...state,
      };
    }
  }),
  on(deleteNote, (state, { id }) => {
    if (id) {
      let updatedNotes = {};
      let selectedNoteID =
        id == state['notes']['selectedNoteID']
          ? null
          : state['notes']['selectedNoteID'];
      if (id in state['notes']['notesByID']) {
        for (let key in state['notes']['notesByID']) {
          if (id != key) {
            updatedNotes[key] = state['notes']['notesByID'][key];
          }
        }
      }

      return {
        ...state,
        notes: {
          ...state['notes'],
          notesByID: updatedNotes,
          selectedNoteID: selectedNoteID,
        },
      };
    } else {
      return {
        ...state,
      };
    }
  }),
  on(selectNote, (state, { id }) => {
    return {
      ...state,
      notes: {
        ...state['notes'],
        selectedNoteID: id,
      },
    };
  })
);
