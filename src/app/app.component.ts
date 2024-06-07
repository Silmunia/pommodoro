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

  sessionCounter: number = 1;
  breakCounter: number = 0;

  inputSessionLength: string = "25";
  inputShortBreakLength: string = "5";

  cycleLengths: { [key: string]: number } = {
    sessionLength: 1500,
    shortBreakLength: 300
  };

  countdownValue = this.cycleLengths['sessionLength'];
  counterInterval: NodeJS.Timeout | undefined;

  buttonCommand: string = "Start";
  displayCounter = this.setDisplayCounter();
  displaySession = "Session 1";

  isRunningCycle: boolean = false;
  isPaused: boolean = true;

  public settingsChanged(target: EventTarget | null, fieldName: string) {
    if (target === null) {
      return;
    }

    const inputElement = target as HTMLInputElement;

    const parsedValue = inputElement.value.match(/^\d*$/gi);
    
    if (parsedValue === null || parsedValue[0] === "") {
      inputElement.value = String(Math.floor(this.cycleLengths[fieldName]/60));
      return;
    }

    this.cycleLengths[fieldName] = 60*parseInt(inputElement.value);

    if (!this.isRunningCycle) {
      this.countdownValue = this.cycleLengths[fieldName];
      this.displayCounter = this.setDisplayCounter();
    }
  }

  public runCommand() {
    if (this.isPaused) {
      this.isRunningCycle =  true;

      this.startCounter();
      this.isPaused = false;
      this.buttonCommand = "Pause";
    } else {
      clearInterval(this.counterInterval);
      this.isPaused = true;
      this.buttonCommand = "Resume";
    }
  }

  private startCounter() {
    this.counterInterval = setInterval(() => {
      this.countdownValue -= 1;

      if (this.countdownValue === 0) {
        this.finishCycle();
      }
  
      this.displayCounter = this.setDisplayCounter();
    }, 1000);
  }

  private finishCycle() {
    clearInterval(this.counterInterval);
    this.isRunningCycle = false;
    this.isPaused = true;
    this.buttonCommand = "Start";
    this.displayCounter = this.setDisplayCounter();
    this.displaySession = this.setDisplaySession();
  }

  private setDisplaySession(): string {
    if (this.sessionCounter > this.breakCounter) {
      this.breakCounter += 1;
      this.countdownValue = this.cycleLengths['shortBreakLength'];
      return "Short Break";
    }

    this.sessionCounter += 1;
    this.countdownValue = this.cycleLengths['sessionLength'];
    return `Session ${this.sessionCounter}`;
  }

  private setDisplayCounter(): string {
    const countdownMinutes = Math.floor(this.countdownValue / 60);
    const countdownSeconds = this.countdownValue - 60*countdownMinutes;

    const displayCounterMinutes = countdownMinutes.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false});

    const displayCounterSeconds = countdownSeconds.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false});

    return `${displayCounterMinutes}:${displayCounterSeconds}`;
  }
}
