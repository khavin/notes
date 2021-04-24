import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { getPreviewMonthAndYear } from '../calendar.selector';
import { getNotesByDesc } from '../../notes/notes.selector';
import { Note } from '../../app.reducer';

@Component({
  selector: 'app-date-rows',
  templateUrl: './date-rows.component.html',
  styleUrls: ['./date-rows.component.css']
})
export class DateRowsComponent implements OnInit {

  currentDate:Date = new Date();
  month:number;
  year:number;
  dateList:Array<Object>;

  constructor(private store:Store) { }

  ngOnInit(): void {
    this.store.pipe(select(getPreviewMonthAndYear)).subscribe(monthAndYear => {
      this.month = monthAndYear[0];
      this.year = monthAndYear[1];
      this.generateDateList();
    });
  }

  generateDateList(): void{
    
    this.dateList = []
    
    // Create a date object with selected month and year
    let firstDate:Date = new Date(this.year,this.month,1);
    // Get last date
    let lastDate:Date = new Date(this.year,(this.month+1)%12,0);
    // Get previous month last date
    let lastDatePreviousMonth:Date = new Date(this.year,this.month,0);
    // Get first date day
    let firstDateDay:number  = firstDate.getDay();
    // Get next month first date
    let nextMonthDate:Date = new Date(this.year, (this.month+1), 1);

    // Calculate previous month dates to show
    let previousMonthDates:Array<Object> = [];
    for(let i = 0;i<firstDateDay;i++){
      previousMonthDates.unshift({"date": lastDatePreviousMonth.getDate()-i,"month": lastDatePreviousMonth.getMonth(),"year": lastDatePreviousMonth.getFullYear()});
    }

    // Get the current month dates to show
    let currentMonthDates:Array<Object> = [];
    for(let i=1;i<=lastDate.getDate();i++){
      currentMonthDates.push({"date": i,"month": firstDate.getMonth(),"year": firstDate.getFullYear()});
    }

    // Get next month dates to show
    let nextMonthDates:Array<Object> = [];
    for(let i=1;i<=(42-(previousMonthDates.length+currentMonthDates.length));i++){
      nextMonthDates.push({"date": i,"month": nextMonthDate.getMonth(),"year": nextMonthDate.getFullYear()});
    }

    // Combine all dates
    this.dateList = this.dateList.concat(previousMonthDates,currentMonthDates,nextMonthDates);

  }  
}
