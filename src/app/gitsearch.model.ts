import { GitUser } from './gituser.model';

export interface GitSearch {
  total_count: number;
  git_users: GitUser;
}