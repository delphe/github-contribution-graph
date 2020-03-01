import { GitUser } from './gituser.model';
import { GitGraph } from './gitgraph.model';

export interface GitContributor {
  total: number;
  author: GitUser;
  weeks: GitGraph;
}