import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MessagesService } from './service/messages.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  displayMessages: boolean = false;
  errors$: Observable<string[]>;

  constructor(private messagesService: MessagesService) { }

  ngOnInit(): void {
    this.errors$ = this.messagesService.errors$.pipe(
      tap(() => this.displayMessages = true)
    );
  }

  onClose()
  {
    this.displayMessages = false;
  }

}
