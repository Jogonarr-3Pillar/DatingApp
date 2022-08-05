import { PaginationParams } from './pagination-params';

export class LikesParams extends PaginationParams {
  predicate: string = 'liked';
}
