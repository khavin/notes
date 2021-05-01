import { Component, OnInit, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { fromEvent } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { changePreviewYear } from '../calendar.actions';
import { getPreviewYear } from '../calendar.selector';

@Component({
  selector: 'app-year-selector',
  templateUrl: './year-selector.component.html',
  styleUrls: ['./year-selector.component.css']
})
export class YearSelectorComponent implements OnInit {

  @ViewChild("yearSelector") yearSelector: ElementRef;
  @Output() yearChanged = new EventEmitter();
  selectedYear:number;
  yearPreviews:Array<number>;
  constructor(private store:Store) { }

  ngOnInit(): void {
    this.store.pipe(select(getPreviewYear)).subscribe((year) => {
      this.selectedYear =  year;
      this.yearPreviews = [year-3, year-2,year-1,year,year+1,year+2, year+3];
    })
  }

  ngAfterViewInit(): void {
    fromEvent(this.yearSelector.nativeElement,'wheel').pipe(throttleTime(100)).subscribe((data) => {
      if(data['deltaY'] > 0){
        this.incrementYearPreviews();
      }
      if(data['deltaY'] < 0){
        this.decrementYearPreviews();
      }
    })
  }

  incrementYearPreviews(): void {
    let temp:Array<number> = [];
    for(let year of this.yearPreviews){
      temp.push(year+1);
    }
    this.yearPreviews = temp;
  }

  decrementYearPreviews(): void {
    let temp:Array<number> = [];
    if(this.yearPreviews[0] - 1 >= 1970){
      for(let year of this.yearPreviews){
        temp.push(year-1);
      }
      this.yearPreviews = temp;
    }
  }

  changeYear(year:number): void {
    this.store.dispatch(changePreviewYear({year: year}));
    this.yearChanged.emit();
  }
}
