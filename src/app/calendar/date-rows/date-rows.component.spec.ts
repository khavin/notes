import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateRowsComponent } from './date-rows.component';

describe('DateRowsComponent', () => {
  let component: DateRowsComponent;
  let fixture: ComponentFixture<DateRowsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DateRowsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DateRowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
