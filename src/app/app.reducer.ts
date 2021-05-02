import { createReducer, on } from '@ngrx/store';
import { DatePipe } from '@angular/common';
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
import { search } from './search/search.actions';

export interface Note {
  id: string;
  title?: string;
  content?: string;
  color: string;
  lastModified?: Date;
  tags?: Array<string>;
}

let currentDate: Date = new Date();
let datePipe = new DatePipe('en-US');

const initialState: Object = {
  calendar: {
    selectedDate: datePipe.transform(currentDate, 'yyyy-MM-dd'),
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
        lastModified: new Date(Date.parse('2021-03-27T01:30:00.000Z')),
      },
      'test -1': {
        id: 'test -1',
        title: 'Her bday',
        content: 'Its his 24th bday',
        color: '',
        tags: [],
        lastModified: new Date(Date.parse('2021-03-21T07:30:00.000Z')),
      },
      'test 1': {
        id: 'test 1',
        title: 'About me',
        content: 'The main purpose of this project is to learn angular and ngrx.\nMy github link: https://github.com/khavin',
        color: '',
        tags: ['personal'],
        lastModified: new Date(),
      },
      'test 1a': {
        id: 'test 1a',
        title: 'Apple wwdc event',
        content: 'Apple Worldwide Developers Conference is an information technology conference held annually by Apple Inc. Expected releases: New privacy feature, new ios, ipados, macos.',
        color: 'BLUE',
        tags: ['apple','event'],
        lastModified: new Date(),
      },
      'test 1b': {
        id: 'test 1b',
        title: 'Ferrari',
        content: 'Ferrari S.p.A. is an Italian luxury sports car manufacturer based in Maranello, Italy. Founded by Enzo Ferrari in 1939 out of the Alfa Romeo race division as Auto Avio Costruzioni, the company built its first car in 1940, and produced its first Ferrari-badged car in 1947.',
        color: 'RED',
        tags: ['ferrari','f1'],
        lastModified: new Date(),
      },
      'test 1c': {
        id: 'test 1c',
        title: 'Mclaren',
        content: 'McLaren Racing Limited is a British motor racing team based at the McLaren Technology Centre in Woking, Surrey, England.',
        color: 'ORANGE',
        tags: ['mclaren','f1'],
        lastModified: new Date(),
      },
      'test 1d': {
        id: 'test 1d',
        title: 'Google I/O',
        content: 'Google I/O is an annual developer conference held by Google in Mountain View, California. "I/O" stands for input/output, as well as the slogan "Innovation in the Open".',
        color: 'GREEN',
        tags: ['google','event'],
        lastModified: new Date(),
      },
      'test 1e': {
        id: 'test 1e',
        title: 'GOAT of F1',
        content: 'Sir Lewis Carl Davidson Hamilton MBE HonFREng is a British racing driver. He currently competes in Formula One for Mercedes, having previously driven for McLaren from 2007 to 2012.',
        color: 'VIOLET',
        tags: ['mclaren','mercedes','f1'],
        lastModified: new Date(),
      },
      'test 1f': {
        id: 'test 1f',
        title: 'Honey Badger',
        content: 'Daniel Joseph Ricciardo is an Italian-Australian racing driver who is currently competing in Formula One, under the Australian flag, for McLaren.',
        color: 'ORANGE',
        tags: ['mclaren','f1'],
        lastModified: new Date(),
      },
      
      'test 2e': {
        id: 'test 2e',
        title: 'Second note',
        content: 'Its second',
        color: 'ORANGE',
        tags: ['Mclaren'],
        lastModified: new Date(),
      },
      'test 3': {
        id: 'test 3',
        title: 'March final day',
        content: 'Its the last day in march',
        color: 'ORANGE',
        tags: ['Finance'],
        lastModified: new Date(Date.parse('2021-03-31T23:30:00.000Z')),
      },
      'test 4': {
        id: 'test 4',
        title: 'New Year',
        content: 'Finally 2020 is over',
        color: 'RED',
        tags: [],
        lastModified: new Date(Date.parse('2021-01-01T00:01:00.000Z')),
      },
      'test 5': {
        id: 'test 5',
        title: "New Year's Eve",
        content: 'Finally 2020 is going to end',
        color: 'RED',
        tags: [],
        lastModified: new Date(Date.parse('2020-12-31T12:01:00.000Z')),
      },
    },
    selectedNoteID: null,
  },
  tags: {
    tagsList: [],
    selectedTags: [],
  },
  searchString: '',
};

export const globalReducer = createReducer(
  initialState,
  on(search, (state, { searchString }) => {
    return {
      ...state,
      searchString: searchString.toLowerCase(),
      notes: {
        ...state['notes'],
        selectedNoteID: null,
      },
    };
  }),
  on(changeSelectedDate, (state, { date }) => {
    return {
      ...state,
      calendar: {
        ...state['calendar'],
        selectedDate: datePipe.transform(date, 'yyyy-MM-dd'),
        selectedMonth: date.getMonth(),
        selectedYear: date.getFullYear(),
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
        selectedDate: datePipe.transform(currentDate, 'yyyy-MM-dd'),
        selectedMonth: currentDate.getMonth(),
        selectedYear: currentDate.getFullYear(),
      },
      notes: {
        ...state['notes'],
        selectedNoteID: null
      }
    };
  }),
  on(resetCalendarState, (state) => {
    let currentDate: Date = new Date();
    return {
      ...state,
      calendar: {
        ...state['calendar'],
        selectedDate: datePipe.transform(currentDate, 'yyyy-MM-dd'),
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
    let editedCalendar: Object = {};
    let note: Note = {
      id: id,
      title: title ? title : '',
      content: content ? content : '',
      color: color ? color : null,
      lastModified: lastModified,
      tags: tags ? tags : [],
    };
    editedCalendar = {
      selectedDate: datePipe.transform(lastModified, 'yyyy-MM-dd'),
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

    // Check if note is changed
    let titleChanged = false;
    let contentChanged = false;
    let colorChanged = false;
    let tagsChanged = false;

    if (id in state['notes']['notesByID']) {
      let prevNoteIter: Note = state['notes']['notesByID'][id];

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
        editedParams['tags'] = tags;
      }

      if (
        Object.keys(editedParams).length > 0 &&
        (titleChanged || contentChanged || colorChanged || tagsChanged)
      ) {
        noEdits = false;
      }
    }
    
    if (!noEdits && id in state['notes']['notesByID']) {
      let editedCalendar: Object = state['calendar'];
      if (titleChanged || contentChanged) {
        let lastModified: Date = new Date();
        editedParams['lastModified'] = lastModified;

        if (
          state['calendar']['selectedDate'] !=
            datePipe.transform(lastModified, 'yyyy-MM-dd') ||
          state['calendar']['selectedMonth'] != lastModified.getMonth() ||
          state['calendar']['selectedYear'] != lastModified.getFullYear()
        ) {
          editedCalendar = {
            selectedDate: datePipe.transform(lastModified, 'yyyy-MM-dd'),
            selectedMonth: lastModified.getMonth(),
            selectedYear: lastModified.getFullYear(),
          };
        }
      }
      return {
        ...state,
        notes: {
          ...state['notes'],
          notesByID: {
            ...state['notes']['notesByID'],
            [id]: {
              ...state['notes']['notesByID'][[id]],
              ...editedParams,
            },
          },
        },
        calendar: {
          ...editedCalendar,
        },
      };
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
      }else{
        updatedNotes = state['notes']['notesByID'];
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
