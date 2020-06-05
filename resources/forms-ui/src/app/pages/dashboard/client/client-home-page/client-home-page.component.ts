import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Users } from 'src/app/models/users.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService } from 'src/app/services/client/client.service';
import { AnalyticsService } from 'src/app/services/analytics/analytics.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';
import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-client-home-page',
  templateUrl: './client-home-page.component.html',
  styleUrls: ['./client-home-page.component.css']
})
export class ClientHomePageComponent implements OnInit, AfterViewInit {

  user: Users;
  firstname: string;
  isLoading: boolean;
  submitted: boolean;
  pinForm: FormGroup;
  totalNoRejected: string;
  totalNoSubmitted: string;
  totalNoProcessed: string;
  totalNoProcessing: string;
  setPinDialogRef: NgbModalRef;
  @ViewChild('setPin', { static: false }) setPinDialog: TemplateRef<any>;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private analytics: AnalyticsService,
    private clientService: ClientService,
    private localStorage: LocalStorageService
  ) {
    this.setDefaultCount();
    this.user = this.localStorage.getUser();
    this.firstname = this.user.firstname;
  }

  ngOnInit() {
    this.initForm();
    this.getClientAnalytics();
  }

  ngAfterViewInit() {
    this.checkIfUserHasFormPin();
  }

  public get f() {
    return this.pinForm.controls;
  }

  initForm() {
    this.pinForm = this.fb.group({
      pin: ['', [Validators.minLength(4), Validators.required]]
    });
  }

  setDefaultCount() {
    this.totalNoRejected = '0';
    this.totalNoProcessed = '0';
    this.totalNoSubmitted = '0';
    this.totalNoProcessing = '0';
  }

  openFormsData() {
    this.router.navigateByUrl('/client/profile');
  }

  openFormsFilled() {
    this.router.navigateByUrl('/client/forms_filled');
  }

  openFavoriteForms() {
    this.router.navigateByUrl('/client/favorites');
  }

  openDraftForms() {
    this.router.navigateByUrl('/client/forms_filled', { state: { form: 'data' } });
  }

  getClientAnalytics() {
    const user_id = this.user.id.toString();
    this.getRejectedFormsAnalytics(user_id);
    this.getProcessedFormsAnalytics(user_id);
    this.getSubmittedFormsAnalytics(user_id);
    this.getProcessingFormsAnalytics(user_id);
  }

  getRejectedFormsAnalytics(id: string) {
    this.analytics.getClientFormsCount(id, 3).then(
      count => {
        this.totalNoRejected = count;
      }
    );
  }

  getProcessedFormsAnalytics(id: string) {
    this.analytics.getClientFormsCount(id, 2).then(
      count => {
        this.totalNoProcessed = count;
      }
    );
  }

  getProcessingFormsAnalytics(id: string) {
    this.analytics.getClientFormsCount(id, 1).then(
      count => {
        this.totalNoProcessing = count;
      }
    );
  }

  getSubmittedFormsAnalytics(id: string) {
    this.analytics.getClientFormsCount(id, 0).then(
      count => {
        this.totalNoSubmitted = count;
      }
    );
  }

  showPinCreatedSuccess() {
    Swal.fire({
      title: 'Pin Created',
      text: 'Your PIN has been successfully created',
      icon: 'success',
      confirmButtonText: 'Ok, Got It',
    });
  }

  showPinCreationFailed() {
    Swal.fire({
      title: 'Oops!',
      text: 'Sorry! Failed to create your pin. Something went wrong. Please check your internet connection and try again or our servers may be down.',
      icon: 'error',
      confirmButtonColor: 'Hmm, Ok'
    });
  }

  resolveStrCharacters(e: KeyboardEvent) {
    const regExp = new RegExp(/^\d*\.?\d*$/);
    if (!regExp.test(this.f.pin.value)) {
      const value = this.f.pin.value.substring(0, this.f.pin.value.length - 1);
      this.f.pin.setValue(value);
    }
  }

  checkIfUserHasFormPin() {
    const hasPin = window.sessionStorage.getItem('has_pin');
    console.log('______has_pin: ' + hasPin);
    if (hasPin == '0' || hasPin == null) {
      this.setPinDialogRef = this.modalService.open(this.setPinDialog, { centered: true, keyboard: false, backdrop: 'static' });
    }
  }

  createPin() {
    this.submitted = true;
    const pin = this.f.pin.value;
    if (this.pinForm.valid) {
      this.isLoading = true;
      this.clientService.setFormSubmitPin(this.user.id.toString(), pin).then(
        ok => {
          if (ok) {
            this.f.pin.setValue('');
            this.submitted = false;
            this.isLoading = false;
            this.setPinDialogRef.close();
            this.showPinCreatedSuccess();
            sessionStorage.setItem('has_pin', '1');
          }
          else {
            this.submitted = false;
            this.isLoading = false;
            this.setPinDialogRef.close();
            this.showPinCreationFailed();
          }
        },
        err => {
          this.submitted = false;
          this.isLoading = false;
          this.setPinDialogRef.close();
          this.showPinCreationFailed();
        }
      );
    }
  }

}
