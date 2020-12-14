import * as _ from 'lodash';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Users } from 'src/app/models/users.model';
import { ClientService } from 'src/app/services/client/client.service';
import { EndpointService } from 'src/app/services/endpoint/endpoint.service';
import { DateTimeService } from 'src/app/services/date-time/date-time.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';

@Component({
  selector: 'app-client-favorite-forms-page',
  templateUrl: './client-favorite-forms-page.component.html',
  styleUrls: ['./client-favorite-forms-page.component.css']
})
export class ClientFavoriteFormsPageComponent implements OnInit {

  user: Users;
  hasData: boolean;
  loading: boolean;
  hasError: boolean;
  favoritesCollection: Array<any>;
  allFavoritesCollection: Array<any>;

  constructor(
    private router: Router,
    private clientService: ClientService,
    private dateService: DateTimeService,
    private endpointService: EndpointService,
    private localStorageService: LocalStorageService
  ) {
    this.favoritesCollection = [];
    this.allFavoritesCollection = [];
    this.user = this.localStorageService.getUser();
    this.getAllFavorites();
  }

  ngOnInit() {
  }

  openFormEntry(e: Event, form: any) {
    e.stopPropagation();
    this.router.navigateByUrl('/client/fill_form', { state: { form: form } });
  }

  pickForm() {
    this.router.navigateByUrl('/client/form_merchant');
  }

  getAllFavorites() {
    this.loading = true;
    this.clientService.getAllFavoritesForms().then(
      forms => {
        if (forms.length > 0) {
          this.hasData = true;
          this.loading = false;
          _.forEach(forms, (form) => {
            form.logo = this.endpointService.storageHost + form.logo;
            this.favoritesCollection.push(form);
          });
          this.allFavoritesCollection = this.favoritesCollection;
        }
        else {
          this.hasData = false;
          this.loading = false;
        }
      },
      err => {
        this.hasError = true;
        this.loading = false;
      }
    );
  }

  retry() {
    this.getAllFavorites();
  }

}
