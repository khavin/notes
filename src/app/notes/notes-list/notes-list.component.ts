import { Component, OnInit } from '@angular/core';
import { Store,select } from '@ngrx/store';
import { getNotesByDesc,getNotesByDate } from '../notes.selector';

@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.css']
})
export class NotesListComponent implements OnInit {

  constructor(private store:Store) { }

  ngOnInit(): void {
    this.store.select(getNotesByDesc).subscribe((data) => {
    });
    let props = { dates: [new Date()]}
    this.store.pipe(select(getNotesByDate,props)).subscribe((data) => {
    })
  }
}
