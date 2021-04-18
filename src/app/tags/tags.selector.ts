import { createSelector } from '@ngrx/store';

export const allTags = createSelector(
    state => state["global"]["notes"]["notesByID"],
    (notes) => {
        let tags:Array<string> = [];
        for(let note in notes){
            for(let tag of notes[note]["tags"]){
                if(!tags.includes(tag.toLowerCase())){
                    tags.push(tag.toLowerCase());
                }
            }
        }
        return tags;
    }
)