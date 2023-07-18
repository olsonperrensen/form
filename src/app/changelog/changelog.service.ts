import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Commit } from './commit'; // Assuming you have a Commit model or interface

@Injectable({
  providedIn: 'root'
})
export class ChangelogService {
  private apiUrl = 'https://api.github.com/repos/{owner}/{repo}/commits'; // Replace with your GitHub API URL

  constructor(private http: HttpClient) { }

  getCommits(): Observable<Commit[]> {
    const owner = 'olsonperrensen';
    const repo = 'form';
    const url = this.apiUrl.replace('{owner}', owner).replace('{repo}', repo);
    return this.http.get<Commit[]>(url);
  }
}
