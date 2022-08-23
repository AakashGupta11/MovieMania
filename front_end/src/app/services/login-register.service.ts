import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class LoginRegisterService {
  apiUrl = 'https://hd1gehz0k5.execute-api.us-east-2.amazonaws.com/dev/';

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    const loginUrl = this.apiUrl + 'login';
    let loginCredentials = {
      email: email,
      password: password,
    };
    return this.http.post(loginUrl, loginCredentials);
  }

  register(username: string, email: string, password: string, contact: string) {
    const registerUrl = this.apiUrl + 'register';
    let userdetails = {
      username: username,
      email: email,
      password: password,
      contact: contact,
    };
    return this.http.post(registerUrl, userdetails);
  }
}
