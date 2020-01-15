import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ClientService } from 'src/app/services/client/client.service';

@Component({
  selector: 'app-client-form-link-redirect-page',
  templateUrl: './client-form-link-redirect-page.component.html',
  styleUrls: ['./client-form-link-redirect-page.component.css']
})
export class ClientFormLinkRedirectPageComponent implements OnInit {

  loading: boolean;
  hasError: boolean;

  constructor(
    private router: Router,
    private clientService: ClientService
  ) { }

  ngOnInit() {
    this.getFormDetails();
  }

  getFormDetails() {
    this.loading = true;
    const form_code = sessionStorage.getItem('shared_link');

    this.clientService.findFormsByCode(form_code).then(
      form => {
        console.log('got form');
        this.loading = false;
        // DON'T forget to remove the shared link else
        // every login will redirect user to this form entry which
        // isnt the desired functionality.
        sessionStorage.removeItem('shared_link');
        this.router.navigateByUrl('/client/form_entry', { state: { form: form }});
      },
      err => {
        this.loading = false;
        this.hasError = true;
      }
    );
  }

}
