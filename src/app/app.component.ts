import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LucyCalendarComponent } from "../../projects/lucy-calendar/src/lib/lucy-calendar.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LucyCalendarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'myapp';
  date: string = '';
  selectedYear: number = 2017;
  today: Date = new Date();
  min: Date = new Date(2025, 0, 1);
  availableYears: number[] = Array.from({ length: 101 }, (_, i) => new Date().getFullYear() - 50 + i);
  eventDate: string = '';
  birthDate: string = '';

}
