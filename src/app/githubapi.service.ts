import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../environments/environment';

const localUrl = environment.gitHubApiUrl;

@Injectable({
  providedIn: 'root'
})
export class GitHubApiService {

  constructor(private http: HttpClient) { }

  getUsers(fullname) {
    return this.http.get(localUrl + "/search/users?q=fullname:" + fullname);
  }

  
}
