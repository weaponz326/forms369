import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-client-form-link-page',
  templateUrl: './client-form-link-page.component.html',
  styleUrls: ['./client-form-link-page.component.css']
})
export class ClientFormLinkPageComponent implements OnInit {

  constructor(private router: Router) {
  }

  ngOnInit() {
    this.handleAuthentication();
  }

  handleAuthentication() {
    const url = window.location.href;
    const index = url.lastIndexOf('=') + 1;
    const form_code = url.substring(index);
    console.log('form_code: ' + form_code);
    sessionStorage.setItem('shared_link', form_code);
    this.router.navigateByUrl('login');
  }

}
