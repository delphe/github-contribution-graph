import { Component } from '@angular/core';
import { GitHubApiService } from './githubapi.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'github-contribution-graph';
  fullname: string = "";
  errorMsg: string = "";
  gitHubUsers: any = [];
  rateLimitRemaining: string;
  rateLimitReset: string;

  constructor(private githubapi: GitHubApiService) {}

  getGitHubUsers(fullname) {
    this.githubapi.getUsers(fullname)
      .subscribe(resp => {
        this.rateLimitRemaining = resp.headers.get('X-RateLimit-Remaining');
        this.rateLimitReset = resp.headers.get('X-RateLimit-Remaining'); 
        this.gitHubUsers = { ... resp.body };
        },
        error => {
          console.log(error.message);
          this.errorMsg = error.message;
        }
      );
  }

}
