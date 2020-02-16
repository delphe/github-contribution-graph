import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { GitHubApiService } from './githubapi.service';

describe('GithubapiService', () => {
  let service: GitHubApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    
    service = TestBed.inject(GitHubApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
