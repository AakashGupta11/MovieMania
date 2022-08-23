import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MoviesService } from './movies.service';

@Injectable({
  providedIn: 'root',
})
export class WatchListService {
  apiUrl =
    'https://hd1gehz0k5.execute-api.us-east-2.amazonaws.com/dev/watchlist';

  constructor(
    private http: HttpClient,
    private router: Router,
    private movieService: MoviesService
  ) {}

  getWatchList() {
    const email = sessionStorage.getItem('email');
    const getWatchMoviesUrl = this.apiUrl + '?email=' + email;
    return this.http.get(getWatchMoviesUrl);
  }

  addWatchList(movieId: string) {
    if (
      sessionStorage.getItem('isAuthenticated') == 'True' &&
      sessionStorage.getItem('email') != null
    ) {
      const email = sessionStorage.getItem('email');
      this.movieService
        .getSingleMovieFromMovieDB(movieId)
        .subscribe((movieDbResponse: any) => {
          const imdbId = movieDbResponse['imdb_id'];
          this.movieService
            .getSingleMovieFromOMDB(imdbId)
            .subscribe((omdbResponse: any) => {
              let movieDetails = {
                runtime: omdbResponse['Runtime'],
                poster_path: omdbResponse['Poster'],
                movie_id: omdbResponse['imdbID'],
                title: omdbResponse['Title'],
                overview: omdbResponse['Plot'],
              };
              const addWatchMoviesUrl = this.apiUrl + '?email=' + email;
              this.http.post(addWatchMoviesUrl, movieDetails).subscribe(
                (response: any) => {
                  if (response.statusCode == 201)
                    console.log('Movie is successfully added');
                },
                (error) => {
                  console.log('Error occurred while adding movies');
                }
              );
            });
        });
    } else {
      this.router.navigate(['/login']);
    }
  }

  addWatchListIMDB(movieId: string) {
    if (
      sessionStorage.getItem('isAuthenticated') == 'True' &&
      sessionStorage.getItem('email') != null
    ) {
      const email = sessionStorage.getItem('email');
      this.movieService
        .getSingleMovieFromOMDB(movieId)
        .subscribe((omdbResponse: any) => {
          let movieDetails = {
            runtime: omdbResponse['Runtime'],
            poster_path: omdbResponse['Poster'],
            movie_id: omdbResponse['imdbID'],
            title: omdbResponse['Title'],
            overview: omdbResponse['Plot'],
          };
          const addWatchMoviesUrl = this.apiUrl + '?email=' + email;
          this.http.post(addWatchMoviesUrl, movieDetails).subscribe(
            (response: any) => {
              if (response.statusCode == 201)
                console.log('Movie is successfully added');
            },
            (error) => {
              console.log('Error occurred while adding movies');
            }
          );
        });
    } else {
      this.router.navigate(['/login']);
    }
  }

  deleteWatchList(movieId: string) {
    const email = sessionStorage.getItem('email');
    const deleteWatchMoviesUrl =
      this.apiUrl + '?email=' + email + '&movieId=' + movieId;
    return this.http.delete(deleteWatchMoviesUrl);
  }
}
