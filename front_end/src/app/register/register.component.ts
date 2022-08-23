import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { LoginRegisterService } from '../services/login-register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  userName: string = '';
  userEmail: string = '';
  userPassword: string = '';
  userContact: string = '';
  isEmptyValues: boolean = false;
  userAlreadyExists: boolean = false;
  isError: boolean = false;
  constructor(
    private loginRegister: LoginRegisterService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  isValidated() {
    this.isEmptyValues = false;
    this.userAlreadyExists = false;
    this.isError = false;
    const onlySpaceRegex = /^\s*$/;
    if (
      this.userName == '' ||
      onlySpaceRegex.test(this.userName) ||
      this.userEmail == '' ||
      onlySpaceRegex.test(this.userEmail) ||
      this.userPassword == '' ||
      onlySpaceRegex.test(this.userPassword) ||
      this.userContact == '' ||
      onlySpaceRegex.test(this.userContact)
    ) {
      this.isEmptyValues = true;
      return false;
    } else {
      this.isEmptyValues = false;
      return true;
    }
  }

  userRegister() {
    if (this.isValidated() == true)
      this.loginRegister
        .register(
          this.userName,
          this.userEmail,
          CryptoJS.SHA256(this.userPassword).toString(CryptoJS.enc.Base64),
          this.userContact
        )
        .subscribe(
          (response: any) => {
            if (response.statusCode == 400) {
              this.userAlreadyExists = true;
            } else if (response.statusCode == 201) {
              sessionStorage.setItem('email', this.userEmail);
              this.router.navigate(['/login']);
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
