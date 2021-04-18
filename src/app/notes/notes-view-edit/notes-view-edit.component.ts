import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { createNote, editNote, deleteNote } from '../notes.actions';
import { getSelectedNoteAndID } from '../notes.selector';
import {
  colors,
  colorDefinitions,
  allColors,
} from '../../colors/colors.constant';
import { resetColorState } from '../../colors/colors.actions';
import { Note } from 'src/app/app.reducer';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { v1 as uuidv1 } from 'uuid';
import { Observable, combineLatest, Subject, interval, Subscription } from 'rxjs';
import { numberToShortMonthMappings } from 'src/app/calendar/calendar.constants';

@Component({
  selector: 'app-notes-view-edit',
  templateUrl: './notes-view-edit.component.html',
  styleUrls: ['./notes-view-edit.component.css'],
})
export class NotesViewEditComponent implements OnInit {
  id: string;
  title: string = null;
  content: string = null;
  note: Note;
  mode: string = 'edit' || 'create';
  noteTitle: any;
  noteContent: any;
  noteTags: any;
  editingTag: string;
  availableColors: Array<string> = allColors;
  selectedColor: any;
  colorPalette: colors = colorDefinitions;
  pickedColor: string = null;
  tags: Array<string> = [];
  saveInterval: number = 500;
  subscriptions: Array<Subscription> = [];
  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.pipe(select(getSelectedNoteAndID)).subscribe((data) => {
      if (data[0] != this.id) {

        // Save previous note
        if (this.id) {
          if (this.title == '' && this.content == '') {
            this.deleteNote();
          } else {
            this.store.dispatch(
              editNote({
                id: this.id,
                title: this.title,
                content: this.content,
                color: this.pickedColor,
                tags: this.tags
              })
            );
          }
        }
        
        // Remove previous form control Subscription
        if (this.subscriptions.length > 0){
          for(let subscription of this.subscriptions){
            subscription.unsubscribe();
          }
        }

        // Get new note
        this.id = data[0];
        this.note = data[1];

        // Create new form controls
        this.noteTitle = new FormControl('');
        this.noteContent = new FormControl('');
        this.selectedColor = new FormControl(allColors);
        this.noteTags = new FormControl('');

        // Create new form observables
        let titleObservable = this.noteTitle.valueChanges.pipe(
          debounceTime(this.saveInterval)
        );
        let contentObservable = this.noteContent.valueChanges.pipe(
          debounceTime(this.saveInterval)
        );
        let subscriptions:Array<Subscription> = [];

        subscriptions.push(titleObservable.subscribe((data) => {
          this.title = data;
        }));
        subscriptions.push(contentObservable.subscribe((data) => {
          this.content = data;
        }));

        subscriptions.push(this.noteTags.valueChanges.subscribe((data) => {
          this.editingTag = data;
        }));

        // Set note info
        this.pickedColor = this.note.color;
        this.tags = this.note.tags;
        this.noteTitle.setValue(this.note.title ? this.note.title : '');
        this.noteContent.setValue(this.note.content ? this.note.content : '');

        this.title = this.note.title;
        this.content = this.note.content;

        let prevNote: Note = {...data[1]};

        subscriptions.push(interval(500).subscribe(() => {
          if (
            (this.title != '' ||
              this.content != '' ||
              this.pickedColor != null) &&
            (this.title != prevNote.title ||
              this.content != prevNote.content ||
              this.pickedColor != prevNote.color ||
              this.tags != prevNote.tags)
          ) {
            prevNote.title = this.title;
            prevNote.content = this.content;
            prevNote.color = this.pickedColor;
            prevNote.tags = this.tags;
            this.store.dispatch(
              editNote({
                id: this.id,
                title: this.title,
                content: this.content,
                color: this.pickedColor,
                tags: this.tags
              })
            );
          }
        }));

        this.subscriptions = [...subscriptions];
      }
    });
  }

  colorSelected(color: string): void {
    if (this.pickedColor == color) {
      this.pickedColor = '';
    } else {
      this.pickedColor = color;
    }
  }

  deleteNote(): void {
    let id = this.id;
    this.store.dispatch(deleteNote({ id: id }));
  }

  createNote(): void {
    this.store.dispatch(createNote({id: uuidv1()}))
  }

  addTag(event): void {
    if(event.key == "Enter"){
      if(!this.tags.includes(this.editingTag)){
        this.tags = [...this.tags, this.editingTag];
      }
      this.noteTags.setValue('');
    }
  }
}
