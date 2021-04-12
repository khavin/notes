import { Component, OnInit } from '@angular/core';
import { Store,select } from '@ngrx/store';
import { Note } from '../../app.reducer';
import { selectNote } from '../notes.actions';
import { getNotesForSelectedDate } from '../notes.selector';

@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.css']
})
export class NotesListComponent implements OnInit {

  notes:Array<Note> = [];
  selectedNoteID:string = null;
  constructor(private store:Store) { }

  ngOnInit(): void {
    this.store.pipe(select(getNotesForSelectedDate)).subscribe((data) => {
      this.notes = data;
      console.log(data);
      if(this.notes.length > 0){
        for(let note of this.notes){
          if(this.selectedNoteID != note.id){
            console.log("Dispatching selected note");
            
            this.store.dispatch(selectNote({id: note.id}));
            this.selectedNoteID = note.id;
          }
          break;
        }
      }else{
        if(this.selectedNoteID != null){
          this.selectedNoteID = null;
          this.store.dispatch(selectNote({id: null}));
        }
      }
      
    })
  }

  selectNote(id:any): void{
    console.log(id);
    console.log(this.selectedNoteID);
    if( id != this.selectedNoteID){
      console.log("Dispatching selected note1");
      this.store.dispatch(selectNote({ id: id }));
      this.selectedNoteID = id;
    }
    
  }
}
