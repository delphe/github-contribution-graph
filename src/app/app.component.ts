import { Component, OnInit } from '@angular/core';
import { GitHubApiService } from './githubapi.service';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
  
})
export class AppComponent implements OnInit {
  title = 'github-contribution-graph';
  fullname: string = "";
  username: string = "";
  password: string = "";
  errorMsg: string = "";
  gitHubUsers: any = [];
  rateLimit: string;
  rateLimitRemaining: string;
  rateLimitReset: string;
  authenticated: boolean = false;
  currentUser: string = "";
  currentUserAvatarUrl: string = "";
  authenticationError: string = "";
  hideWelcomeMessage: boolean = true;

  constructor(private githubapi: GitHubApiService) {}

  ngOnInit() {
    // this.clearCredentials();
    if (localStorage.getItem('basic_creds')){
      this.authenticated = true;
    }
  }

  FadeOutWelcomeMsg() {
    setTimeout( () => {
      this.hideWelcomeMessage = true;
    }, 4000);
  }

  clearCredentials(){
    localStorage.clear();
  }

  gitHubLogin(username,password){
    this.errorMsg = "";
    this.authenticationError = "";
    const basic_creds = btoa(username + ":"+ password);
    localStorage.setItem('basic_creds', JSON.stringify(basic_creds));
    
    this.githubapi.getUserInfo(username)
      .subscribe(resp => {
          this.getRateLimit(resp);
          this.currentUser = resp.body.name;
          this.currentUserAvatarUrl = resp.body.avatar_url;
          this.authenticated = true;
          this.hideWelcomeMessage = false;
        },
        error => {
          this.authenticationError = "An error occurred attempting to authenticate! " + error.message;
          this.authenticated = false;
        }
      );    
  }

  getGitHubUsers(fullname) {
    this.errorMsg = "";
    this.githubapi.getUsers(fullname)
      .subscribe(resp => {
        this.getRateLimit(resp);
        this.gitHubUsers = { ... resp.body };
        },
        error => {
          this.errorMsg = error.message;
          if(error.status === 401 || error.status === 403){
            this.errorMsg = "Authentication Failure! Please try logging in again.";
            this.authenticated = false;
          }
        }
      );
  }

  getRateLimit(resp){
    //TODO: get current GMT-7 time, subtract from rateLimitReset and start a count-down.
    //  Once the count gets to 0, only display the rateLimit instead of rateLimitRemaining
    this.rateLimit = resp.headers.get('X-RateLimit-Limit');
    this.rateLimitReset = resp.headers.get('X-RateLimit-Remaining'); 
    this.rateLimitRemaining = resp.headers.get('X-RateLimit-Remaining');
  }

}
