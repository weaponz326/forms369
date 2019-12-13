import { Component, OnInit } from '@angular/core';
declare var $: any;
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SectionsService } from 'src/app/services/sections/sections.service';
import { FormBuilderService } from 'src/app/services/form-builder/form-builder.service';

@Component({
  selector: 'app-edit-section-page',
  templateUrl: './edit-section-page.component.html',
  styleUrls: ['./edit-section-page.component.css']
})
export class EditSectionPageComponent implements OnInit {
  form: FormGroup;
  formBuilder: any;
  formSection: any;
  created: boolean;
  loading: boolean;
  submitted: boolean;
  sectionHeading: string;

  constructor(
    private router: Router,
    private _formBuilder: FormBuilder,
    private sectionService: SectionsService,
    private formBuilderService: FormBuilderService
  ) {
    this.formSection = window.history.state.form;
  }

  ngOnInit() {
    this.created = false;
    this.buildForm();

    this.formBuilder = $(document.getElementById('fb-editor')).formBuilder({
      controlPosition: 'left',
      scrollToFieldOnAdd: false,
      defaultFields: this.formSection.form_fields,
      disabledActionButtons: ['data', 'clear', 'save'],
      inputSets: this.formBuilderService.generateFormFields(),
      disableFields: this.formBuilderService.disableDefaultFormControls()
    });
  }

  buildForm() {
    this.form = this._formBuilder.group({
      heading: [this.formSection.heading, Validators.required]
    });
  }

  public get f() {
    return this.form.controls;
  }

  getForm() {
    return this.formBuilder.actions.getData();
  }

  editForm() {
    console.log(this.formBuilder.actions.getData());
    this.loading = true;
    const sectionForm = this.getForm();

    if (sectionForm.length == 0) {
      this.loading = false;
      alert('Form fields cannot be empty');
    }
    else {
      const sectionData = {
        form_fields: sectionForm,
        heading: this.f.heading.value
      };

      this.sectionService.editSection(this.formSection.id, sectionData).then(
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
  }

  reset() {
    this.formBuilder.actions.clearFields();
  }

  edit() {
    this.submitted = true;
    if (this.form.valid) {
      this.editForm();
    }
  }

  preview() {
    this.router.navigateByUrl('/git_admin/details/section', { state: { form: this.formSection }});
  }

  bringBackForm() {
    this.router.navigateByUrl('git_admin/create/section');
  }

  ok() {
    this.router.navigateByUrl('/git_admin/lists/section');
  }

}
