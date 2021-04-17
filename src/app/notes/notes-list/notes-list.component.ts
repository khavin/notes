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
      this.notes = data[1];
      if(this.notes.length > 0){
        for(let note of this.notes){
          if(data[0] == null){
            this.selectNote(note.id);
          }else{
            if(this.selectedNoteID != data[0]){
              this.selectedNoteID = data[0];
            }
          }
          break;
        }
      }else{
        this.selectedNoteID = null;
      }
      
    })
  }

  selectNote(id:any): void{
    this.store.dispatch(selectNote({ id: id }));
  }
}
