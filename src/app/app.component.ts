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
  title = 'Pomodoro';

  countdownValue = 30;
  counterInterval: NodeJS.Timeout | undefined;

  displayCounter = this.setDisplayCounter(this.countdownValue);;

  public startCounter() {
    console.log("Start counter");
    this.counterInterval = setInterval(() => {
      console.log("Count down");
      this.countdownValue -= 1;

      if (this.countdownValue === 0) {
        clearInterval(this.counterInterval);
      }
  
      this.displayCounter = this.setDisplayCounter(this.countdownValue);
    }, 1000);
  }

  public setDisplayCounter(secondsRemaining: number): string {
    const countdownMinutes = Math.floor(secondsRemaining / 60);
    const countdownSeconds = secondsRemaining - 60*countdownMinutes;

    const displayCounterMinutes = countdownMinutes.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false});

    const displayCounterSeconds = countdownSeconds.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false});

    return `${displayCounterMinutes}:${displayCounterSeconds}`;
  }
}
