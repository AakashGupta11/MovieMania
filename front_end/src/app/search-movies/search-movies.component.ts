import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MoviesService } from '../services/movies.service';
import { WatchListService } from '../services/watch-list.service';
import { WishListService } from '../services/wish-list.service';

@Component({
  selector: 'app-search-movies',
  templateUrl: './search-movies.component.html',
  styleUrls: ['./search-movies.component.css'],
})
export class SearchMoviesComponent implements OnInit {
  searchedText = '';
  searchedMovies: any = [];

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
    this.searchedText = this.route.snapshot.params['name'];
    this.populateSearchedMovies();

    this.route.params.subscribe((params: Params) => {
      this.searchedText = params['name'];
    });
  }

  addToWatchList(movieId: string) {
    this.watchService.addWatchList(movieId);
  }

  addToWishList(movieId: string) {
    this.wishService.addWishList(movieId);
  }

  populateSearchedMovies() {
    this.MovieService.getSearchedMovies(this.searchedText).subscribe(
      (response: any) => {
        response['results'].forEach((movieObject: any) => {
          if (movieObject['poster_path'] != null) {
            this.searchedMovies.push({
              id: movieObject['id'],
              posterPath:
                'https://image.tmdb.org/t/p/original' +
                movieObject['poster_path'],
            });
          }
        });
      },
      (error) => {}
    );
  }
}
