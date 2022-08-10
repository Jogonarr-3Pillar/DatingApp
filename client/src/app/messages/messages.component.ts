import { Component, OnInit } from '@angular/core';

import { Message } from '../_models/message';
import { MessageParams } from '../_models/message-params';
import { Pagination } from '../_models/pagination';
import { ConfirmService } from '../_services/confirm.service';
import { MessageService } from '../_services/message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
})
export class MessagesComponent implements OnInit {
  messages: Message[] = [];
  pagination: Pagination;
  messageParams: MessageParams;
  loading: boolean = false;

  constructor(
    private messageService: MessageService,
    private confirmService: ConfirmService
  ) {
    this.messageParams = this.messageService.getMessageParams();
  }

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages() {
    this.loading = true;
    this.messageService.setMessageParams(this.messageParams);
    this.messageService.getMessages().subscribe({
      next: (response) => {
        this.messages = response.result;
        this.pagination = response.pagination;
        this.loading = false;
      },
    });
  }

  deleteMessage(id: number) {
    this.confirmService
      .confirm('Confirm delete message', 'This cannot be undone')
      .subscribe({
        next: (result) => {
          if (result) {
            this.messageService.deleteMessage(id).subscribe({
              next: () => {
                const messageIndex = this.messages.findIndex(
                  (m) => m.id === id
                );
                this.messages.splice(messageIndex, 1);
              },
            });
          }
        },
      });
  }

  pageChanged(event: any) {
    if (this.messageParams.pageNumber !== event.page) {
      this.messageParams.pageNumber = event.page;
      this.loadMessages();
    }
  }
}
