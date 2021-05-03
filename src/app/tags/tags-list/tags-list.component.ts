import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { allTags } from '../tags.selector';
import { search } from '../../search/search.actions';
import { searchString } from '../../search/search.selector';

@Component({
  selector: 'app-tags-list',
  templateUrl: './tags-list.component.html',
  styleUrls: ['./tags-list.component.css']
})
export class TagsListComponent implements OnInit {

  tags:Array<string> = [];
  searchedTag:string = '';
  searchString:string = '';
  constructor(private store:Store) { }
  
  ngOnInit(): void {
    this.store.select(allTags).subscribe((data) => {
      this.tags = data.sort();
    })
    this.store.select(searchString).subscribe((data) => {
      this.searchString = data.toLowerCase();
      this.searchedTag = data.toLowerCase();
    })
  }

  searchTag(tag:string): void{
    if(this.searchedTag == tag){
      this.searchedTag = '';
      this.store.dispatch(search({searchString: ''}));
    }else{
      this.searchedTag = tag;
      this.store.dispatch(search({searchString: tag}));
    } 
  }

}
