import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { allTags } from '../tags.selector';
import { search } from '../../search/search.actions';

@Component({
  selector: 'app-tags-list',
  templateUrl: './tags-list.component.html',
  styleUrls: ['./tags-list.component.css']
})
export class TagsListComponent implements OnInit {

  tags:Array<string> = [];
  searchedTag:string = '';
  constructor(private store:Store) { }
  
  ngOnInit(): void {
    this.store.select(allTags).subscribe((data) => {
      this.tags = data;
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
