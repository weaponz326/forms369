import * as _ from 'lodash';
import Swal from 'sweetalert2';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CountryPickerService, ICountry } from 'ngx-country-picker';
import { ClientService } from 'src/app/services/client/client.service';

@Component({
  selector: 'app-client-suggest-merchant-page',
  templateUrl: './client-suggest-merchant-page.component.html',
  styleUrls: ['./client-suggest-merchant-page.component.css']
})
export class ClientSuggestMerchantPageComponent implements OnInit {

  form: FormGroup;
  loading: boolean;
  submitted: boolean;
  countriesList: Array<ICountry>;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private countryPickerService: CountryPickerService
  ) {
    this.countriesList = [];
  }

  ngOnInit() {
    this.countryPickerService.getCountries().subscribe(countries => { this.countriesList = countries; });
    this.initForm();
  }

  public get f() {
    return this.form.controls;
  }

  public get country() {
    return this.form.get('country');
  }

  onCountrySelect(e: any) {
    this.country.setValue(e.target.value, {
      onlySelf: true
    });
  }

  initForm() {
    this.form = this.fb.group({
      merchant: ['', Validators.required],
      country: ['', Validators.required]
    });
  }

  showSuccessAlert() {
    Swal.fire({
      title: 'Success',
      text: 'Thank you for suggesting a merchant.',
      icon: 'success',
      confirmButtonText: 'Ok',
    });
  }

  showErrorAlert() {
    Swal.fire({
      title: 'Oops! Failed',
      text: 'An error occurred. Please try again!',
      icon: 'error',
      confirmButtonText: 'Ok',
    });
  }

  submit() {
    this.loading = true;
    this.submitted = true;
    if (this.form.valid) {
      this.form.disable();
      const country = this.f.country.value;
      const merchant = this.f.merchant.value;
      this.clientService.suggestMerchant(country, merchant).then(
        res => {
          this.reset();
          this.form.enable();
          this.loading = false;
          this.submitted = false;
          this.showSuccessAlert();
        },
        err => {
          this.form.enable();
          this.loading = false;
          this.showErrorAlert();
        }
      );
    }
    else {
      this.loading = false;
      this.form.enable();
    }
  }

  reset() {
    this.f.merchant.setValue('');
    this.f.country.setValue('');
  }

}
