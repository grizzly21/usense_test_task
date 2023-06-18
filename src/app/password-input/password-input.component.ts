import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {debounceTime, distinctUntilChanged, fromEvent, map, Subscription} from "rxjs";
import {PasswordStrength} from "../enums/password-strength.enum";

@Component({
  selector: 'app-password-input',
  templateUrl: './password-input.component.html',
  styleUrls: ['./password-input.component.css']
})
export class PasswordInputComponent implements AfterViewInit, OnDestroy{
  @ViewChild('passwordInput') passwordInput?: ElementRef;

  password: string = '';
  passwordStrength: PasswordStrength = PasswordStrength.EMPTY;
  private inputSub$!: Subscription;

  ngAfterViewInit() {
    const input$ = fromEvent<any>(
      this.passwordInput?.nativeElement as HTMLInputElement,
      'input')
      .pipe(
        map(event => event.target?.value),
        debounceTime(300),
        distinctUntilChanged()
      );
    this.inputSub$ = input$.subscribe(
      res => {
        this.password = res;
        this.checkPasswordStrength()
      }
    )
  }

  checkPasswordStrength(){
    if (!this.password) {
      this.passwordStrength = PasswordStrength.EMPTY;
    } else if (this.password.length < 8) {
      this.passwordStrength = PasswordStrength.SHORT;
    } else if (
      /[A-Za-z]/.test(this.password) &&
      /[0-9]/.test(this.password) &&
      /[!@#$%^&*/.,]/.test(this.password)
    ) {
      this.passwordStrength = PasswordStrength.STRONG;
    } else if (
      (/[A-Za-z]/.test(this.password) && /[!@#$%^&*/.,]/.test(this.password)) ||
      (/[A-Za-z]/.test(this.password) && /[0-9]/.test(this.password)) ||
      (/[0-9]/.test(this.password) && /[!@#$%^&*/.,]/.test(this.password))
    ) {
      this.passwordStrength = PasswordStrength.MEDIUM;
    } else {
      this.passwordStrength = PasswordStrength.EASY;
    }

    console.log("password strength is :", PasswordStrength[this.passwordStrength])
  }

  ngOnDestroy() {
    this.inputSub$.unsubscribe();
  }
}
