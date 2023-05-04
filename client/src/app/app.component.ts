import { Component, OnInit } from '@angular/core';
import { HttpRequestService } from './services/http-request.service';
import { Message } from './models/message.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'client';

  response: string = '';

  constructor(
    private http: HttpRequestService
  ) {}

  ngOnInit(): void {}

  send(text: string) {
    this.http.send(new Object({ message: text }) as Message).subscribe({
      next: (res) => this.response = res,
      error: (err) => this.response = err
    })
  }
}
