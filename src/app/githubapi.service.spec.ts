import { TestBed } from '@angular/core/testing';

import { GitHubApiService } from './githubapi.service';

describe('GithubapiService', () => {
  let service: GitHubApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GitHubApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
