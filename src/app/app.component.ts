import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Pomodoro';

  inputSessionLength: string = "25";
  sessionLength: number = 1500;

  countdownValue = 1500;
  buttonCommand: string = "Start";
  hasStartedSession: boolean = false;
  isRunning: boolean = false;
  counterInterval: NodeJS.Timeout | undefined;

  displayCounter = this.setDisplayCounter(this.countdownValue);

  public settingsChanged(target: EventTarget | null) {
    if (target === null) {
      return;
    }

    const inputElement = target as HTMLInputElement;

    const parsedValue = inputElement.value.match(/^\d*$/gi);
    
    if (parsedValue === null || parsedValue[0] === "") {
      inputElement.value = String(Math.floor(this.sessionLength/60));
      return;
    }

    this.sessionLength = 60*parseInt(inputElement.value);

    if (!this.hasStartedSession) {
      this.countdownValue = this.sessionLength;
      this.displayCounter = this.setDisplayCounter(this.countdownValue);
    }
  }

  public runCommand() {
    if (this.isRunning) {
      clearInterval(this.counterInterval);
      this.isRunning = false;
      this.buttonCommand = "Resume";
    } else {
      this.hasStartedSession =  true;
      this.startCounter();
      this.isRunning = true;
      this.buttonCommand = "Pause";
    }
  }

  public startCounter() {
    this.counterInterval = setInterval(() => {
      this.countdownValue -= 1;

      if (this.countdownValue === 0) {
        clearInterval(this.counterInterval);
        this.hasStartedSession = false;
        this.isRunning = false;
        this.buttonCommand = "Start";
        this.countdownValue = this.sessionLength;
        this.displayCounter = this.setDisplayCounter(this.countdownValue);
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
