import * as _ from 'lodash';
import { CountryPickerService, ICountry } from 'ngx-country-picker';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';

@Component({
  selector: 'app-forms-country-picker',
  templateUrl: './forms-country-picker.component.html',
  styleUrls: ['./forms-country-picker.component.css']
})
export class FormsCountryPickerComponent implements OnInit {
  flag: string;
  title: string;
  countriesList: Array<ICountry>;
  @Output() selectedCountry: EventEmitter<any>;

  constructor(
    private localStorage: LocalStorageService,
    private countryPickerService: CountryPickerService
  ) {
    this.flag = '';
    this.title = 'Select Country';
    this.selectedCountry = new EventEmitter();
  }

  ngOnInit() {
    this.countryPickerService.getCountries().subscribe(countries => {
      this.countriesList = countries;
      this.autoSelectCountry();
    });
  }

  autoSelectCountry() {
    const user = this.localStorage.getUser();
    _.forEach(this.countriesList, (country) => {
      if (country.cca2 == user.country) {
        this.selectCountry(country);
      }
    });
  }

  selectCountry(country: any) {
    this.flag = country.flag;
    this.title = country.name.common;
    this.selectedCountry.emit(country);
  }

}
