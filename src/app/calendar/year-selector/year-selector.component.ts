import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { changePreviewYear } from '../calendar.actions';
import { getPreviewYear } from '../calendar.selector';

@Component({
  selector: 'app-year-selector',
  templateUrl: './year-selector.component.html',
  styleUrls: ['./year-selector.component.css']
})
export class YearSelectorComponent implements OnInit {

  @Output() yearChanged = new EventEmitter();
  selectedYear:number;
  yearPreviews:Array<number>;
  constructor(private store:Store) { }

  ngOnInit(): void {
    this.store.pipe(select(getPreviewYear)).subscribe((year) => {
      this.selectedYear =  year;
      this.yearPreviews = [year-2,year-1,year,year+1,year+2];
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
    for(let year of this.yearPreviews){
      temp.push(year-1);
    }
    this.yearPreviews = temp;
  }

  changeYear(year:number): void {
    this.store.dispatch(changePreviewYear({year: year}));
    this.yearChanged.emit();
  }

  scrollEvent(event:any): void {
    if(event.deltaY > 0){
      this.incrementYearPreviews();
    }
    if(event.deltaY < 0){
      this.decrementYearPreviews();
    }
  }

}
