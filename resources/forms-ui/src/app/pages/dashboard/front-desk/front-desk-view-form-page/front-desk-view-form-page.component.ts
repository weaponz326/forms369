import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
declare var $: any;
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { Users } from 'src/app/models/users.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FrontDeskService } from 'src/app/services/front-desk/front-desk.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';

@Component({
  selector: 'app-front-desk-view-form-page',
  templateUrl: './front-desk-view-form-page.component.html',
  styleUrls: ['./front-desk-view-form-page.component.css']
})
export class FrontDeskViewFormPageComponent implements OnInit {

  form: any;
  user: Users;
  action: string;
  formName: string;
  loading: boolean;
  formInstance: any;
  formRenderer: any;
  hasError: boolean;
  rejected: boolean;
  completed: boolean;
  submitted: boolean;
  isProcessed: boolean;
  isProcessing: boolean;
  lastProcessed: string;
  confirmDialogRef: NgbModalRef;
  @ViewChild('confirm', { static: false }) confirmDialog: TemplateRef<any>;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private localStorage: LocalStorageService,
    private frontDeskService: FrontDeskService
  ) {
    this.form = window.history.state.form;
    this.formName = this.form.form_name;
    this.user = this.localStorage.getUser();
    console.log('form: ' + JSON.stringify(this.form));
  }

  ngOnInit() {
    this.renderForm();
  }

  ok() {
    this.router.navigateByUrl('front_desk');
  }

  renderForm() {
    const formData = this.form.form_fields;
    this.formRenderer = document.getElementById('form-render');
    const renderOptions = { formData, dataType: 'json '};
    this.formInstance = $(this.formRenderer).formRender(renderOptions);

    this.setFormData(formData);
  }

  setFormData(data: any) {
    if (this.form.form_status == 2) {
      this.isProcessed = true;
      this.lastProcessed = this.form.last_processed;
    }
    else if (this.form.form_status == 1) {
      this.isProcessing = true;
      this.lastProcessed = this.form.last_processed;
    }
    else {
      const client_data = this.form.client_submitted_details;
      this.frontDeskService.setFormWithClientData(data, client_data);
    }
  }

  complete() {
    this.action = 'complete';
    this.modalService.open(this.confirmDialog, { centered: true }).result.then(
      result => {
        if (result == 'yes') {
          this.loading = true;
          this.frontDeskService.completeForm(this.form.submission_code, this.form.client_submitted_details).then(
            res => {
              const response = res as any;
              if (_.toLower(response.message) == 'ok') {
                this.loading = false;
                this.completed = true;
              }
              else {
                this.loading = false;
                this.completed = false;
              }
            },
            err => {
              this.hasError = true;
              this.loading = false;
              this.completed = false;
            }
          );
        }
      }
    );
  }

  process() {
    this.action = 'process';
    this.modalService.open(this.confirmDialog, { centered: true }).result.then(
      result => {
        if (result == 'yes') {
          this.loading = true;
          this.frontDeskService.processForm(this.form.submission_code, this.form.client_submitted_details).then(
            res => {
              const response = res as any;
              if (_.toLower(response.message) == 'ok') {
                this.loading = false;
                this.submitted = true;
              }
              else {
                this.loading = false;
                this.submitted = false;
              }
            },
            err => {
              this.loading = false;
              this.submitted = false;
              this.hasError = true;
            }
          );
        }
      }
    );
  }

  reject() {
    this.action = 'reject';
    this.modalService.open(this.confirmDialog, { centered: true }).result.then(
      result => {
        if (result == 'yes') {
          this.loading = true;
          this.frontDeskService.unprocessForm(this.form.submission_code, this.form.client_submitted_details).then(
            res => {
              const response = res as any;
              if (_.toLower(response.message) == 'ok') {
                this.loading = false;
                this.rejected = true;
              }
              else {
                this.loading = false;
                this.rejected = false;
              }
            },
            err => {
              this.loading = false;
              this.hasError = true;
              this.rejected = false;
            }
          );
        }
      }
    );
  }

}
