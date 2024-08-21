import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LucyCalendarComponent } from "./lucy-calendar/lucy-calendar.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LucyCalendarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'myapp';
}
