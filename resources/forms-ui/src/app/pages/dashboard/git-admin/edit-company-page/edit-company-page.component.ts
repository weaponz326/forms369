import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { startWith, map } from 'rxjs/operators';
import { Merchants } from 'src/app/models/merchants.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CountryPickerService, ICountry } from 'ngx-country-picker';
import { CompanyService } from 'src/app/services/company/company.service';
import { ExecutiveService } from 'src/app/services/executive/executive.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';
import { DateTimeService } from 'src/app/services/date-time/date-time.service';

@Component({
  selector: 'app-edit-company-page',
  templateUrl: './edit-company-page.component.html',
  styleUrls: ['./edit-company-page.component.css'],
  providers: [CompanyService, ExecutiveService, LocalStorageService]
})
export class EditCompanyPageComponent implements OnInit {

  form: FormGroup;
  hasLogo: boolean;
  canPrint: boolean;
  created: boolean;
  loading: boolean;
  _loading: boolean;
  logoImage: string;
  submitted: boolean;
  navigatedData: any;
  companyAdminsList: Array<any>;
  superExecutivesList: Array<any>;
  countriesList: Array<ICountry>;
  executivesEmailList: Array<any>;
  companyAdminEmailList: Array<string>;
  filteredAdminsList: Observable<string[]>;
  filteredExecutivesList: Observable<string[]>;

