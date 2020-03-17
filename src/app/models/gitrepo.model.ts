import { GitUser } from './gituser.model';

export interface GitRepo {
  name: string;
  html_url: string;
  description: string;
  fork: boolean;
  isSelected: boolean;
  owner: GitUser;
}