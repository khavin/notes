import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { getPreviewMonthAndYear } from '../calendar.selector';
import { getNotesByDesc } from '../../notes/notes.selector';
import { Note } from '../../app.reducer';

@Component({
  selector: 'app-date-rows',
  templateUrl: './date-rows.component.html',
  styleUrls: ['./date-rows.component.css'],
})
export class DateRowsComponent implements OnInit {
  currentDate: Date = new Date();
  month: number;
  year: number;
  dateColorList: Array<Object>;
  notes: Array<Note> = [];
  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store
      .pipe(select(getPreviewMonthAndYear))
      .subscribe((monthAndYear) => {
        this.month = monthAndYear[0];
        this.year = monthAndYear[1];
        this.generateDateList();
      });
    this.store.pipe(select(getNotesByDesc)).subscribe((notes) => {
      this.notes = notes;
      this.generateDateList();
    });
  }
  
  generateDateList(): void {
    let dateList: Array<Object> = [];

    // Create a date object with selected month and year
    let firstDate: Date = new Date(this.year, this.month, 1);
    // Get last date
    let lastDate: Date = new Date(this.year, (this.month + 1) % 12, 0);
    // Get previous month last date
    let lastDatePreviousMonth: Date = new Date(this.year, this.month, 0);
    // Get first date day
    let firstDateDay: number = firstDate.getDay();
    // Get next month first date
    let nextMonthDate: Date = new Date(this.year, this.month + 1, 1);

    // Calculate previous month dates to show
    let previousMonthDates: Array<Object> = [];
    for (let i = 0; i < firstDateDay; i++) {
      previousMonthDates.unshift({
        date: lastDatePreviousMonth.getDate() - i,
        month: lastDatePreviousMonth.getMonth(),
        year: lastDatePreviousMonth.getFullYear(),
        colors: [],
      });
    }

    // Get the current month dates to show
    let currentMonthDates: Array<Object> = [];
    for (let i = 1; i <= lastDate.getDate(); i++) {
      currentMonthDates.push({
        date: i,
        month: firstDate.getMonth(),
        year: firstDate.getFullYear(),
        colors: [],
      });
    }

    // Get next month dates to show
    let nextMonthDates: Array<Object> = [];
    for (
      let i = 1;
      i <= 42 - (previousMonthDates.length + currentMonthDates.length);
      i++
    ) {
      nextMonthDates.push({
        date: i,
        month: nextMonthDate.getMonth(),
        year: nextMonthDate.getFullYear(),
        colors: [],
      });
    }

    // Combine all dates
    dateList = dateList.concat(
      previousMonthDates,
      currentMonthDates,
      nextMonthDates
    );

    this.combineColorsByDate(dateList);
  }

  combineColorsByDate(dateList: Array<Object>): void {
    let dateColorList = [];
    let firstDateObject = new Date(
      dateList[0]['year'],
      dateList[0]['month'],
      dateList[0]['date']
    );
    let lastDateObject = new Date(
      dateList[41]['year'],
      dateList[41]['month'],
      dateList[41]['date']
    );
    let noteObjectByDate = {};
    for (let note of this.notes) {
      let lastModifiedDate = new Date(
        note.lastModified.getFullYear(),
        note.lastModified.getMonth(),
        note.lastModified.getDate()
      );
      if (
        lastModifiedDate >= firstDateObject &&
        lastModifiedDate <= lastDateObject
      ) {
        let stringifiedDate =
          lastModifiedDate.getFullYear().toString() +
          '-' +
          lastModifiedDate.getMonth().toString() +
          '-' +
          lastModifiedDate.getDate().toString();
        if (stringifiedDate in noteObjectByDate) {
          noteObjectByDate[stringifiedDate] = noteObjectByDate[
            stringifiedDate
          ].concat(note.color);
        } else {
          noteObjectByDate[stringifiedDate] = [];
          noteObjectByDate[stringifiedDate] = noteObjectByDate[
            stringifiedDate
          ].concat(note.color);
        }
      }
      if (lastModifiedDate < firstDateObject) break;
    }
    for (let dateObject of dateList) {
      let stringifiedDate =
        dateObject['year'] +
        '-' +
        dateObject['month'] +
        '-' +
        dateObject['date'];
      if (stringifiedDate in noteObjectByDate) {
        dateObject['colors'] = [...new Set(noteObjectByDate[stringifiedDate])];
      }
      dateColorList = dateColorList.concat(dateObject);
    }
    console.log(dateColorList);
    this.dateColorList = dateColorList;
  }
}
