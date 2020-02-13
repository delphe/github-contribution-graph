import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from './../environments/environment';
import { Observable } from 'rxjs';
import { GitSearch } from './gitsearch.model';
import { GitUser } from './gituser.model';

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
  
}
