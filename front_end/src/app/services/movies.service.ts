import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MovieDetailsComponent } from '../movie-details/movie-details.component';

@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  baseUrlMovieDB: string = 'https://api.themoviedb.org/3/movie/';
  baseUrlOMDB: string = 'http://www.omdbapi.com';
  constructor(private http: HttpClient) {}

  //function to know whether movie has been released or not
  isReleased(date: any) {
    var today = new Date();
    var t = new Date(
      today.getFullYear() + ',' + (today.getMonth() + 1) + ',' + today.getDate()
    );
    var r: any = new Date(date);
    if (r == 'Invalid Date') return true;
    else return t > r;
  }

  getUpcomingMovies() {
    return this.http.get(
      this.baseUrlMovieDB +
        'upcoming?api_key=7719d9fc54bec69adbe2d6cee6d93a0d&language=en-US&page=1'
    );
  }

  getPopularMovies() {
    return this.http.get(
      this.baseUrlMovieDB +
        'top_rated?api_key=7719d9fc54bec69adbe2d6cee6d93a0d&language=en-US&page=1'
    );
  }

  getSingleMovieFromMovieDB(movieId: any) {
    return this.http.get(
      this.baseUrlMovieDB +
        movieId +
        '?api_key=7719d9fc54bec69adbe2d6cee6d93a0d&language=en-US'
    );
  }

  getSingleMovieFromOMDB(imdbId: any) {
    return this.http.get(this.baseUrlOMDB + '?apikey=c1c12a90&i=' + imdbId);
  }

  getSimilarMovies(movieId: any) {
    return this.http.get(
      this.baseUrlMovieDB +
        movieId +
        '/recommendations?api_key=7719d9fc54bec69adbe2d6cee6d93a0d&language=en-US&page=1'
    );
  }

  getSearchedMovies(searchedText: string) {
    return this.http.get(
      'https://api.themoviedb.org/3/search/movie?api_key=7719d9fc54bec69adbe2d6cee6d93a0d&query=' +
        searchedText
    );
  }

  getMovieReviews(movieId: string) {
    return this.http.get(
      'https://hd1gehz0k5.execute-api.us-east-2.amazonaws.com/dev/review' +
        '?movieId=' +
        movieId
    );
  }

  postMovieReviews(movieId: string, review: number, comment: string) {
    let reviewBody = {
      movieId: movieId,
      email: sessionStorage.getItem('email'),
      review: review.toString(),
      comment: comment,
    };
    return this.http.post(
      'https://hd1gehz0k5.execute-api.us-east-2.amazonaws.com/dev/review',
      reviewBody
    );
  }
}
