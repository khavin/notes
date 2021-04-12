import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotesListComponent } from './notes-list/notes-list.component';
import { NotesViewEditComponent } from './notes-view-edit/notes-view-edit.component';

@NgModule({
  declarations: [NotesListComponent, NotesViewEditComponent],
  imports: [
    CommonModule
  ],
  exports: [NotesListComponent, NotesViewEditComponent]
})
export class NotesModule { }
