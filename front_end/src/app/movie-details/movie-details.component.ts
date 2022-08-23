import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MoviesService } from '../services/movies.service';
import { WatchListService } from '../services/watch-list.service';
import { WishListService } from '../services/wish-list.service';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css'],
})
export class MovieDetailsComponent implements OnInit {
  movieId: any = '';
  movieDetails: any = {};
  similarMovies: any = [];
  isUserLoggedIn: boolean = false;
  movieReviews: any = [];
  comment: string = '';
  currentRating: number = 0;

  constructor(
    private route: ActivatedRoute,
    private MovieService: MoviesService,
    private router: Router,
    private watchService: WatchListService,
    private wishService: WishListService
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.movieId = this.route.snapshot.params['id'];
    this.populateMovieDetails();
    this.populateSimilarMovies();
    this.populateReviews(this.movieId);

    this.route.params.subscribe((params: Params) => {
      this.movieId = params['id'];
    });

    if (
      sessionStorage.getItem('isAuthenticated') == 'True' &&
      sessionStorage.getItem('email') != null
    )
      this.isUserLoggedIn = true;
  }

  addToWatchList(movieId: string) {
    this.watchService.addWatchList(movieId);
  }

  addToWishList(movieId: string) {
    this.wishService.addWishList(movieId);
  }

  addToWatchListIfIMDB(movieId: string) {
    this.watchService.addWatchListIMDB(movieId);
  }

  addToWishListIfIMDB(movieId: string) {
    this.wishService.addWishListIMDB(movieId);
  }

  populateMovieDetails() {
    this.MovieService.getSingleMovieFromMovieDB(this.movieId).subscribe(
      (movieDbResponse: any) => {
        const imdbId = movieDbResponse['imdb_id'];
        this.MovieService.getSingleMovieFromOMDB(imdbId).subscribe(
          (omdbResponse: any) => {
            this.movieDetails = {
              title: omdbResponse['Title'],
              genre: omdbResponse['Genre'],
              released: omdbResponse['Released'],
              rated: omdbResponse['Rated'],
              imdbRating: omdbResponse['imdbRating'],
              directors: omdbResponse['Director'],
              writers: omdbResponse['Writer'],
              actors: omdbResponse['Actors'],
              plot: omdbResponse['Plot'],
              poster: omdbResponse['Poster'],
              imdbId: omdbResponse['imdbID'],
            };
          },
          (error) => {}
        );
      },
      (error) => {}
    );
  }

  populateSimilarMovies() {
    this.MovieService.getSimilarMovies(this.movieId).subscribe(
      (response: any) => {
        response['results'].forEach((movieObject: any) => {
          if (movieObject['poster_path'] != null) {
            this.similarMovies.push({
              id: movieObject['id'],
              posterPath:
                'https://image.tmdb.org/t/p/original' +
                movieObject['poster_path'],
            });
          }
        });
        this.similarMovies =
          this.similarMovies.length > 4
            ? this.similarMovies.slice(0, 4)
            : this.similarMovies;
      },
      (error) => {}
    );
  }

  populateReviews(movieId: string) {
    this.MovieService.getMovieReviews(movieId).subscribe((response: any) => {
      if (response.statusCode == 200) {
        let body = JSON.parse(response.body);
        if (body['reviews'].length > 0) {
          this.movieReviews = body['reviews'];
        } else {
          this.movieReviews = [];
        }
      }
    });
  }

  postReviewComment() {
    this.MovieService.postMovieReviews(
      this.movieId,
      this.currentRating,
      this.comment
    ).subscribe(
      (response) => {
        this.populateReviews(this.movieId);
        this.currentRating = 0;
        this.comment = '';
      },
      (error) => {}
    );
  }
}
