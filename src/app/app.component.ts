import { Component, ViewChild, ElementRef } from '@angular/core';
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
  @ViewChild('audioPlayer', { static: false }) audioPlayer!: ElementRef;

  title = 'Pomodoro';

  sessionCounter: number = 1;
  breakCounter: number = 0;

  inputSessionLength: string = "25";
  inputShortBreakLength: string = "5";
  inputLongBreakLength: string = "15";

  cycleLengths: { [key: string]: number } = {
    sessionLength: 1500,
    shortBreakLength: 300,
    longBreakLength: 900
  };

  countdownValue = this.cycleLengths['sessionLength'];
  counterInterval: NodeJS.Timeout | undefined;

  buttonCommand: string = "Start";
  displayCounter = this.setDisplayCounter();
  displaySession = `Session ${this.sessionCounter}`;

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

    if (!this.isRunningCycle && this.isCurrentCycle(fieldName)) {
      this.countdownValue = this.cycleLengths[fieldName];
      this.displayCounter = this.setDisplayCounter();
    }
  }

  private isCurrentCycle(cycleName: string): boolean {
    if (cycleName === 'longBreakLength' && this.sessionCounter % 4 === 0 && this.sessionCounter === this.breakCounter) {
      return true;
    }
    
    if (cycleName === 'shortBreakLength' && this.sessionCounter === this.breakCounter) {
      return true;
    }

    if (cycleName === 'sessionLength' && this.sessionCounter > this.breakCounter) {
      return true;
    }

    return false;
  }

  public runCommand() {
    if (this.isPaused) {
      this.stopAlarm();
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
    this.playAlarm();
    clearInterval(this.counterInterval);
    this.isRunningCycle = false;
    this.isPaused = true;
    this.buttonCommand = "Start";
    this.displayCounter = this.setDisplayCounter();
    this.displaySession = this.setDisplaySession();
  }

  private playAlarm() {
    this.audioPlayer.nativeElement.loop = false;
    this.audioPlayer.nativeElement.play();
  }

  private stopAlarm() {
    this.audioPlayer.nativeElement.pause();
    this.audioPlayer.nativeElement.currentTime = 0;
  }

  private setDisplaySession(): string {
    if (this.sessionCounter % 4 === 0 && this.sessionCounter > this.breakCounter) {
      this.breakCounter += 1;
      this.countdownValue = this.cycleLengths['longBreakLength'];
      return "Long Break";
    }

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
