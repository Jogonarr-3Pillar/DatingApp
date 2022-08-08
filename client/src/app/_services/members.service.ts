import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { Member } from '../_models/member';
import { UserParams } from '../_models/user-params';
import { AccountService } from './account.service';
import { LikesParams } from '../_models/likes-params';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  baseUrl = environment.apiUrl;
  members: Member[] = [];
  memberCache = new Map();
  user: User;
  userParams: UserParams;
  likesParams: LikesParams;

  constructor(
    private http: HttpClient,
    private accountService: AccountService
  ) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: (user) => {
        this.user = user;
        this.resetUserParams();
      },
    });

    this.resetLikesParams();
  }

  getUserParams() {
    return this.userParams;
  }

  setUserParams(userParams: UserParams) {
    this.userParams = userParams;
  }

  resetUserParams(): UserParams {
    this.userParams = new UserParams(this.user);
    return this.userParams;
  }

  getLikesParams() {
    return this.likesParams;
  }

  setLikesParams(likesParams: LikesParams) {
    this.likesParams = likesParams;
  }

  resetLikesParams(): LikesParams {
    this.likesParams = new LikesParams();
    return this.likesParams;
  }

  getMembers() {
    var response = this.memberCache.get(
      Object.values(this.userParams).join('-')
    );
    if (response) {
      return of(response);
    }

    let params = getPaginationHeaders(
      this.userParams.pageNumber,
      this.userParams.pageSize
    );
    params = params.append('minAge', this.userParams.minAge);
    params = params.append('maxAge', this.userParams.maxAge);
    params = params.append('gender', this.userParams.gender);
    params = params.append('orderBy', this.userParams.orderBy);

    return getPaginatedResult<Member[]>(
      this.baseUrl + 'users',
      params,
      this.http
    ).pipe(
      map((response) => {
        this.memberCache.set(
          Object.values(this.userParams).join('-'),
          response
        );
        return response;
      })
    );
  }

  getMember(username: string) {
    const member = [...this.memberCache.values()]
      .reduce((arr, elem) => arr.concat(elem.result), [])
      .find((member: Member) => member.username === username);

    if (member) {
      return of(member);
    }

    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }

  updateMember(member: Member) {
    return this.http.put(this.baseUrl + 'users', member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = member;
      })
    );
  }

  setMainPhoto(photoId: number) {
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photoId, {});
  }

  deletePhoto(photoId: number) {
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId);
  }

  addLike(username: string) {
    return this.http.post(this.baseUrl + 'likes/' + username, {});
  }

  getLikes() {
    let params = getPaginationHeaders(
      this.likesParams.pageNumber,
      this.likesParams.pageSize
    );
    params = params.append('predicate', this.likesParams.predicate);

    return getPaginatedResult<Partial<Member[]>>(
      this.baseUrl + 'likes',
      params,
      this.http
    );
  }
}
