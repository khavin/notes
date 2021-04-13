import { Component, OnInit } from '@angular/core';
import { Store,select } from '@ngrx/store';
import { createNote, editNote, deleteNote } from '../notes.actions';
import { getSelectedNoteAndID } from '../notes.selector';
import { changeSelectedDate,resetCalendarState } from '../../calendar/calendar.actions';
import { resetColorState } from '../../colors/colors.actions';
import { Note } from 'src/app/app.reducer';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { v1 as uuidv1 } from 'uuid';
import { Observable, combineLatest } from 'rxjs';

@Component({
  selector: 'app-notes-view-edit',
  templateUrl: './notes-view-edit.component.html',
  styleUrls: ['./notes-view-edit.component.css']
})
export class NotesViewEditComponent implements OnInit {

  id:string;
  oldID:string = null;
  note:Note;
  mode:string = "edit" || "create";
  noteTitle = new FormControl('');
  noteContent = new FormControl('');
  saveInterval:number = 500;
  constructor(private store:Store) { }

  ngOnInit(): void {
    this.store.pipe(select(getSelectedNoteAndID)).subscribe(data => {
      if(data[0] != this.id){
        this.id = data[0];
        this.note = data[1];
        this.noteTitle.setValue(this.note.title?this.note.title:'');
        this.noteContent.setValue(this.note.content?this.note.content:'');
        
      }
    })

    let titleObservable = this.noteTitle.valueChanges.pipe(debounceTime(this.saveInterval));
    let contentObservable = this.noteContent.valueChanges.pipe(debounceTime(this.saveInterval));
    combineLatest([titleObservable,contentObservable]).subscribe((data) =>{
      console.log(this.note);
      console.log(data);
      if(this.oldID && this.id == this.oldID){
        console.log("inside");
        if((data[0] != "" || data[1] != "") && (data[0] != this.note.title || data[1] != this.note.content)){
          this.oldID = this.id;
          this.store.dispatch(editNote({id: this.id, title: data[0], content: data[1]}));
        }
      }else{
        console.log("skipping")
        this.oldID = this.id;
      }
    })



    this.store.dispatch(createNote({id: "test",color: "BLUE"}));
    this.store.dispatch(createNote({id: "test",title: "first note",content: "hi how are you",color: "BLUE"}));
    this.store.dispatch(createNote({id: "test1",title: "second note",content: "hello",color: "Yellow", tags: ["Formal"]}));
    // this.store.dispatch(editNote({id: "test",title: "first note",content: "hi how are you",color: "BLUE", tags: []}));
    // this.store.dispatch(editNote({id: "test1",title: "second note",content: "hello",color: "Yellow", tags: ["Formal","Formal 1"]}));
    // this.store.dispatch(editNote({id: "test1", tags: ["Formal","Formal 1","Formal 2"]}));
    // this.store.dispatch(editNote({id: "test1", color: "PURPLE"}));
    // this.store.dispatch(changeSelectedDate({date: new Date(2021, 2, 27)}))
    // this.store.dispatch(deleteNote({id: "test"}));
    // this.store.dispatch(resetCalendarState());
    // this.store.dispatch(resetColorState());
  }

}
