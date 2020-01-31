import * as _ from 'lodash';
import Swal from 'sweetalert2';
import { Component, OnInit } from '@angular/core';
import { Users } from 'src/app/models/users.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClientService } from 'src/app/services/client/client.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';

@Component({
  selector: 'app-client-settings-page',
  templateUrl: './client-settings-page.component.html',
  styleUrls: ['./client-settings-page.component.css']
})
export class ClientSettingsPageComponent implements OnInit {
  user: Users;
  form: FormGroup;
  pinForm: FormGroup;
  loading: boolean;
  _loading: boolean;
  submitted: boolean;
  showSetPin: boolean;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private localStorage: LocalStorageService
  ) {
    this.user = this.localStorage.getUser();
    const has_pin = window.localStorage.getItem('has_pin');
    console.log('has_pin: ' + has_pin);
    if (_.isUndefined(has_pin) || _.isNull(has_pin)) {
      this.showSetPin = true;
      this.checkIfUserHasFormPin();
    }
    else {
      // this.showSetPin = true;
      this.showSetPin = false;
    }
  }

  ngOnInit() {
    this.initForm();
    this.initPinForm();
  }

   public get f() {
    return this.form.controls;
  }

  public get _f() {
    return this.pinForm.controls;
  }

  resolveStrCharacters(e: KeyboardEvent) {
    const regExp = new RegExp(/^\d*\.?\d*$/);
    if (!regExp.test(this.f.oldPin.value)) {
      const _v = this.f.oldPin.value.substring(0, this.f.oldPin.value.length - 1);
      this.f.oldPin.setValue(_v);
    }
  }

  resolveStrCharacters_1(e: KeyboardEvent) {
    const regExp = new RegExp(/^\d*\.?\d*$/);
    if (!regExp.test(this.f.newPin.value)) {
      const _v = this.f.newPin.value.substring(0, this.f.newPin.value.length - 1);
      this.f.newPin.setValue(_v);
    }
  }

  _resolveStrCharacters(e: KeyboardEvent) {
    const regExp = new RegExp(/^\d*\.?\d*$/);
    if (!regExp.test(this._f.pin.value)) {
      const _v = this._f.pin.value.substring(0, this._f.pin.value.length - 1);
      this._f.pin.setValue(_v);
    }
  }

  showPinChangeSuccess() {
    Swal.fire({
      title: 'PIN Changed',
      text: 'Form Submission PIN Code has been successfully changed',
      icon: 'success',
      confirmButtonText: 'Ok'
    });
  }

  showIncorrectPin() {
    Swal.fire({
      title: 'Oops!',
      text: 'Your old PIN is incorrect. Please check and try again!',
      icon: 'warning',
      confirmButtonText: 'Oh, Ok'
    });
  }

  showPinChangeFailed() {
    Swal.fire({
      title: 'Oops!',
      text: 'Sorry!. Something went wrong, we couldn\'t change your PIN. Please check your internet connection or our servers may be down.',
      icon: 'error',
      confirmButtonText: 'Hmm, Ok'
    });
  }

  initPinForm() {
    this.pinForm = this.fb.group({
      pin: ['', [Validators.minLength(4), Validators.required]]
    });
  }

  initForm() {
    this.form = this.fb.group({
      oldPin: ['', [Validators.minLength(4), Validators.required]],
      newPin: ['', [Validators.minLength(4), Validators.required]]
    });
  }

  checkIfUserHasFormPin() {
    this._loading = true;
    this.clientService.checkFormSubmitPin(this.user.id.toString()).then(
      ok => {
        this._loading = false;
        console.log('res: ' + JSON.stringify(ok));
        if (ok) {
          localStorage.setItem('has_pin', '1');
        }
      },
      err => {
        this._loading = false;
        console.log('error: ' + JSON.stringify(err));
      }
    );
  }

  changePin() {
    console.log('clicked');
    this.submitted = true;
    if (this.form.valid) {
      this.loading = true;
      const old_pin = this.f.oldPin.value;
      const new_pin = this.f.newPin.value;
      const user_id = this.user.id.toString();
      this.clientService.changeFormSubmitPin(user_id, old_pin, new_pin).then(
        ok => {
          this.loading = false;
          this.submitted = false;
          ok
            ? this.showPinChangeSuccess()
            : this.showPinChangeFailed();
        },
        err => {
          this.loading = false;
          this.submitted = false;
          err.error.message == 'INCORRECT_PIN'
            ? this.showIncorrectPin()
            : this.showPinChangeFailed();
        }
      );
    }
  }

  createPin() {
    this.submitted = true;
    const pin = this._f.pin.value;
    if (this.pinForm.valid) {
      this.loading = true;
      this.clientService.setFormSubmitPin(this.user.id.toString(), pin).then(
        ok => {
          if (ok) {
            this.loading = false;
            this.submitted = false;
            localStorage.setItem('has_pin', '1');
          }
          else {
            this.submitted = false;
            this.loading = false;
          }
        },
        err => {
          this.submitted = false;
          this.loading = false;
        }
      );
    }
  }

}
