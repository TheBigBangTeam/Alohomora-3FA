import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  constructor(private http: HttpClient) { }

  users: any;

  ngOnInit() {
    this.http.get('/api/admin/users').subscribe(data => {
      this.users = data;
    });
  }

}
