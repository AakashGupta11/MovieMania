import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WatchListService } from '../services/watch-list.service';

@Component({
  selector: 'app-watch-movies',
  templateUrl: './watch-movies.component.html',
  styleUrls: ['./watch-movies.component.css'],
})
export class WatchMoviesComponent implements OnInit {
  watchedMovies: any = [];
  runtime: any = '';
  isWatchMovies: boolean = true;
  constructor(private router: Router, private watchService: WatchListService) {}

  ngOnInit(): void {
    if (
      sessionStorage.getItem('isAuthenticated') == 'True' &&
      sessionStorage.getItem('email') != null
    ) {
      this.getWatchedMovies();
    } else {
      this.router.navigate(['/login']);
    }
  }

  calculateRuntime(movies: any) {
    let time = 0;
    for (let i = 0; i < movies.length; i++) {
      time +=
        movies[i]['runtime'] != 'N/A'
          ? parseInt(movies[i]['runtime'].split(' ')[0])
          : 0;
    }
    let s = '';
    if (Math.floor(time / 60 / 24) > 0)
      s += Math.floor(time / 60 / 24) + ' Days ';
    if (Math.floor((time / 60) % 24) > 0)
      s += Math.floor((time / 60) % 24) + ' Hrs ';
    if (time % 60 > 0) s += (time % 60) + ' Mins';
    return s;
  }

  getWatchedMovies() {
    this.watchService.getWatchList().subscribe((response: any) => {
      if (response.statusCode == 200) {
        let body = JSON.parse(response.body);
        if (body['movies'].length > 0) {
          this.watchedMovies = body['movies'];
          this.isWatchMovies = true;
          this.runtime = this.calculateRuntime(this.watchedMovies);
        } else {
          this.isWatchMovies = false;
        }
      }
    });
  }

  deleteWatchedMovie(movieId: string) {
    this.watchService.deleteWatchList(movieId).subscribe((response: any) => {
      if (response.statusCode == 200) {
        console.log('Movie successfully deleted');
        this.getWatchedMovies();
      } else {
        console.log('Error occurred while deleting movie');
      }
    });
  }
}
