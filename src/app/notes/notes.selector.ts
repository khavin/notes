import { createSelector } from '@ngrx/store';

export const getNotesByDate = createSelector(
    state => state["notes"],
    (state: any, props: {dates: Array<Date>}) => {
        let notes:Object = {};
        for(let date of props.dates){
            let parsedDate:string = date.toISOString().split("T")[0];
            notes[date.toISOString()] = state["notesByDate"][parsedDate] ? state["notesByDate"][parsedDate] : {};
        }
        return notes;
    }
)

export const getNotesByDesc = createSelector(
    state => state["notes"],
    (state:any) => {
        let dateArray = Object.keys(state["notesByDate"]).map((date) => state["notesByDate"][date]);
        let flatDateArray = [];
        for(let entry of dateArray){
            flatDateArray = flatDateArray.concat(Object.keys(entry).map((id) => entry[id]));
        }
        return flatDateArray.sort((a,b) => b.createdAt.toISOString().localeCompare(a.createdAt.toISOString()));
    }
)