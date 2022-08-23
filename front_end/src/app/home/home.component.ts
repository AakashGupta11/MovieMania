import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MoviesService } from '../services/movies.service';
import { WatchListService } from '../services/watch-list.service';
import { WishListService } from '../services/wish-list.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  upcomingMovies: any[] = [];
  popularMovies: any[] = [];
  searchedText: string = '';

  constructor(
    private MovieService: MoviesService,
    private router: Router,
    private watchService: WatchListService,
    private wishService: WishListService
  ) {}

  ngOnInit(): void {
    this.populateUpcomingMovies();
    this.populatePopularMovies();
  }

  isUserAuthenticated() {
    if (
      sessionStorage.getItem('isAuthenticated') == 'True' &&
      sessionStorage.getItem('email') != null
    )
      return true;
    else return false;
  }

  addToWatchList(movieId: string) {
    this.watchService.addWatchList(movieId);
  }

  addToWishList(movieId: string) {
    this.wishService.addWishList(movieId);
  }

  searchMovies() {
    this.router.navigate(['/search', this.searchedText]);
  }

  populateMovieArray(data: any) {
    let movieArray: any = [];
    data.forEach((movieObject: any) => {
      if (movieObject['poster_path'] != null) {
        movieArray.push({
          id: movieObject['id'],
          posterPath:
            'https://image.tmdb.org/t/p/original' + movieObject['poster_path'],
        });
      }
    });
    return movieArray;
  }

  populateUpcomingMovies() {
    this.MovieService.getUpcomingMovies().subscribe(
      (response: any) => {
        this.upcomingMovies = this.populateMovieArray(response['results']);
      },
      (error) => {}
    );
  }

  populatePopularMovies() {
    this.MovieService.getPopularMovies().subscribe(
      (response: any) => {
        this.popularMovies = this.populateMovieArray(response['results']);
      },
      (error) => {}
    );
  }
}
