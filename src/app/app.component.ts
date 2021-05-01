import { Component } from '@angular/core';
import { Store } from '@ngrx/store'
import { createNote } from './notes/notes.actions';
import { v1 as uuidv1 } from 'uuid';
import { getSelectedNoteAndID } from './notes/notes.selector';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private store:Store){}
  title = 'notes';
  noteAvailableToDisplay = true;
  createNote(): void {
    this.store.dispatch(createNote({ id: uuidv1() }));
  }
  ngOnInit(): void {
    this.store.select(getSelectedNoteAndID).subscribe(data => {
      if(data[0] == null){
        this.noteAvailableToDisplay = false;
      }else{
        this.noteAvailableToDisplay = true;
      }
    })
  }
}
