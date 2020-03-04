import { CountryPickerService, ICountry } from 'ngx-country-picker';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

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
    private countryPickerService: CountryPickerService
  ) {
    this.flag = '';
    this.title = 'Select Country';
    this.selectedCountry = new EventEmitter();
  }

  ngOnInit() {
    this.countryPickerService.getCountries().subscribe(countries => { this.countriesList = countries; });
  }

  selectCountry(country: any) {
    this.flag = country.flag;
    this.title = country.name.common;
    this.selectedCountry.emit(country);
  }

}
