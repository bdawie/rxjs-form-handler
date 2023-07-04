import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable, combineLatestWith, fromEvent, map } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @ViewChild('email', { static: true }) email!: ElementRef;
  @ViewChild('password', { static: true }) password!: ElementRef;
  @ViewChild('repeatPassword', { static: true }) repeatPassword!: ElementRef;

  emailValue = '';
  passwordValue = '';
  repeatedPasswordValue = '';

  emailStrm$: Observable<string> | undefined;
  passwordStrm$: Observable<any> | undefined;
  repeatPasswordStrm$: Observable<any> | undefined;

  isEmailValid = false;
  isPasswordValid = false;
  passwordMatch = false;

  isDisabled = true;

  emailContext = { $implicit: '', text: '' };
  passwordContext = { $implicit: '', text: '' };
  repeatPasswordContext = { $implicit: '', text: '' };

  constructor() {}

  ngOnInit() {
    this.emailStrm$ = fromEvent(this.email.nativeElement, 'keyup').pipe(
      map((e: any) => {
        const value = e.target.value;

        if (value.length > 0) {
          const mailValidator = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g);

          if (mailValidator.test(value)) {
            this.emailContext.text = '';
            return value;
          } else {
            this.emailContext.text = 'Plesae provide a correct email!';
            return '';
          }
        } else {
          this.emailContext.text = 'Plesae fill this field!';
          return '';
        }
      })
    );

    this.passwordStrm$ = fromEvent(this.password.nativeElement, 'keyup').pipe(
      map((e: any) => {
        const value = e.target.value;

        if (value.length > 0) {
          if (value.length >= 4) {
            this.passwordContext.text = '';
            return value;
          } else {
            this.passwordContext.text = 'Too short password!';
            return '';
          }
        } else {
          this.passwordContext.text = 'Password cannot be empty!';
          return '';
        }
      })
    );

    this.repeatPasswordStrm$ = fromEvent(
      this.repeatPassword.nativeElement,
      'blur'
    );

    this.repeatPasswordStrm$
      .pipe(combineLatestWith(this.emailStrm$, this.passwordStrm$))
      .subscribe({
        next: (results) => {
          this.emailValue = results[1];
          this.passwordValue = results[2];
          this.repeatedPasswordValue = (results[0] as any).target.value;

          if (this.emailValue.length) {
            if (this.passwordValue.length) {
              if (this.passwordValue === this.repeatedPasswordValue) {
                this.isDisabled = false;
                this.repeatPasswordContext.text = '';
              } else {
                this.repeatPasswordContext.text = 'Password do not match!';
                this.isDisabled = true;
              }
            } else {
              this.repeatPasswordContext.text = '';
              this.isDisabled = true;
            }
          } else {
            this.repeatPasswordContext.text = '';
            this.isDisabled = true;
          }
        },
      });
  }

  onRegisterClick() {
    alert(
      this.emailValue +
        ' ' +
        this.passwordValue +
        ' ' +
        this.repeatedPasswordValue
    );
  }
}
