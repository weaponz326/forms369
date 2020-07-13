import { Component, OnInit, Input } from '@angular/core';
import { NgbTimepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbTimeStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-join-queue-dialog',
  templateUrl: './join-queue-dialog.component.html',
  styleUrls: ['./join-queue-dialog.component.css'],
  providers: [NgbTimepickerConfig]
})
export class JoinQueueDialogComponent implements OnInit {

  form: FormGroup;
  showTimer: boolean;
  time: NgbTimeStruct;
  @Input() branchExtension: any;

  constructor(private modalService: NgbModal, private formBuilder: FormBuilder) {
    this.time = { hour: 13, minute: 30, second: 0 };
    this.getBranchServices();
  }

  ngOnInit() {
    this.initForm();
  }

  public get f() {
    return this.form.controls;
  }

  public get joinTime() {
    return this.form.get('joinTime');
  }

  public get services() {
    return this.form.get('queueService');
  }

  onTimeSelect(e: any) {
    this.joinTime.setValue(e.target.value, {
      onlySelf: true
    });
    this.showTimer = e.target.value == 'later' ? true : false;
    this.getCurrentTime();
  }

  onServiceSelect(e: any) {
    this.services.setValue(e.target.value, {
      onlySelf: true
    });
  }

  initForm() {
    if (this.showTimer) {
      this.form = this.formBuilder.group({
        joinType: ['', Validators.required],
        queueService: ['', Validators.required],
        joinTime: [this.time, Validators.required],
      });
    }
    else {
      this.form = this.formBuilder.group({
        joinTime: [this.time],
        joinType: ['', Validators.required],
        queueService: ['', Validators.required],
      });
    }
  }

  getBranchServices() {}

  getCurrentTime() {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    this.time = { hour: hour, minute: minute, second: 0 };
    console.log('current time: ' + JSON.stringify(this.time));
  }

  submit() {
    if (this.form.valid) {
      console.log('ok, continue ...');
    }
    else {
      console.log('ooops, invalid');
    }
  }

  close() {
    this.modalService.dismissAll();
  }

}
