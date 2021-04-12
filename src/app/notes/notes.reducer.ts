import { createReducer, on } from '@ngrx/store';
import { createNote, editNote, deleteNote } from './notes.actions';

export interface Note {
  id: string;
  title?: string;
  content?: string;
  color: string;
  createdAt: Date;
  editedAt?: Date;
  tags?: Array<string>;
}

const initialState: Object = {
  notesByDate: {
    '2021-03-27': {
      bday: {
        id: 'bday',
        title: 'her bday',
        content: '24th bday',
        color: 'YELLOW',
        createdAt: new Date(2021, 3, 27),
        tags: ['Personal'],
      },
    },
  },
};

export const notesReducer = createReducer(
  initialState,
  on(createNote, (state, { id, title, content, color, tags }) => {
    let note: Note = {
      id: id,
      title: title ? title : '',
      content: content ? content : '',
      color: color,
      createdAt: new Date(),
      tags: tags ? tags : [],
    };
    if (note.title != '' || note.content != '') {
      // Only create a note when there is a title or content
      let parsedDate: string = note.createdAt.toISOString().split('T')[0];
      if (parsedDate in state['notesByDate']) {
        return {
          ...state,
          notesByDate: {
            ...state['notesByDate'],
            [parsedDate]: {
              ...state['notesByDate'][[parsedDate]],
              [id]: note,
            },
          },
        };
      } else {
        return {
          ...state,
          notesByDate: {
            ...state['notesByDate'],
            [parsedDate]: {
              [id]: note,
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
  on(editNote, (state, { id, title, content, color, createdAt, tags }) => {
    let parsedDate: string = createdAt.toISOString().split('T')[0];
    let noEdits: boolean = true;
    let editedParams: Object = {};
    if (id in state['notesByDate'][parsedDate]) {
        
      let prevNoteIter: Note = state['notesByDate'][parsedDate][id];
      if(title) editedParams["title"] = title;
      if(content) editedParams["content"] = content;
      if(color) editedParams["color"] = color;
      if(tags) editedParams["tags"] = tags;

      if (
        (Object.keys(editedParams).length > 0) &&
        prevNoteIter.title != title ||
        prevNoteIter.content != content ||
        prevNoteIter.color != color ||
        prevNoteIter.tags != tags
      ) {
        noEdits = false;
      }
    }
    if (!noEdits && id in state['notesByDate'][parsedDate]) {
      return {
        ...state,
        notesByDate: {
          ...state['notesByDate'],
          [parsedDate]: {
            ...state['notesByDate'][[parsedDate]],
            [id]: {
              ...state['notesByDate'][[parsedDate]][[id]],
              editedAt: new Date(),
            ...editedParams
            },
          },
        },
      };
    } else {
      return {
        ...state,
      };
    }
  }),
  on(deleteNote, (state, { id, createdAt }) => {
    let updatedNotesByDate = {};
    let parsedDate: string = createdAt.toISOString().split('T')[0];
    for (let date in state['notesByDate']) {
      if (date != parsedDate) {
        updatedNotesByDate[date] = state['notesByDate'][date];
      } else {
        if (id in state['notesByDate'][date]) {
          let updatedNotes = {};
          for (let key in state['notesByDate'][date]) {
            if (id != key) {
              updatedNotes[key] = state['notesByDate'][date][key];
            }
          }
          if (Object.keys(updatedNotes).length > 0) {
            updatedNotesByDate[date] = updatedNotes;
          }
        }
      }
    }
    return {
      ...state,
      notesByDate: updatedNotesByDate,
    };
  })
);
