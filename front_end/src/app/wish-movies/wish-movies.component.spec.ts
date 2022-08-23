import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishMoviesComponent } from './wish-movies.component';

describe('WishMoviesComponent', () => {
  let component: WishMoviesComponent;
  let fixture: ComponentFixture<WishMoviesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WishMoviesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WishMoviesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
