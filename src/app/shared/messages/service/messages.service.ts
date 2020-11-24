import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  private errorSubject = new BehaviorSubject<string[]>(null);

  errors$: Observable<string[]>;

  constructor()
  { // Initialize the errors and ensure that any errors exist
    this.errors$ = this.errorSubject.asObservable().pipe(
      filter(errors => errors && errors.length > 0)
    );
  }

  displayErrors(...errors: string[])
  {
    this.errorSubject.next(errors)
  }
  
}
