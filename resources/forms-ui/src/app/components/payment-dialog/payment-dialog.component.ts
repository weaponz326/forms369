import { MatStepper } from '@angular/material';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentService } from 'src/app/services/payments/payment.service';

@Component({
  selector: 'app-payment-dialog',
  templateUrl: './payment-dialog.component.html',
  styleUrls: ['./payment-dialog.component.css']
})
export class PaymentDialogComponent implements OnInit {

  isCard: boolean;
  isLoading: boolean;
  cardIssuer: string;
  cardForm: FormGroup;
  mobileForm: FormGroup;
  mobileNetwork: string;
  submittedCard: boolean;
  submittedMobile: boolean;
  @Input() formName: string;
  @Input() formLogo: string;
  @Input() currency: string;
  @Input() formPrice: string;
  @ViewChild('stepper', { static: false }) matStepper: MatStepper;

  constructor(
    private formBuilder: FormBuilder,
    private paymentService: PaymentService
  ) {
    this.isCard = false;
    this.mobileNetwork = 'MTN';
  }

  ngOnInit() {
    this.initCardForm();
    this.initMobileForm();
  }

  initCardForm() {
    this.cardForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      cardNumber: ['', Validators.required],
      cvvCode: ['', Validators.required],
      expiration: ['', Validators.required]
    });
  }

  initMobileForm() {
    this.mobileForm = this.formBuilder.group({
      voucherPin: [''],
      phoneNumber: ['', Validators.required]
    });
  }

  public get cf() {
    return this.cardForm.controls;
  }

  public get mf() {
    return this.mobileForm.controls;
  }

  checkCardIssuer() {
    // VISA
    const regExp = new RegExp('^4');
    const cardNumber = this.cf.cardNumber.value;
    if (cardNumber.match(regExp) != null)
      this.cardIssuer = 'VIS';

    // MASTER CARD
    // Updated for mastercard 2017 BINs expansion
    if (/^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/.test(cardNumber))
      this.cardIssuer = 'MAS';    
  }

  select(type: string) {
    this.isCard = type == 'card' ? true : false;
    this.matStepper.next();
  }

  selectNetwork(network: string) {
    this.mobileNetwork = network;
  }

  previousStep() {
    this.matStepper.previous();
  }

  submitCardDetails() {
    this.submittedCard = true;
    if (this.cardForm.valid) {
      this.checkCardIssuer();
      this.matStepper.next();
    }
  }

  submitMobileDetails() {
    this.submittedMobile = true;
    if (this.mobileForm.valid) {
      this.matStepper.next();
    }
  }

  confirmDetails() {
    this.isCard ? this.cardPayment() : this.mobilePayment();
  }

  cardPayment() {
    const amount = this.formPrice;
    const currency = this.currency;
    const issuer = this.cardIssuer;
    const cvv = this.cf.cvvCode.value;
    const expYear = this.cf.expiration.value;
    const expMonth = this.cf.expiration.value;
    const cardNumber = this.cf.cardNumber.value;
    const cardHolder = this.cf.firstName.value + ' ' + this.cf.lastName.value;
    this.paymentService.makeCardPayment(amount, currency, issuer, cardNumber, expMonth, expYear, cvv, cardHolder).then(
      res => {
        this.matStepper.next();
      },
      err => {}
    );
  }

  mobilePayment() {
    this.isLoading = true;
    
    const amount = this.formPrice;
    const networkProvider = this.mobileNetwork;
    const phoneNumber = this.mf.phoneNumber.value;
    this.paymentService.makeMobileMoneyPayment(amount, networkProvider, phoneNumber).then(
      res => {
        this.matStepper.next();
      },
      err => { }
    );
  }

  completePayment() {
    
  }

}
