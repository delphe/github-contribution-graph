import { GitUsers } from './gitusers.model';

export interface GitSearch {
  total_count: number;
  git_users: GitUsers;
}