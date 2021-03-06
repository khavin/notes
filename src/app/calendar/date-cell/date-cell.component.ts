import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { changeSelectedDate } from '../calendar.actions';
import { colors,colorDefinitions,allColors } from '../../colors/colors.constant';

@Component({
  selector: 'app-date-cell',
  templateUrl: './date-cell.component.html',
  styleUrls: ['./date-cell.component.css']
})
export class DateCellComponent implements OnInit {

  constructor(private store:Store) { }

  @Input() date:Object;
  colorPalette:colors = colorDefinitions;

  ngOnInit(): void {
  }


  selectDate(): void {
    this.store.dispatch(changeSelectedDate({date: new Date(this.date["year"],this.date["month"],this.date["date"])}))
  }

}
