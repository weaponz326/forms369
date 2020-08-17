import * as _ from 'lodash';
import Swal from 'sweetalert2';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClientService } from 'src/app/services/client/client.service';

@Component({
  selector: 'app-reset-pin-page',
  templateUrl: './reset-pin-page.component.html',
  styleUrls: ['./reset-pin-page.component.css']
})
export class ResetPinPageComponent implements OnInit {
  form: FormGroup;
  loading: boolean;
  showForm: boolean;
  submitted: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private clientService: ClientService
  ) { }

  ngOnInit() {
    this.showForm = true;
    this.buildForm();
  }

  public get f() {
    return this.form.controls;
  }

  showResetFailedAlert() {
    Swal.fire({
      title: 'Oops!',
      icon: 'error',
      text: 'Sorry!, We couldn\'t reset your pin. Please make sure you have an active internet connection or our serevsr may be down.',
      confirmButtonText: 'Ok'
    });
  }

  showResetSuccessfulAlert() {
    Swal.fire({
      title: 'Success',
      icon: 'success',
      text: 'Pin successfully changed.',
      confirmButtonText: 'Ok',
      onDestroy: () => {
        this.form.reset();
        this.showForm = false;
      }
    });
  }

  buildForm() {
    this.form = this.formBuilder.group({
      pin: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
      cPin: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
    });
  }

  pinsMatch() {
    return this.f.pin.value != this.f.cPin.value ? false : true;
  }

  getClientId() {
    const index = window.location.href.lastIndexOf('=') + 1;
    const id = window.location.href.substr(index);
    return id;
  }

  resolveStrCharacters(e: KeyboardEvent) {
    const regExp = new RegExp(/^\d*\.?\d*$/);
    if (!regExp.test(this.f.pin.value)) {
      const _v = this.f.pin.value.substring(0, this.f.pin.value.length - 1);
      this.f.pin.setValue(_v);
    }
  }

  resolveStrCharacters_1(e: KeyboardEvent) {
    const regExp = new RegExp(/^\d*\.?\d*$/);
    if (!regExp.test(this.f.cPin.value)) {
      const _v = this.f.cPin.value.substring(0, this.f.cPin.value.length - 1);
      this.f.cPin.setValue(_v);
    }
  }

  create() {
    this.submitted = true;
    if (this.form.invalid) {
      this.form.enable();
    }
    else {
      if (this.pinsMatch()) {
        console.log('matches');
        this.form.disable();
        this.loading = true;
        const client_id = this.getClientId();
        this.clientService.setFormSubmitPin(client_id, this.f.pin.value).then(
          res => {
            this.form.enable();
            this.loading = false;
            if (res) {
              sessionStorage.clear();
              this.showResetSuccessfulAlert();
            }
            else {
              this.showResetFailedAlert();
            }
          },
          err => {
            this.form.enable();
            this.loading = false;
          }
        );
      }
      else {
        this.form.enable();
        this.loading = false;
        console.log('doesnt match');
        this.f.cPin.setErrors({ unmatched: true });
      }
    }
  }

}
