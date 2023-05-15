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
    this.http.send(new Object({ message: this.processText(text) }) as Message).subscribe({
      next: (res) => this.response = res,
      error: (err) => this.response = err
    })
  }

  private processText(text: string): string {
    text = this.checkHourPattern(text);
    text = text.replace(/(quel|moi)+/i, '');
    return text;
  }

  private checkHourPattern(text: string): string {
    const pattern = /\d{1,2}\s*h(eures|eure)?/
    return text.replace(pattern, this.parseHour(text))
  }

  private parseHour(text: string): string {
    const hour = text.match(/\d{1,2}/)
    if (hour == null) return text
    else if (parseInt(hour![0]) === 0) return '12 am'
    else if (parseInt(hour![0]) === 12) return '12 pm'
    else if (parseInt(hour![0]) < 12) return `${hour![0]} am`
    else return `${parseInt(hour![0]) - 12} pm`
  }
}
