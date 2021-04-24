import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  selectedNoteTitle:Subject<string> = new Subject();
  selectedNoteContent:Subject<string> = new Subject();

  constructor() { }
}
