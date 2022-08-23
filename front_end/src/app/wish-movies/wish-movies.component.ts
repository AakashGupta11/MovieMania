import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WishListService } from '../services/wish-list.service';

@Component({
  selector: 'app-wish-movies',
  templateUrl: './wish-movies.component.html',
  styleUrls: ['./wish-movies.component.css'],
})
export class WishMoviesComponent implements OnInit {
  wishedMovies: any = [];
  isWishMovies: boolean = true;
  constructor(private router: Router, private wishService: WishListService) {}

  ngOnInit(): void {
    if (
      sessionStorage.getItem('isAuthenticated') == 'True' &&
      sessionStorage.getItem('email') != null
    ) {
      this.getWishedMovies();
    } else {
      this.router.navigate(['/login']);
    }
  }

  getWishedMovies() {
    this.wishService.getWishList().subscribe((response: any) => {
      if (response.statusCode == 200) {
        let body = JSON.parse(response.body);
        if (body['movies'].length > 0) {
          this.wishedMovies = body['movies'];
          this.isWishMovies = true;
        } else {
          this.isWishMovies = false;
        }
      }
    });
  }

  deleteWishedMovie(movieId: string) {
    this.wishService.deleteWishList(movieId).subscribe((response: any) => {
      if (response.statusCode == 200) {
        console.log('Movie successfully deleted');
        this.getWishedMovies();
      } else {
        console.log('Error occurred while deleting movie');
      }
    });
  }
}
