import { MatStepper } from '@angular/material';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentService } from 'src/app/services/payments/payment.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
  paymentStatus: string;
  mobileNetwork: string;
  submittedCard: boolean;
  submittedMobile: boolean;
  transactionMessage: string;
  transactionIdentifier: string;

  @Input() formName: string;
  @Input() formLogo: string;
  @Input() currency: string;
  @Input() formPrice: string;
  @Output() paymentCompleted = new EventEmitter();
  @ViewChild('stepper', { static: false }) matStepper: MatStepper;

  constructor(
    private ngbModal: NgbModal,
    private formBuilder: FormBuilder,
    private paymentService: PaymentService
  ) {
    this.initVars();
  }

  ngOnInit() {
    this.initCardForm();
    this.initMobileForm();
  }

  private initVars() {
    this.isCard = false;

    this.paymentStatus = '';
    this.mobileNetwork = 'MTN';
    this.transactionMessage = '';
    this.transactionIdentifier = '';
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

  ensureNumbersOnly(e: KeyboardEvent) {
    const phone = this.mf.phoneNumber.value;
    const regExp = new RegExp(/^\d*\.?\d*$/);
    if (!regExp.test(phone)) {
      const value = phone.substring(0, phone.length - 1);
      this.mf.phoneNumber.setValue(value);
    }
  }

  handleCardNumberFormatting(e: any) {
    if (this.cf.cardNumber.value.length == 4 || this.cf.cardNumber.value.length == 9 || this.cf.cardNumber.value.length == 14) {
      const val = this.cf.cardNumber.value;
      this.cf.cardNumber.setValue(val + ' ');
    }
  }

  handleCardExpDate(e: any) {
    if (this.cf.expiration.value.length == 2) {
      const val = this.cf.expiration.value;
      this.cf.expiration.setValue(val + '/');
    }
  }

  removeAllSpacesFromCardNumber(cardNumber: string) {
    return cardNumber.replace(/ /g, '');
  }

  select(type: string) {
    this.matStepper.selected.completed = true;
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
      this.matStepper.selected.completed = true;
      this.checkCardIssuer();
      this.matStepper.next();
    }
  }

  submitMobileDetails() {
    this.submittedMobile = true;
    if (this.mobileForm.valid) {
      this.matStepper.selected.completed = true;
      this.matStepper.next();
    }
  }

  confirmDetails() {
    this.isCard ? this.cardPayment() : this.mobilePayment();
  }

  cardPayment() {
    this.isLoading = true;

    const amount = this.formPrice;
    const currency = this.currency;
    const issuer = this.cardIssuer;
    const cvv = this.cf.cvvCode.value;
    const rawCard = this.cf.cardNumber.value;
    const expYear = this.cf.expiration.value.split('/')[1];
    const expMonth = this.cf.expiration.value.split('/')[0];
    const cardNumber = this.removeAllSpacesFromCardNumber(rawCard);
    const cardHolder = this.cf.firstName.value + ' ' + this.cf.lastName.value;
    this.paymentService.makeCardPayment(amount, currency, issuer, cardNumber, expMonth, expYear, cvv, cardHolder).then(
      res => {
        this.isLoading = false;
        this.paymentStatus = res.status;
        this.transactionMessage = res.reason;
        this.transactionIdentifier = res.transaction_id;

        this.matStepper.selected.completed = true;
        this.matStepper.next();
      },
      err => {
        this.isLoading = false;
      }
    );
  }

  mobilePayment() {
    this.isLoading = true;

    const amount = this.formPrice;
    const networkProvider = this.mobileNetwork;
    const phoneNumber = this.mf.phoneNumber.value;
    this.paymentService.makeMobileMoneyPayment(amount, networkProvider, phoneNumber).then(
      res => {
        this.isLoading = false;
        this.paymentStatus = res.status;
        this.transactionMessage = res.reason;
        this.transactionIdentifier = res.transaction_id;

        this.matStepper.selected.completed = true;
        this.matStepper.next();
      },
      err => {
        this.isLoading = false;
      }
    );
  }

  completePayment() {
    this.isLoading = true;
    this.matStepper.selected.completed = true;
    this.paymentCompleted.emit();
    this.ngbModal.dismissAll();
  }

}