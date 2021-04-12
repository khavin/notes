import { createReducer, on } from '@ngrx/store';
import { createNote, editNote, deleteNote } from './notes.actions';

export interface Note {
  id: string;
  title?: string;
  content?: string;
  color: string;
  lastModified?: Date;
  tags?: Array<string>;
}

const initialState: Object = {
  notes: {},
  notesByDate: {
    '2021-03-27': {
      bday: {
        id: 'bday',
        title: 'her bday',
        content: '24th bday',
        color: 'YELLOW',
        lastModified: new Date(2021, 3, 27),
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
      lastModified: new Date(),
      tags: tags ? tags : [],
    };
    if (note.title != '' || note.content != '') {
      // Only create a note when there is a title or content
      return {
          ...state,
          notes: {
              ...state["notes"],
              [id]: note
          }
      }
    } else {
      return {
        ...state,
      };
    }
  }),
  on(editNote, (state, { id, title, content, color, tags }) => {
    let noEdits: boolean = true;
    let editedParams: Object = {};
    if (id in state['notes']) {

      let prevNoteIter: Note = state['notes'][id];
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
    if (!noEdits && id in state['notes']) {
      return {
        ...state,
        notes: {
          ...state['notes'],
          [id]: {
            ...state['notes'][[id]],
            lastModified: new Date(),
            ...editedParams,
          },
        },
      };
    } else {
      return {
        ...state,
      };
    }
  }),
  on(deleteNote, (state, { id }) => {
    let updatedNotes = {};

    if (id in state['notes']) {
      for (let key in state['notes']) {
        if (id != key) {
          updatedNotes[key] = state['notes'][key];
        }
      }
    }

    return {
      ...state,
      notes: updatedNotes,
    };
  })
);
