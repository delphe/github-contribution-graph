import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GitHubApiService } from './githubapi.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
  styles: [`
    .dark-modal .modal-content {
      background-color: #292b2c;
      color: white;
    }
    .dark-modal .close {
      color: white;
    }
    .light-blue-backdrop {
      background-color: #5cb3fd;
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'github-contribution-graph';
  fullname: string = "";
  username: string = "";
  password: string = "";
  errorMsg: string = "";
  gitHubUsers: any = [];
  gitHubUser: any = {};
  gitHubRepos: any = [];
  rateLimit: string = "";
  rateLimitRemaining: string = "";
  rateLimitReset: string = "";
  authenticated: boolean = false;
  currentUser: string = "";
  currentUserAvatarUrl: string = "";
  authenticationError: string = "";
  hideWelcomeMessage: boolean = true;
  selectedUser: number = -1;
  searchButtonLoading: boolean = false;
  loginButtonLoading: boolean = false;
  userDetailsloading: boolean = false;
  reposLoading: boolean = false;
  userDetailsError: string = "";
  closeResult: string;
  reReposError: string = "";

  constructor(private githubapi: GitHubApiService, private modalService: NgbModal) {}
  
  ngOnInit() {
    if (localStorage.getItem('basic_creds')){
      this.authenticated = true;
    }
  }

  onLogout(yes: boolean) {
    this.authenticated = false;
  }

  FadeOutWelcomeMsg() {
    setTimeout( () => {
      this.hideWelcomeMessage = true;
    }, 4000);
  }

  clear(){
    this.fullname =  "";
    this.username = "";
    this.password = "";
    this.errorMsg = "";
    this.gitHubUsers = [];
    this.gitHubUser = {};
    this.gitHubRepos = [];
    this.rateLimit = "";
    this.rateLimitRemaining = "";
    this.rateLimitReset = "";
    this.authenticationError = "";
    this.hideWelcomeMessage = true;
    this.selectedUser = -1;
    this.userDetailsloading = false
    this.userDetailsError = "";
    this.searchButtonLoading = false;
    this.loginButtonLoading = false;
    this.reposLoading = false;
    this.reReposError = "";
  }

  gitHubLogin(username,password){
    this.clear();
    this.loginButtonLoading = true;
    localStorage.clear();
    this.githubapi.getUserInfo(username)
      .subscribe(resp => {
          this.getRateLimit(resp);
          this.currentUser = resp.body.name;
          this.currentUserAvatarUrl = resp.body.avatar_url;
          this.authenticated = true;
          this.hideWelcomeMessage = false;
          const basic_creds = btoa(username + ":"+ password);
          localStorage.setItem('basic_creds', JSON.stringify(basic_creds));
          this.loginButtonLoading = false;
        },
        error => {
          this.authenticationError = "An error occurred attempting to authenticate! " + error.message;
          this.authenticated = false;
          this.loginButtonLoading = false;
        }
      );    
  }

  getGitHubUsers(fullname) {
    this.clear();
    this.searchButtonLoading = true;
    this.githubapi.getUsers(fullname)
      .subscribe(resp => {
        this.getRateLimit(resp);
        this.gitHubUsers = { ... resp.body };
        this.searchButtonLoading = false;
        },
        error => {
          this.handleError(error);
          this.searchButtonLoading = false;
        }
      );
  }

  getGitHubUserInfo(username, selectedItem){
    if(selectedItem == this.selectedUser){
      this.selectedUser = -1;
    }else{
      this.userDetailsloading = true;
      this.selectedUser = selectedItem;
      this.githubapi.getUserInfo(username)
        .subscribe(resp => {
            this.getRateLimit(resp);
            this.gitHubUser = resp.body;
            this.userDetailsloading = false;
          },
          error => {
            this.userDetailsError = "An error occurred trying to find this user!"
            this.handleError(error);
            this.userDetailsloading = false;
          }
        );
    }
  }

  getGitRepos(content, username){
    this.reposLoading = true;
    this.reReposError = "";
    this.errorMsg = "";
    this.githubapi.getRepos(username)
        .subscribe(resp => {
            this.getRateLimit(resp);
            this.gitHubRepos = resp.body;
            this.reposLoading = false;
          },
          error => {
            this.reReposError = "An error occurred trying pulling repos for this user!"
            this.handleError(error);
            this.reposLoading = false;
          }
        );
    this.modalService.open(content, { scrollable: true });
  }

  handleError(error){
    this.errorMsg = error.message;
    if(error.status === 401 || error.status === 403){
      this.errorMsg = "Authentication Failure! Please try logging in again.";
      this.authenticated = false;
    }
  }

  getRateLimit(resp){
    //TODO: get current GMT-7 time, subtract from rateLimitReset and start a count-down.
    //  Once the count gets to 0, only display the rateLimit instead of rateLimitRemaining
    this.rateLimit = resp.headers.get('X-RateLimit-Limit');
    this.rateLimitReset = resp.headers.get('X-RateLimit-Remaining'); 
    this.rateLimitRemaining = resp.headers.get('X-RateLimit-Remaining');
  }

}
