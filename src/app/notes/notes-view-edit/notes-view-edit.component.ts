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
  availableColors: Array<string> = allColors;
  selectedColor: any;
  colorPalette: colors = colorDefinitions;
  pickedColor: string = null;
  tags: Array<string> = [];
  saveInterval: number = 500;
  saveSubscription: Subscription = null;
  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.pipe(select(getSelectedNoteAndID)).subscribe((data) => {
      if (data[0] != this.id) {

        // Remove previous form control Subscription
        if (this.saveSubscription){
          this.saveSubscription.unsubscribe();
        }
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

        // Get new note
        this.id = data[0];
        this.note = data[1];

        // Create new form controls
        this.noteTitle = new FormControl('');
        this.noteContent = new FormControl('');
        this.selectedColor = new FormControl(allColors);

        // Create new form observables
        let titleObservable = this.noteTitle.valueChanges.pipe(
          debounceTime(this.saveInterval)
        );
        let contentObservable = this.noteContent.valueChanges.pipe(
          debounceTime(this.saveInterval)
        );

        titleObservable.subscribe((data) => {
          this.title = data;
        });
        contentObservable.subscribe((data) => {
          this.content = data;
        });

        // Set note info
        this.pickedColor = this.note.color;
        this.noteTitle.setValue(this.note.title ? this.note.title : '');
        this.noteContent.setValue(this.note.content ? this.note.content : '');

        this.title = this.note.title;
        this.content = this.note.content;

        let prevNote: Note = {...data[1]};

        this.saveSubscription = interval(500).subscribe(() => {
          if (
            (this.title != '' ||
              this.content != '' ||
              this.pickedColor != null) &&
            (this.title != prevNote.title ||
              this.content != prevNote.content ||
              this.pickedColor != prevNote.color)
          ) {
            prevNote.title = this.title;
            prevNote.content = this.content;
            prevNote.color = this.pickedColor;
            this.store.dispatch(
              editNote({
                id: this.id,
                title: this.title,
                content: this.content,
                color: this.pickedColor,
              })
            );
          }
        });
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
}
