import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { search } from '../search.actions';
import { searchString } from '../search.selector';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {

  constructor(private store:Store) { }

  search:any;
  currentSearchString:string = '';

  ngOnInit(): void {
    this.search = new FormControl('');
    this.search.valueChanges.pipe(debounceTime(500)).subscribe((searchString) => {
      if(this.currentSearchString.toLowerCase() != searchString.toLowerCase()){
        this.currentSearchString = searchString;
        this.store.dispatch(search({searchString: searchString}));
      }
    })
    this.store.select(searchString).subscribe(data => {
      if(this.currentSearchString != data){
        this.currentSearchString = data;
        this.search.setValue(data);
      }
    })
  }

}
