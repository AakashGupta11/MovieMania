import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { LoginRegisterService } from '../services/login-register.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  userEmail: any = '';
  userPassword: string = '';
  isEmptyValues: boolean = false;
  isCredentialsIncorrect: boolean = false;
  isError: boolean = false;
  constructor(
    private loginRegister: LoginRegisterService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (sessionStorage.getItem('email') != null)
      this.userEmail = sessionStorage.getItem('email');
  }

  isValidated() {
    this.isEmptyValues = false;
    this.isCredentialsIncorrect = false;
    this.isError = false;
    const onlySpaceRegex = /^\s*$/;
    if (
      this.userEmail == '' ||
      onlySpaceRegex.test(this.userEmail) ||
      this.userPassword == '' ||
      onlySpaceRegex.test(this.userPassword)
    ) {
      this.isEmptyValues = true;
      return false;
    } else {
      this.isEmptyValues = false;
      return true;
    }
  }

  userLogin() {
    if (this.isValidated() == true)
      this.loginRegister
        .login(
          this.userEmail,
          CryptoJS.SHA256(this.userPassword).toString(CryptoJS.enc.Base64)
        )
        .subscribe(
          (response: any) => {
            if (response.statusCode == 400) {
              this.isCredentialsIncorrect = true;
            } else if (response.statusCode == 201) {
              sessionStorage.setItem('isAuthenticated', 'True');
              sessionStorage.setItem('email', this.userEmail);
              this.router.navigate(['/']);
            } else {
              this.isError = true;
            }
          },
          (error) => {
            this.isError = true;
          }
        );
  }
}
