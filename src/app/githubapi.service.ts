import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from './../environments/environment';
import { Observable } from 'rxjs';
import { GitSearch } from './models/gitsearch.model';
import { GitUser } from './models/gituser.model';
import { GitRepos } from './models/gitrepos.model';
import { GitContributors } from './models/gitcontributors.model'

const localUrl = environment.gitHubApiUrl;

@Injectable({
  providedIn: 'root'
})
export class GitHubApiService {

  constructor(private http: HttpClient) { }

  getUsers(fullname): Observable<HttpResponse<GitSearch>> {
    return this.http.get<GitSearch>(
      localUrl + "/search/users?q=fullname:" + fullname,{ observe: 'response' });
  }

  getUserInfo(username){
    return this.http.get<GitUser>(
      localUrl + "/users/" + username,{ observe: 'response' });
  }

  getRepos(username){
    return this.http.get<GitRepos>(
      localUrl + "/users/" + username + "/repos",{ observe: 'response' });
  }

  getReposFromLink(url){
    return this.http.get<GitRepos>(
      url,{ observe: 'response' });
  }

  getContributors(repo,username){
    return this.http.get<GitContributors>(
      localUrl + "/repos/" + username + "/" + repo + "/stats/contributors",{ observe: 'response' });
  }
  
}
