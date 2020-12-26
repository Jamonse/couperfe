import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MessagesService } from 'src/app/shared/messages/service/messages.service';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private messagesService: MessagesService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> 
  { // Request interception - adds with credentials
    request = request.clone({withCredentials: true});

    return next.handle(request).pipe(map(event => { // Response interception
      if(event instanceof HttpResponse)
      {
        if(event.status === 403)
        {
          this.router.navigate(['/login']);
          this.messagesService.displayErrors('Session timed out, please reconnect to the system');
        }
      }
      return event;
    }));
  }
}
