import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { changePreviewMonth } from '../calendar.actions';
import { getPreviewMonth } from '../calendar.selector';
import { numberToMonthObj, numberToShortMonthMappings } from '../calendar.constants';

@Component({
  selector: 'app-month-selector',
  templateUrl: './month-selector.component.html',
  styleUrls: ['./month-selector.component.css']
})
export class MonthSelectorComponent implements OnInit {
  @Output() monthChanged = new EventEmitter();
  selectedMonth:number;
  monthIndex:Array<number> = [0,1,2,3,4,5,6,7,8,9,10,11];
  numberToMonthMappings:numberToMonthObj = numberToShortMonthMappings;
  constructor(private store:Store) { }

  ngOnInit(): void {
    this.store.pipe(select(getPreviewMonth)).subscribe((month) => {
      this.selectedMonth =  month;
    })
  }

  changeMonth(month:number): void {
    this.store.dispatch(changePreviewMonth({month: month}));
    this.monthChanged.emit();
  }
}
