import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { concatMap, finalize, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private loadingSubject = new BehaviorSubject<boolean>(false);

  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  constructor() { }

  displayLoadingUntil<T>(observable$: Observable<T>): Observable<T>
  {
    return of(null)
      .pipe(
        tap(() => this.displayLoading()),
        concatMap(() => observable$),
        finalize(() => this.hideLoading())
      );
  }

  displayLoading()
  {
    this.loadingSubject.next(true);
  }

  hideLoading()
  {
    this.loadingSubject.next(false);
  }

}
