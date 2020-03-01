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
  gitContributors: any = {};
  gitContributions: any = {};
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
  contributionsLoading: boolean = false;
  userDetailsError: string = "";
  closeResult: string;
  getReposError: string = "";
  gettingContributorsMsg: string = "";
  getContributionsError: string = "";
  successfulCalls: number = 0;
  repoOwnerCommits: number = 0;
  totalRepoContributors: number = 0;
  totalRepoCommits: number = 0;
  timer: any;

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
    this.gitHubUsers = [];
    this.gitHubUser = {};
    this.gitHubRepos = [];
    this.gitContributions = {};
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
    this.clearModalData();
  }

  clearModalData(){
    this.getReposError = "";
    this.errorMsg = "";
    this.successfulCalls = 0;
    this.contributionsLoading = false;
    this.getContributionsError = "";
    this.gettingContributorsMsg = "";
    this.gitContributors = {};
    this.repoOwnerCommits = 0;
    this.totalRepoContributors = 0;
    this.totalRepoCommits = 0;
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
    this.clearModalData();
    this.reposLoading = true;
    this.githubapi.getRepos(username)
        .subscribe(resp => {
            this.getRateLimit(resp);
            this.gitHubRepos = resp.body;
            this.reposLoading = false;
          },
          error => {
            this.getReposError = "An error occurred trying pulling repos for this user!"
            this.handleError(error);
            this.reposLoading = false;
          }
        );
    this.modalService.open(content, { scrollable: true });
  }

  getGitContributors(username){
    this.clearModalData();
    this.contributionsLoading = true;
    if(this.rateLimitRemaining < this.gitHubRepos.length){
      this.getContributionsError = "Obtaining contributions history for " + this.gitHubRepos.length +
        " repositories exceeds your rate limit of " + this.rateLimitRemaining;
      //TODO: provide login option if user has not logged in yet.
      this.contributionsLoading = false;
      return;
    }
    for (let repo of this.gitHubRepos) {
      this.githubapi.getContributors(repo.name, username)
        .subscribe(resp => {
          this.getRateLimit(resp);
          if(resp.status === 200){
            this.successfulCalls++;
            this.gitContributors[repo.name] = resp.body;
            this.consolidateContributions(repo, resp.body);
          }else if(resp.status === 202){
            this.gettingContributorsMsg = "Computing repository statistics is an expensive operation. " +
              "GitHub is compiling these statistics. Give the job a few moments to complete, and then submit the request again. ";
          }
          this.contributionsLoading = false;
        },
        error => {
          console.log(error);
          this.contributionsLoading = false;
          this.getContributionsError = "An error occurred trying to obtain contribution history! "
        }
      );
    }

  }

  consolidateContributions(repo, contributions){    
    for (let contribution of contributions) {
      this.totalRepoContributors++;
      this.totalRepoCommits = this.totalRepoCommits + contribution.total;
      if(contribution?.author?.login == repo?.owner?.login){
        this.repoOwnerCommits = this.repoOwnerCommits + contribution.total;
      }
    }

    //TODO:
      
      //List of repos & URL
      //List of contributors, URL, and commits
  

  }

  handleError(error){
    if(error.error.message){
      this.errorMsg = error.error.message
    }else{
      this.errorMsg = error.message;
    }
    if(error.status === 401 || error.status === 403){
      this.errorMsg = "Authentication Failure! Please try logging in again.";
      this.authenticated = false;
    }
    console.log(error);
    if(error.error.message.includes("rate limit exceeded")){
      this.errorMsg = "API rate limit exceeded!";
      if(!this.authenticated){
        this.errorMsg = this.errorMsg + " Please login to increase your rate limit."
      }
    }
  }

  getRateLimit(resp){
    this.rateLimit = resp.headers.get('X-RateLimit-Limit');
    this.rateLimitRemaining = resp.headers.get('X-RateLimit-Remaining');
    let unix_timestamp = resp.headers.get('X-RateLimit-Reset');
    let unix_timestamp_milliseconds = unix_timestamp * 1000;
    var date = new Date(unix_timestamp_milliseconds);
    clearInterval(this.timer);
    this.rateLimitCountDown(date.getSeconds());
  }

  rateLimitCountDown(seconds){
    var counter = seconds;
    this.timer = setInterval( () => {
      this.rateLimitReset = counter.toString();
      counter--;
      if(counter < 0 ){
        //Counter reached 0. Resetting.
        this.rateLimitRemaining = "";
        this.rateLimitReset = "";
        clearInterval(this.timer);
      }      
    }, 1000);
  }

}
