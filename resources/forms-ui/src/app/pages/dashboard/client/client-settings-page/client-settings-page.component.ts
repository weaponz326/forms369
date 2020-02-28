import * as _ from 'lodash';
import Swal from 'sweetalert2';
import { Component, OnInit } from '@angular/core';
import { Users } from 'src/app/models/users.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClientService } from 'src/app/services/client/client.service';
import { AccountService } from 'src/app/services/account/account.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';

@Component({
  selector: 'app-client-settings-page',
  templateUrl: './client-settings-page.component.html',
  styleUrls: ['./client-settings-page.component.css']
})
export class ClientSettingsPageComponent implements OnInit {
  user: Users;
  form: FormGroup;
  loading: boolean;
  loading1: boolean;
  _loading: boolean;
  pinForm: FormGroup;
  submitted: boolean;
  submitted1: boolean;
  showSetPin: boolean;
  passwordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private accountService: AccountService,
    private localStorage: LocalStorageService,
  ) {
    this.user = this.localStorage.getUser();
    const has_pin = window.localStorage.getItem('has_pin');
    console.log('has_pin: ' + has_pin);
    if (_.isUndefined(has_pin) || _.isNull(has_pin)) {
      this.showSetPin = true;
      this.checkIfUserHasFormPin();
    }
    else {
      this.showSetPin = false;
    }
  }

  ngOnInit() {
    this.initForm();
    this.initPinForm();
    this.initPasswordForm();
  }

   public get f() {
    return this.form.controls;
  }

  public get _f() {
    return this.pinForm.controls;
  }

  public get pwdF() {
    return this.passwordForm.controls;
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
      text: 'Your PIN Code has been successfully changed',
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

  showUpdatePasswordSuccess() {
    Swal.fire({
      title: 'Successful',
      text: 'Your password has been successfully changed',
      icon: 'success',
      confirmButtonText: 'Ok'
    });
  }

  showUpdatePasswordFailed() {
    Swal.fire({
      title: 'Oops!',
      text: 'Sorry!. Password update failed. Please check your internet connection or our servers may be down.',
      icon: 'error',
      confirmButtonText: 'Hmm, Ok'
    });
  }

  showSamePasswordAlert() {
    Swal.fire({
      title: 'Oops!',
      text: 'Sorry!. Your new password cannot be the same as your current password',
      icon: 'warning',
      confirmButtonText: 'Hmm, Ok'
    });
  }

  showPasswordMismatchAlert() {
    Swal.fire({
      title: 'Oops!',
      text: 'Sorry!. Your current password provided is incorrect',
      icon: 'warning',
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

  initPasswordForm() {
    this.passwordForm = this.fb.group({
      oldPassword: ['', [Validators.minLength(8), Validators.required]],
      newPassword: ['', [Validators.minLength(8), Validators.required]],
      confirmPassword: ['', [Validators.minLength(8), Validators.required]],
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

  passwordsMatch() {
    if (this.pwdF.newPassword.value != this.pwdF.confirmPassword.value) {
      return false;
    }
    else {
      return true;
    }
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
          this.form.reset();
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

  changePassword() {
    this.submitted1 = true;
    const user_id = this.user.id.toString();
    const current_pwd = this.pwdF.oldPassword.value;
    const new_password = this.pwdF.newPassword.value;
    const new_pwd_confirm = this.pwdF.confirmPassword.value;

    if (this.passwordForm.valid) {
      if (this.passwordsMatch()) {
        this.loading1 = true;
        this.accountService.updateAccountPassword(user_id, current_pwd, new_password, new_pwd_confirm).then(
          ok => {
            if (ok == true) {
              this.loading1 = false;
              this.submitted1 = false;
              this.passwordForm.reset();
              this.showUpdatePasswordSuccess();
            }
            else if (ok == 'MISMATCH') {
              this.loading1 = false;
              this.showPasswordMismatchAlert();
            }
            else {
              // the response was THE_SAME_PASSWORD
              this.loading1 = false;
              this.showSamePasswordAlert();
            }
          },
          err => {
            this.loading1 = false;
            this.showUpdatePasswordFailed();
          }
        );
      }
      else {
        this.pwdF.confirmPassword.setErrors({ unmatched: true });
      }
    }
  }

}
