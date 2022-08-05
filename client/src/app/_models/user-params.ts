import { PaginationParams } from "./pagination-params";
import { User } from "./user";

export class UserParams extends PaginationParams {
  gender: string;
  minAge: number = 18;
  maxAge: number = 99;
  orderBy: string = 'lastActive';

  constructor(user: User) {
    super();
    this.gender = user.gender === 'female' ? 'male' : 'female';
  }
}
