import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';

@Component({
  selector: 'app-client-home-page',
  templateUrl: './client-home-page.component.html',
  styleUrls: ['./client-home-page.component.css']
})
export class ClientHomePageComponent implements OnInit {

  firstname: string;
  constructor(
    private router: Router,
    private localStorageService: LocalStorageService
  ) {
    this.firstname = this.localStorageService.getUser().firstname;
  }

  ngOnInit() {
  }

  openFormsData() {
    this.router.navigateByUrl('/client/form_data');
  }

  openFormsFilled() {
    this.router.navigateByUrl('/client/forms_filled');
  }

}
