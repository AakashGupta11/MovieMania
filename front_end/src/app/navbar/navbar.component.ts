import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  searchedText: string = '';
  constructor(private router: Router) {}

  ngOnInit(): void {}

  isUserAuthenticated() {
    if (
      sessionStorage.getItem('isAuthenticated') == 'True' &&
      sessionStorage.getItem('email') != null
    )
      return true;
    else return false;
  }

  searchMovies() {
    this.router.navigate(['/search', this.searchedText]);
  }
}
