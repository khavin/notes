import { Component, OnInit } from '@angular/core';
import { Store,select } from '@ngrx/store';
import { createNote, editNote, deleteNote } from '../notes.actions';

@Component({
  selector: 'app-notes-view-edit',
  templateUrl: './notes-view-edit.component.html',
  styleUrls: ['./notes-view-edit.component.css']
})
export class NotesViewEditComponent implements OnInit {

  constructor(private store:Store) { }

  ngOnInit(): void {
    this.store.dispatch(createNote({id: "test",color: "BLUE"}));
    this.store.dispatch(createNote({id: "test",title: "first note",content: "hi how are you",color: "BLUE"}));
    this.store.dispatch(createNote({id: "test1",title: "second note",content: "hello",color: "Yellow", tags: ["Formal"]}));
    this.store.dispatch(editNote({id: "test",title: "first note",content: "hi how are you",color: "BLUE",createdAt: new Date(), tags: []}));
    this.store.dispatch(editNote({id: "test1",title: "second note",content: "hello",color: "Yellow",createdAt: new Date(), tags: ["Formal","Formal 1"]}));
    this.store.dispatch(editNote({id: "test1",createdAt: new Date(), tags: ["Formal","Formal 1","Formal 2"]}));
    this.store.dispatch(editNote({id: "test1",createdAt: new Date(), color: "PURPLE"}));
    this.store.dispatch(deleteNote({id: "test",createdAt: new Date()}));
  }

}
