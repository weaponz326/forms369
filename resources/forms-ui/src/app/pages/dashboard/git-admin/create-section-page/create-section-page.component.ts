import { Component, OnInit } from '@angular/core';
declare var $: any;
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SectionsService } from 'src/app/services/sections/sections.service';
import { FormBuilderService } from 'src/app/services/form-builder/form-builder.service';

@Component({
  selector: 'app-create-section-page',
  templateUrl: './create-section-page.component.html',
  styleUrls: ['./create-section-page.component.css']
})
export class CreateSectionPageComponent implements OnInit {

  form: FormGroup;
  formBuilder: any;
  created: boolean;
  loading: boolean;
  _loading: boolean;
  submitted: boolean;
  sectionHeading: string;

  constructor(
    private router: Router,
    private _formBuilder: FormBuilder,
    private sectionService: SectionsService,
    private formBuilderService: FormBuilderService
  ) {
  }

  ngOnInit() {
    this.created = false;
    this.buildForm();

    this.formBuilder = $(document.getElementById('fb-editor')).formBuilder({
      controlPosition: 'left',
      scrollToFieldOnAdd: false,
      disabledActionButtons: ['data', 'clear', 'save'],
      inputSets: this.formBuilderService.generateFormFields(),
      disableFields: this.formBuilderService.disableDefaultFormControls()
    });
  }

  buildForm() {
    this.form = this._formBuilder.group({
      heading: ['', Validators.required]
    });
  }

  public get f() {
    return this.form.controls;
  }

  getForm() {
    return this.formBuilder.actions.getData();
  }

  save() {
    this.loading = true;
    const formSection = this.getForm();
    console.log('json: ' + JSON.stringify(formSection));
    const sectionData = {
      form_fields: formSection,
      heading: this.f.heading.value
    };

    this.sectionService.createSection(sectionData).then(
      res => {
        this.loading = false;
        if (_.toLower(res.message) == 'ok') {
          this.created = true;
          this.sectionHeading = sectionData.heading;
        }
        else {
          this.created = false;
        }
      },
      err => {
        this.loading = false;
        this.created = false;
      }
    );
  }

  reset() {
    this.formBuilder.actions.clearFields();
  }

  create() {
    this.submitted = true;
    if (this.form.valid) {
      this.save();
    }
  }

  preview() {
    this.router.navigateByUrl('/git_admin/details/section', { state: { form: this.getForm() } });
  }

  bringBackForm() {
    this.created = !this.created;
  }

  goHome() {
    this.router.navigateByUrl('/git_admin');
  }

}
