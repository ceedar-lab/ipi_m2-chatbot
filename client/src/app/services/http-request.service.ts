import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Message } from '../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class HttpRequestService {

  constructor(
    private http: HttpClient
  ) { }

  send(message: Message) {
    return this.http.post(`${environment.serverUrl}`, message, { responseType: 'text' });
  }
}
