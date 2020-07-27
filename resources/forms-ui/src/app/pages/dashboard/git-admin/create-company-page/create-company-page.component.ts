import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { startWith, map } from 'rxjs/operators';
import { Merchants } from 'src/app/models/merchants.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CountryPickerService, ICountry } from 'ngx-country-picker';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CompanyService } from 'src/app/services/company/company.service';
import { SectorsService } from 'src/app/services/sectors/sectors.service';
import { DateTimeService } from 'src/app/services/date-time/date-time.service';
import { ExecutiveService } from 'src/app/services/executive/executive.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';

@Component({
  selector: 'app-create-company-page',
  templateUrl: './create-company-page.component.html',
  styleUrls: ['./create-company-page.component.css'],
  providers: [CompanyService, ExecutiveService, LocalStorageService]
})
export class CreateCompanyPageComponent implements OnInit {

  form: FormGroup;
  hasLogo: boolean;
  created: boolean;
  loading: boolean;
  _loading: boolean;
  logoImage: string;
  submitted: boolean;
  sectorList: Array<any>;
  companyAdminsList: Array<any>;
  countriesList: Array<ICountry>;
  superExecutivesList: Array<any>;
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
    private sectorService: SectorsService,
    private companyService: CompanyService,
    private dateTimeService: DateTimeService,
    private executiveService: ExecutiveService,
    private localStorageService: LocalStorageService,
    private countryPickerService: CountryPickerService
  ) {
    this.sectorList = [];
    this.countriesList = [];
    this.companyAdminsList = [];
    this.superExecutivesList = [];
    this.executivesEmailList = [];
    this.companyAdminEmailList = [];

    this.initializeView();
  }

  ngOnInit() {
    this.countryPickerService.getCountries().subscribe(countries => { this.countriesList = countries; });
    this.buildForm();
  }

  initializeView() {
    this._loading = true;
    this.getSectors();
    this.getSuperExecutive();
    this.getCompanyAdmins();
  }

  public get f() {
    return this.form.controls;
  }

  public get sector() {
    return this.form.get('sector');
  }

  public get country() {
    return this.form.get('country');
  }

  public get print_status() {
    return this.form.get('allowPrint');
  }

  public get enable_qms() {
    return this.form.get('enableQms');
  }

  togglePrint() {
    this.f.allowPrint.value == '1'
      ? this.f.allowPrint.setValue('0')
      : this.f.allowPrint.setValue('1');
  }

  filter(collection: Array<any>, value: string) {
    console.log('filtering');
    const filterValue = value.toLowerCase();
    console.log('filter: ' + JSON.stringify(collection));
    return collection.filter(item => item.email.toLowerCase().includes(filterValue));
  }

  buildForm() {
    this.form = this.formBuilder.group({
      address: [''],
      enableQms: [''],
      smallLogoName: [''],
      smallLogoFile: [''],
      name: ['', Validators.required],
      logo: ['', Validators.required],
      sector: ['', Validators.required],
      country: ['', Validators.required],
      nickname: ['', Validators.required],
      colorCode: ['', Validators.required],
      allowPrint: ['', Validators.required],
      companyAdmin: ['', Validators.required],
      superExecutive: ['', Validators.required]
    });
  }

  onCountrySelect(e: any) {
    this.country.setValue(e.target.value, {
      onlySelf: true
    });
  }

  onPrintSelect(e: any) {
    this.print_status.setValue(e.target.value, {
      onlySelf: true
    });
  }

  onSectorSelect(e: any) {
    this.sector.setValue(e.target.value, {
      onlySelf: true
    });
  }

  onQmsSelect(e: any) {
    this.enable_qms.setValue(e.target.value, {
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

  getSectors() {
    this.sectorService.getSectors().then(
      sectors => {
        if (sectors.length > 0) {
          _.forEach(sectors, (sector) => {
            this.sectorList.push(sector);
          });
        }
      },
      error => { }
    );
  }

  getFormData() {
    let company_admin_id = 0;
    let super_executive_id = 0;
    const created_at = this.dateTimeService.getToday(true);
    const user_id = this.localStorageService.getUser().id.toString();
    const smallLogo = _.isNull(this.f.smallLogoFile.value) ? '' : this.f.smallLogoFile.value;

    _.forEach(this.superExecutivesList, (executive) => {
      if (executive.email == this.f.superExecutive.value) {
        console.log('cccccccccc: ' + executive.id);
        super_executive_id = executive.id;
      }
    });
    _.forEach(this.companyAdminsList, (admin) => {
      if (admin.email == this.f.companyAdmin.value) {
        company_admin_id = admin.id;
      }
    });

    const merchant = new Merchants(
      this.f.name.value,
      this.f.country.value,
      smallLogo,
      super_executive_id,
      user_id,
      created_at,
      company_admin_id,
      this.f.allowPrint.value,
      _.toNumber(this.f.sector.value),
      this.f.colorCode.value,
      this.f.address.value,
      this.f.nickname.value,
      this.f.enableQms.value
    );

    return merchant;
  }

  containErrors(data: Merchants) {
    if (data.super_id == 0) {
      this.f.superExecutive.setErrors({ null: true });
      return true;
    }

    if (data.admin_id == 0) {
      this.f.companyAdmin.setErrors({ null: true });
      return true;
    }

    return false;
  }

  getSuperExecutive() {
    this.executiveService.getSuperExecutives().then(
      res => {
        const executives = res as any;
        if (executives.length != 0) {
          _.forEach(executives, (executive) => {
            this.superExecutivesList.push(executive);
            this.executivesEmailList.push(executive.email);
          });
          this._loading = false;
          this.filteredExecutivesList = this.f.superExecutive.valueChanges.pipe(
            startWith('-'),
            map(value => this.filter(this.superExecutivesList, value))
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
    this.companyService.getAllCompanyAdmins().then(
      res => {
        const admins = res as any;
        if (admins.length != 0) {
          _.forEach(admins, (admin) => {
            this.companyAdminsList.push(admin);
            this.companyAdminEmailList.push(admin.email);
          });
          this.filteredAdminsList = this.f.companyAdmin.valueChanges.pipe(
            startWith('-'),
            map(value => this.filter(this.companyAdminsList, value))
          );
          console.log('filteredList: ' + JSON.stringify(this.filteredAdminsList));
        }
        else {}
      },
      err => {}
    );
  }

  create() {
    this.loading = true;
    this.submitted = true;
    if (this.form.invalid) {
      console.log('form was invalid');
      this.form.enable();
      this.loading = false;
      return;
    }
    else {
      const merchant = this.getFormData();
      if (!this.containErrors(merchant)) {
        this.form.disable();
        const logoFile = this.logoFile.nativeElement as HTMLInputElement;
        this.companyService.createCompany(merchant, logoFile.files[0]).then(
          res => {
            this.form.enable();
            this.loading = false;
            const response = res as any;
            if (_.toLower(response.message) == 'ok') {
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
      else {
        this.loading = false;
      }
    }
  }

  ok() {
    this.router.navigateByUrl('/git_admin/lists/company');
  }

  cancel() {
    this.ok();
  }

  bringBackForm() {
    this.form.reset();
    this.logoImage = '';
    this.hasLogo = false;
    this.submitted = false;
    this.created = !this.created;
    this.countryPickerService.getCountries().subscribe(countries => {
      this.countriesList = countries;
    });
  }

}
