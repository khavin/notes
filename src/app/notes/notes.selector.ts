import { createSelector } from '@ngrx/store';

export const filterNotesBySelectedColor = createSelector(
    state => state["global"]["notes"]["notesByID"],
    state => state["global"]["colors"],
    (notesState: Object,colorState: Object) => {
        if(colorState["noColorSelected"] == true){
            return notesState;
        }else{
            let filteredNotes: Object = {};
            for(let note in notesState){
                if(colorState["pickedColors"].includes(notesState[note]["color"])){
                    filteredNotes[note] = notesState[note];
                }
            }
            return filteredNotes;
        }
    }
)

export const getNotesByDesc = createSelector(
    filterNotesBySelectedColor,
    (state:any) => {
        let flatDateArray = [];
        flatDateArray = flatDateArray.concat(Object.keys(state).map((id) => state[id]));  
        return flatDateArray.sort((a,b) => b.lastModified.toISOString().localeCompare(a.lastModified.toISOString()));
    }
);

export const getSelectedNoteAndID = createSelector(
    state => state["global"]["notes"]["selectedNoteID"],
    state => state["global"]["notes"]["notesByID"],
    (id, notes) => {
        return id ? [id, notes[id]] : [null,{}];
    }
)

export const getNotesForSelectedDate = createSelector(
    state => state["global"]["calendar"],
    getSelectedNoteAndID,
    getNotesByDesc,
    (calendarState,selectedNoteAndID,notes: any) => {
        let notesArray: Array<any> = [];
        if(selectedNoteAndID[0] != null){
            let selectedNotePresent = false;
            for(let entry of notes){
                if(selectedNoteAndID[0] == entry["id"]){
                    selectedNotePresent = true;
                    break;
                }
            }
            if(!selectedNotePresent){
                notesArray.push(selectedNoteAndID[1]);
            }
        }
        for(let entry of notes){
            if(calendarState["selectedDate"] == entry["lastModified"].toISOString().split("T")[0]){
                notesArray.push(entry);
            }
        }
        
        return [selectedNoteAndID[0],notesArray];
    }
)