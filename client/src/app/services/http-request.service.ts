import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Message } from '../models/message.model';
import { Response } from '../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class HttpRequestService {

  constructor(
    private http: HttpClient
  ) { }

  send(message: Message) {
    return this.http.post<Response>(`${environment.serverUrl}`, message);
  }
}
