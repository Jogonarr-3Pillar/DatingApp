import { Component, OnInit } from '@angular/core';

import { MembersService } from '../_services/members.service';
import { LikesParams } from '../_models/likes-params';
import { Member } from '../_models/member';
import { Pagination } from '../_models/pagination';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css'],
})
export class ListsComponent implements OnInit {
  members: Partial<Member[]>;
  pagination: Pagination;
  likesParams: LikesParams;
  predicate = 'liked';

  constructor(private membersService: MembersService) {
    this.likesParams = this.membersService.getLikesParams();
  }

  ngOnInit(): void {
    this.loadLikes();
  }

  loadLikes() {
    this.membersService.setLikesParams(this.likesParams);
    this.membersService.getLikes().subscribe({
      next: (response) => {
        this.members = response.result;
        this.pagination = response.pagination;
      },
    });
  }

  pageChanged(event: any) {
    if (this.likesParams.pageNumber !== event.page) {
      this.likesParams.pageNumber = event.page;
      this.loadLikes();
    }
  }
}
