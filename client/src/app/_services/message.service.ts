import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';
import { Message } from '../_models/message';
import { MessageParams } from '../_models/message-params';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  baseUrl = environment.apiUrl;
  messageParams: MessageParams;

  constructor(private http: HttpClient) {
    this.resetMessageParams();
  }

  getMessageParams() {
    return this.messageParams;
  }

  setMessageParams(messageParams: MessageParams) {
    this.messageParams = messageParams;
  }

  resetMessageParams(): MessageParams {
    this.messageParams = new MessageParams();
    return this.messageParams;
  }

  getMessages() {
    let params = getPaginationHeaders(
      this.messageParams.pageNumber,
      this.messageParams.pageSize
    );
    params = params.append('container', this.messageParams.container);

    return getPaginatedResult<Message[]>(
      this.baseUrl + 'messages',
      params,
      this.http
    );
  }

  getMessageThread(username: string) {
    return this.http.get<Message[]>(
      this.baseUrl + 'messages/thread/' + username
    );
  }

  sendMessage(username: string, content: string) {
    return this.http.post<Message>(this.baseUrl + 'messages', {
      recipientUsername: username,
      content,
    });
  }

  deleteMessage(id: number) {
    return this.http.delete(this.baseUrl + 'messages/' + id);
  }
}
