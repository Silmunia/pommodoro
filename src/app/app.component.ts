import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Pommodoro';

  countdownMinutes = (0).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false});
  countdownSeconds = (0).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false});
}
