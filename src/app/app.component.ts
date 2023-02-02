import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  combineLatest,
  filter,
  forkJoin,
  map,
  debounceTime,
  Observable,
  Subject,
  Subscription,
  switchMap,
} from 'rxjs';
import { MockDataService } from './mock-data.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  searchTermByCharacters = new Subject<string>();
  charactersResults$: Observable<any>;
  planetAndCharactersResults$: Observable<any>;
  isLoading: boolean = false;

  constructor(private mockDataService: MockDataService) {}

  ngOnInit(): void {
    this.initLoadingState();
    this.initCharacterEvents();
  }

  changeCharactersInput(element): void {
    const inputValue: string = element.target.value;
    this.searchTermByCharacters.next(inputValue);
  }

  initCharacterEvents(): void {
    this.charactersResults$ = this.searchTermByCharacters.pipe(
      map((query) => (query ? query.trim() : '')),
      filter((query) => query.length >= 3),
      debounceTime(500),
      switchMap((query: string) => this.mockDataService.getCharacters(query))
    );
  }

  loadCharactersAndPlanet(): void {
    this.planetAndCharactersResults$ = forkJoin(
      this.mockDataService.getPlatents(),
      this.mockDataService.getCharacters()
    ).pipe(map((data: any) => data.flat()));
  }

  initLoadingState(): void {
    combineLatest(
      this.mockDataService.getCharactersLoader(),
      this.mockDataService.getPlanetLoader()
    ).subscribe((elements) => {
      this.isLoading = this.areAllValuesTrue(elements);
    });
  }

  ngOnDestroy(): void {
    // 5.2 Unsubscribe from all subscriptions
    // YOUR CODE STARTS HERE
    // YOUR CODE ENDS HERE
  }

  areAllValuesTrue(elements: boolean[]): boolean {
    return elements.every((el) => el);
  }
}
