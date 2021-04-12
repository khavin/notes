import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesViewEditComponent } from './notes-view-edit.component';

describe('NotesViewEditComponent', () => {
  let component: NotesViewEditComponent;
  let fixture: ComponentFixture<NotesViewEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotesViewEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotesViewEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
