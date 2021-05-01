import { Component } from '@angular/core';
import { Store } from '@ngrx/store'
import { createNote } from './notes/notes.actions';
import { v1 as uuidv1 } from 'uuid';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private store:Store){}
  title = 'notes';
  createNote(): void {
    this.store.dispatch(createNote({ id: uuidv1() }));
  }
}
