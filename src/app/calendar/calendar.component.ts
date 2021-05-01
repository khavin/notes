import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { incrementPreviewMonth,decrementPreviewMonth, changePreviewToToday  } from './calendar.actions';
import { getSelectedDate, getPreviewMonthShortName, getPreviewYear } from './calendar.selector';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  date:Observable<Date>;
  month:Observable<string>;
  year:Observable<number>;
  showCalendar:boolean = true;
  showMonthSelector:boolean = false;
  showYearSelector:boolean = false;

  constructor(private store:Store) { 
  }

  ngOnInit(): void {
    this.date = this.store.pipe(select(getSelectedDate));
    this.month = this.store.pipe(select(getPreviewMonthShortName));
    this.year = this.store.pipe(select(getPreviewYear));
  }

  nextMonth(): void{
    this.store.dispatch(incrementPreviewMonth());
  }

  previousMonth(): void{
    this.store.dispatch(decrementPreviewMonth());
  }

  changePreviewToToday(): void{
    this.showYearSelector = false;
    this.showMonthSelector = false;
    this.showCalendar = true;
    this.store.dispatch(changePreviewToToday());
  }

  openMonthSelector(): void{
    if(!this.showMonthSelector){
      this.showCalendar = false;
      this.showYearSelector = false;
      this.showMonthSelector = true;
    }else{
      this.closeMonthSelector();
    }
  }

  closeMonthSelector(): void{
    this.showYearSelector = false;
    this.showMonthSelector = false;
    this.showCalendar = true;
  }

  openYearSelector(): void{
    if(!this.showYearSelector){
      this.showCalendar = false;
      this.showMonthSelector = false;
      this.showYearSelector = true;
    }else{
      this.closeYearSelector();
    }
  }

  closeYearSelector(): void{
    this.showMonthSelector = false;
    this.showYearSelector = false;
    this.showCalendar = true;
  }

}
