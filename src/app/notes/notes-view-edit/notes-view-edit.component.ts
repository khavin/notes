import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { editNote, deleteNote } from '../notes.actions';
import { getSelectedNoteAndID } from '../notes.selector';
import { NotesService } from '../notes.service';
import {
  colors,
  colorDefinitions,
  allColors,
} from '../../colors/colors.constant';
import { numberToFullMonthMappings } from '../../calendar/calendar.constants';
import { Note } from 'src/app/app.reducer';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notes-view-edit',
  templateUrl: './notes-view-edit.component.html',
  styleUrls: ['./notes-view-edit.component.css'],
})
export class NotesViewEditComponent implements OnInit {
  @ViewChildren('editContent') editContent: QueryList<any>;
  @ViewChildren('editTitle') editTitle: QueryList<any>;
  id: string;
  title: string = '';
  content: string = '';
  note: Note;
  prevNote: Note;
  mode: string = 'edit' || 'create';
  noteTitle: any;
  noteContent: any;
  noteTags: any;
  editingTag: string;
  lastModifiedTime: string;
  availableColors: Array<string> = allColors;
  selectedColor: any;
  colorPalette: colors = colorDefinitions;
  pickedColor: string = null;
  tags: Array<string> = [];
  saveInterval: number = 500;
  subscriptions: Array<Subscription> = [];
  constructor(private store: Store, private notesService: NotesService) {}

  ngOnInit(): void {
    this.store.pipe(select(getSelectedNoteAndID)).subscribe((data) => {
      if (data[0] != this.id) {
        // Remove previous form control Subscription
        if (this.subscriptions.length > 0) {
          for (let subscription of this.subscriptions) {
            subscription.unsubscribe();
          }
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
                tags: this.tags,
              })
            );
          }
        }

        // Get new note
        this.id = data[0];
        this.note = data[1];
        if (this.note != null) {
          this.lastModifiedTime = this.formatTime(this.note.lastModified);
        }

        // auto focus
        if(this.id && !this.note.title && !this.note.content) this.editTitle.first.nativeElement.focus();

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

        // Emit title when it changes, to note list component
        this.noteTitle.valueChanges.subscribe((data) => {
          this.title = data;
          this.notesService.selectedNoteTitle.next(data);
        });
        // Emit content when it changes, to note list component
        this.noteContent.valueChanges.subscribe((data) => {
          this.content = data;
          this.notesService.selectedNoteContent.next(data);
        });

        let subscriptions: Array<Subscription> = [];

        subscriptions.push(
          titleObservable.subscribe((data) => {
            this.checkForChanges();
          })
        );
        subscriptions.push(
          contentObservable.subscribe((data) => {
            this.checkForChanges();
          })
        );

        subscriptions.push(
          this.noteTags.valueChanges.subscribe((data) => {
            this.editingTag = data;
          })
        );

        // Set note info
        this.pickedColor = this.note.color;
        this.tags = this.note.tags;
        this.noteTitle.setValue(this.note.title ? this.note.title : '');
        this.noteContent.setValue(this.note.content ? this.note.content : '');

        this.title = this.note.title;
        this.content = this.note.content;

        this.prevNote = { ...data[1] };

        this.subscriptions = [...subscriptions];
      }
    });
  }

  checkForChanges(): void {
    if (
      (this.title != '' || this.content != '' || this.pickedColor != null) &&
      (this.title != this.prevNote.title ||
        this.content != this.prevNote.content ||
        this.pickedColor != this.prevNote.color ||
        this.tags != this.prevNote.tags)
    ) {
      this.prevNote.title = this.title;
      this.prevNote.content = this.content;
      this.prevNote.color = this.pickedColor;
      this.prevNote.tags = this.tags;
      this.lastModifiedTime = this.formatTime(new Date());
      this.store.dispatch(
        editNote({
          id: this.id,
          title: this.title,
          content: this.content,
          color: this.pickedColor,
          tags: this.tags,
        })
      );
    }
  }

  colorSelected(color: string): void {
    if (this.pickedColor == color) {
      this.pickedColor = '';
      this.checkForChanges();
    } else {
      this.pickedColor = color;
      this.checkForChanges();
    }
  }

  deleteNote(): void {
    let id = this.id;
    this.store.dispatch(deleteNote({ id: id }));
  }

  addTag(event): void {
    if (event.key == 'Enter') {
      if (this.editingTag.trim().length > 0) {
        let lowerCasedTags = [];
        for (let tag of this.tags) {
          lowerCasedTags.push(tag.toLowerCase());
        }
        if (!lowerCasedTags.includes(this.editingTag.toLowerCase())) {
          this.tags = [...this.tags, this.editingTag.toLowerCase()];
        }
        this.noteTags.setValue('');
        this.checkForChanges();
      } else {
        this.noteTags.setValue('');
      }
    }
  }

  removeTag(tag): void {
    let tagIndex = this.tags.indexOf(tag);
    if (tagIndex > -1) {
      let { [tagIndex]: removedTag, ...rest } = this.tags;
      let updatedTags = Object.keys(rest).map((k) => rest[k]);
      this.tags = [...updatedTags];
      this.checkForChanges();
    }
  }

  moveToContent(event): void {
    if (event.key == 'Enter') {
      event.preventDefault();
      this.editContent.first.nativeElement.focus();
    }
  }

  moveToTitle(event): void {
    if (event.key == 'Backspace' && this.content.length == 0) {
      event.preventDefault();
      this.editTitle.first.nativeElement.focus();
    }
  }

  formatTime(dateObject: Date): string {
    if (dateObject) {
      let date = dateObject.getDate();
      let month = numberToFullMonthMappings[dateObject.getMonth()];
      let year = dateObject.getFullYear();
      let hour =
        dateObject.getHours() < 10
          ? '0' + dateObject.getHours().toString()
          : dateObject.getHours().toString();
      let minutes =
        dateObject.getMinutes() < 10
          ? '0' + dateObject.getMinutes().toString()
          : dateObject.getMinutes().toString();
      return (
        date.toString() +
        ' ' +
        month +
        ' ' +
        year.toString() +
        ' at ' +
        hour.toString() +
        ':' +
        minutes.toString()
      );
    } else {
      return '';
    }
  }
}
