import { Component, OnInit } from '@angular/core';
import { colors,colorDefinitions,allColors } from '../colors.constant';
import { addColor, removeColor } from '../colors.actions';
import { getPickedColors } from '../colors.selector';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.css']
})
export class ColorPickerComponent implements OnInit {

  constructor(private store:Store) { }

  availableColors:Array<string> = allColors;
  colorPalette:colors = colorDefinitions;
  pickedColors:Array<string> = [];
  noColorSelected:boolean;

  ngOnInit(): void {
    this.store.select(getPickedColors).subscribe( (data) => {
      this.pickedColors = data.pickedColors;
      this.noColorSelected = data.noColorSelected;
    })
  }

  colorSelected(color:string): void {
    if(this.noColorSelected){
      this.addColor(color);
    }else{
      if (this.pickedColors.includes(color)){
        this.removeColor(color);
      }else{
        this.addColor(color);
      }
    }
  }
  addColor(color:string): void {
    this.store.dispatch(addColor({color: color}));
  }

  removeColor(color:string): void {
    this.store.dispatch(removeColor({color: color}));
  }

}
