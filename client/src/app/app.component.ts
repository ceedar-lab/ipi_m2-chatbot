import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { HttpRequestService } from './services/http-request.service';
import { Message } from './models/message.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('text') text!: ElementRef;

  title = 'client';

  lastQuestion: string = '';
  response: string = '';

  constructor(
    private http: HttpRequestService
  ) {}

  ngOnInit(): void {}

  @HostListener('document:keydown.enter')
  send() {
    this.lastQuestion = this.text.nativeElement.value;
    this.http.send(new Object({ message: this.processText(this.text.nativeElement.value) }) as Message).subscribe({
      next: (res) => this.response = res,
      error: (err) => this.response = err
    })
    // this.text.nativeElement.value = '';
  }

  private processText(text: string): string {
    text = this.checkHourPattern(text);
    text = text.replace(/(quel|moi)+/i, ''); // Sinon il cherche les villes Quel et Moi
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
