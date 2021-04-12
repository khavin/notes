import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CalendarModule } from './calendar/calendar.module';
import { calendarReducer } from './calendar/calendar.reducer';
import { ColorsModule } from './colors/colors.module';
import { colorReducer } from './colors/colors.reducer';
import { NotesModule } from './notes/notes.module';
import { notesReducer } from './notes/notes.reducer';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule} from '@ngrx/store-devtools';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CalendarModule,
    ColorsModule,
    NotesModule,
    StoreModule.forRoot({calendar: calendarReducer, colors: colorReducer, notes: notesReducer }),
    StoreDevtoolsModule.instrument({
      maxAge: 25 // Retains last 25 states
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
