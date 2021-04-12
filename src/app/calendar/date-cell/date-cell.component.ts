import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-date-cell',
  templateUrl: './date-cell.component.html',
  styleUrls: ['./date-cell.component.css']
})
export class DateCellComponent implements OnInit {

  constructor() { }

  @Input() date:number;
  
  ngOnInit(): void {
  }

}
