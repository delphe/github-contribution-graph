import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Input('parentAuthenticated') authenticated: boolean = false;

  constructor() { }

  @Output() loggedOut = new EventEmitter<boolean>();

  // clearCredentials(){
    
  // }
  
  logout(yes: boolean) {
    console.log("logout!");
    this.loggedOut.emit(yes);
    this.authenticated = false;
    localStorage.clear();
  }

  isCollapsed = true;

  ngOnInit(): void {
  }

}
