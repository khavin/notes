import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from './calendar.component';
import { DateRowsComponent } from './date-rows/date-rows.component';
import { DateCellComponent } from './date-cell/date-cell.component';
import { MonthSelectorComponent } from './month-selector/month-selector.component';
import { YearSelectorComponent } from './year-selector/year-selector.component';


@NgModule({
  declarations: [
    CalendarComponent,
    DateRowsComponent,
    DateCellComponent,
    MonthSelectorComponent,
    YearSelectorComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CalendarComponent
  ]
})
export class CalendarModule { }
