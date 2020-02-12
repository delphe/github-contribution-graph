import { Component } from '@angular/core';
import { version } from '../../package.json';
import { GitHubApiService } from './githubapi.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'github-contribution-graph';
  version: string = version;
  fullname: string = "";
  errorMsg: string = "";
  gitHubUsers: any = [];


  constructor(private githubapi: GitHubApiService) {}

  getGitHubUsers(fullname) {
    this.githubapi.getUsers(fullname)
      .subscribe(
        (data: {}) => {
          this.gitHubUsers = data;
        },
        error => {
          console.log(error.message);
          this.errorMsg = error.message;
        }
      );
  }

}
