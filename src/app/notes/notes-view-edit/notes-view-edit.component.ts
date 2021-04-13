import { Component, OnInit } from '@angular/core';
import { Store,select } from '@ngrx/store';
import { createNote, editNote, deleteNote } from '../notes.actions';
import { getSelectedNoteAndID } from '../notes.selector';
import { changeSelectedDate,resetCalendarState } from '../../calendar/calendar.actions';
import { colors,colorDefinitions,allColors } from '../../colors/colors.constant';
import { resetColorState } from '../../colors/colors.actions';
import { Note } from 'src/app/app.reducer';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { v1 as uuidv1 } from 'uuid';
import { Observable, combineLatest, Subject, interval } from 'rxjs';

@Component({
  selector: 'app-notes-view-edit',
  templateUrl: './notes-view-edit.component.html',
  styleUrls: ['./notes-view-edit.component.css']
})
export class NotesViewEditComponent implements OnInit {

  id:string;
  title:string = null;
  content:string = null;
  oldID:string = null;
  note:Note;
  mode:string = "edit" || "create";
  noteTitle = new FormControl('');
  noteContent = new FormControl('');
  availableColors:Array<string> = allColors;
  selectedColor = new FormControl(allColors);
  colorPalette:colors = colorDefinitions;
  pickedColor:string = null;
  saveInterval:number = 500;
  constructor(private store:Store) { }

  ngOnInit(): void {
    this.store.pipe(select(getSelectedNoteAndID)).subscribe(data => {
      if(data[0] != this.id){

        // Save previous note
        // if(this.title == "" && this.content == ""){
        //   this.store.dispatch(deleteNote({id: this.id}));
        // }else{
        //   this.store.dispatch(editNote({id: this.id, title: this.title, content: this.content, color: this.pickedColor}));
        // }

        // Get new note
        this.id = data[0];
        this.note = data[1];

        // Set note info
        this.pickedColor = this.note.color;
        this.noteTitle.setValue(this.note.title?this.note.title:'');
        this.noteContent.setValue(this.note.content?this.note.content:'');

      }
    })

    let titleObservable = this.noteTitle.valueChanges.pipe(debounceTime(this.saveInterval));
    let contentObservable = this.noteContent.valueChanges.pipe(debounceTime(this.saveInterval));
    
    titleObservable.subscribe((data) => {
      this.title = data;
    })
    contentObservable.subscribe((data) => {
      this.content = data;
    })
    
    let prevNote:Note;  
    interval(500).subscribe(() =>{
      if(this.oldID && this.id == this.oldID){
        if((this.title != "" || this.content != "" || this.pickedColor != null) && (this.title != prevNote.title || this.content != prevNote.content || this.pickedColor != prevNote.color)){
          this.oldID = this.id;
          prevNote.title = this.title;
          prevNote.content = this.content;
          prevNote.color = this.pickedColor;
          this.store.dispatch(editNote({id: this.id, title: this.title, content: this.content, color: this.pickedColor}));
        }
      }else{
        this.oldID = this.id;
        prevNote = {...this.note};
      }
    })



    //this.store.dispatch(createNote({id: "test",color: "BLUE"}));
    //this.store.dispatch(createNote({id: "test",title: "first note",content: "hi how are you",color: "BLUE"}));
    //this.store.dispatch(createNote({id: "test1",title: "second note",content: "hello",color: "Yellow", tags: ["Formal"]}));
    // this.store.dispatch(editNote({id: "test",title: "first note",content: "hi how are you",color: "BLUE", tags: []}));
    // this.store.dispatch(editNote({id: "test1",title: "second note",content: "hello",color: "Yellow", tags: ["Formal","Formal 1"]}));
    // this.store.dispatch(editNote({id: "test1", tags: ["Formal","Formal 1","Formal 2"]}));
    // this.store.dispatch(editNote({id: "test1", color: "PURPLE"}));
    // this.store.dispatch(changeSelectedDate({date: new Date(2021, 2, 27)}))
    // this.store.dispatch(deleteNote({id: "test"}));
    // this.store.dispatch(resetCalendarState());
    // this.store.dispatch(resetColorState());
  }

  colorSelected(color:string):void{
    if(this.pickedColor == color ){
      this.pickedColor = "";
    }else{
      this.pickedColor = color;
    }    
  }
}