  @ViewChild('logoFile', { static: false }) logoFile: ElementRef;
  @ViewChild('smallLogo', { static: false }) smallLogo: ElementRef;
  @ViewChild('selectedLogo', { static: false }) selectedLogo: ElementRef;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private companyService: CompanyService,
    private dateTimeService: DateTimeService,
    private executiveService: ExecutiveService,
    private localService: LocalStorageService,
    private countryPickerService: CountryPickerService
  ) {
    this.navigatedData = window.history.state.company;
    console.log(this.navigatedData);
    this.countriesList = [];
    this.companyAdminsList = [];
    this.superExecutivesList = [];
    this.executivesEmailList = [];
    this.companyAdminEmailList = [];
    if (!_.isUndefined(this.navigatedData.can_print)) {
      this.canPrint = this.navigatedData.can_print == 1 ? true : false;
    }

    this.initializeView();
  }

  ngOnInit() {
    this.countryPickerService.getCountries().subscribe(countries => { this.countriesList = countries; });
    this.buildForm();
  }

  initializeView() {
    this._loading = true;
    this.getSuperExecutive();
    this.getCompanyAdmins();
  }

  public get f() {
    return this.form.controls;
  }

  public get country() {
    return this.form.get('country');
  }

  togglePrint() {
    this.f.allowPrint.value == '1'
      ? this.f.allowPrint.setValue('0')
      : this.f.allowPrint.setValue('1');
  }

  filter(collection: Array<string>, value: string) {
    console.log('filtering');
    const filterValue = value.toLowerCase();
    return collection.filter(item => item.toLowerCase().includes(filterValue));
  }

  buildForm() {
    this.logoImage = this.navigatedData.logo;
    this.form = this.formBuilder.group({
      smallLogoName: [this.navigatedData.small_logo],
      smallLogoFile: [''],
      logo: [''],
      allowPrint: ['0', Validators.required],
      country: [this.navigatedData.country, Validators.required],
      name: [this.navigatedData.merchant_name, Validators.required],
      companyAdmin: ['', Validators.required],
      superExecutive: ['', Validators.required]
    });
  }

  onCountrySelect(e: any) {
    this.country.setValue(e.target.value, {
      onlySelf: true
    });
  }

  showFilePicker() {
    const element = this.logoFile.nativeElement as HTMLInputElement;
    element.click();
  }

  showFilePicker_1() {
    const element = this.smallLogo.nativeElement as HTMLInputElement;
    element.click();
  }

  inputFileChanged(ev: Event) {
    const logoFile = this.logoFile.nativeElement as HTMLInputElement;
    const reader = new FileReader();
    reader.onload = () => {
      this.logoImage = reader.result.toString();
    };
    reader.readAsDataURL(logoFile.files[0]);
    this.hasLogo = true;
  }

  inputFileChanged_1(ev: Event) {
    const smallLogoFile = this.smallLogo.nativeElement as HTMLInputElement;
    this.f.smallLogoName.setValue(smallLogoFile.files[0].name);
  }

  getFormData() {
    let super_admin_id = 0;
    let super_executive_id = 0;
    const created_at = this.dateTimeService.getToday(true);
    const user_id = this.localService.getUser().id.toString();
    _.forEach(this.superExecutivesList, (executive) => {
      if (executive.email == this.f.superExecutive.value) {
        super_executive_id = executive.id;
      }
    });
    _.forEach(this.companyAdminsList, (admin) => {
      if (admin.email == this.f.companyAdmin.value) {
        super_admin_id = admin.id;
      }
    });

    const logo = this.navigatedData.logo.substring(this.navigatedData.logo.lastIndexOf('/') + 1);
    console.log('logo filename: ' + logo);
    const merchant = new Merchants(
      this.f.name.value,
      this.f.country.value,
      '',
      super_executive_id,
      '',
      user_id,
      super_admin_id,
      this.f.allowPrint.value,
      created_at,
      null,
      logo
    );
    return merchant;
  }

  getSuperExecutive() {
    this.executiveService.getSuperExecutives().then(
      res => {
        const executives = res as any;
        if (executives.length != 0) {
          _.forEach(executives, (executive) => {
            this.superExecutivesList.push(executive);
            this.executivesEmailList.push(executive.email);
            if (executive.full_name == this.navigatedData.super_executive_name) {
              this.f.superExecutive.setValue(executive.email);
            }
          });
          this._loading = false;
          this.filteredExecutivesList = this.f.superExecutive.valueChanges.pipe(
            startWith('-'),
            map(value => this.filter(this.executivesEmailList, value))
          );
        }
        else {
          this._loading = false;
        }
      },
      err => {
        this._loading = false;
      }
    );
  }

  getCompanyAdmins() {
    this.companyService.getCompanyAdmins().then(
      res => {
        const admins = res as any;
        if (admins.length != 0) {
          _.forEach(admins, (admin) => {
            this.companyAdminsList.push(admin);
            this.companyAdminEmailList.push(admin.email);
            if (admin.full_name == this.navigatedData.company_admin_name) {
              this.f.companyAdmin.setValue(admin.email);
              console.log('has set company admin', admin.email);
            }
          });
          this.filteredAdminsList = this.f.companyAdmin.valueChanges.pipe(
            startWith('-'),
            map(value => this.filter(this.companyAdminEmailList, value))
          );
        }
        else {}
      },
      err => {}
    );
  }

  editWithLogo() {
    const merchant = this.getFormData();
    const logoFile = this.logoFile.nativeElement as HTMLInputElement;
    this.companyService.editCompany(this.navigatedData.id, merchant, logoFile.files[0]).then(
      res => {
        this.form.enable();
        this.loading = false;
        if (res) {
          this.created = true;
        }
        else {
          this.created = false;
        }
      },
      err => {
        this.form.enable();
        this.loading = false;
      }
    );
  }

  editWithNoLogo() {
    const merchant = this.getFormData();
    this.companyService.editCompany(this.navigatedData.id, merchant).then(
      res => {
        this.form.enable();
        this.loading = false;
        if (res) {
          this.created = true;
        }
        else {
          this.created = false;
        }
      },
      err => {
        this.form.enable();
        this.loading = false;
      }
    );
  }

  edit() {
    this.loading = true;
    this.submitted = true;
    if (this.form.invalid) {
      this.form.enable();
      this.loading = false;
      return;
    }
    else {
      this.form.disable();
      const logoFile = this.logoFile.nativeElement as HTMLInputElement;
      logoFile.files[0] == null ? this.editWithNoLogo() : this.editWithLogo();
    }
  }

  ok() {
    this.router.navigateByUrl('/git_admin/lists/company');
  }

  view() {
    this.router.navigateByUrl('git_admin/lists/company');
  }

}
