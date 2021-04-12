import { createSelector } from '@ngrx/store';

export const getNotesByDesc = createSelector(
    state => state["global"]["notes"],
    (state:any) => {
        let flatDateArray = [];
        flatDateArray = flatDateArray.concat(Object.keys(state["notesByID"]).map((id) => state["notesByID"][id]));  
        return flatDateArray.sort((a,b) => b.lastModified.toISOString().localeCompare(a.lastModified.toISOString()));
    }
);

export const getNotesForSelectedDate = createSelector(
    state => state["global"]["calendar"],
    getNotesByDesc,
    (state,notes: any) => {
        let notesArray: Array<any> = [];
        for(let entry of notes){
            if(state["selectedDate"] == entry["lastModified"].toISOString().split("T")[0]){
                notesArray.push(entry);
            }
        }
        return notesArray;
    }
)

export const getSelectedNoteAndID = createSelector(
    state => state["global"]["notes"],
    (state) => {
        let id:string = state["selectedNoteID"];
        return id ? [id, state["notesByID"][id]] : [null,{}];
    }
)