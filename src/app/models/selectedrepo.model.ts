import { GitUser } from './gituser.model';

export interface SelectedRepo {
  name: string;
  html_url: string;
  fork: boolean;
  owner: GitUser;
  isSelected: boolean;
}