import { Component, OnInit, Input } from '@angular/core';
import { NgbTimepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbTimeStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QMSQueueingService } from 'src/app/services/qms/qmsqueueing.service';
import { AddToQueue } from 'src/app/models/add-to-queue.model';
import { Users } from 'src/app/models/users.model';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';

@Component({
  selector: 'app-join-queue-dialog',
  templateUrl: './join-queue-dialog.component.html',
  styleUrls: ['./join-queue-dialog.component.css'],
  providers: [NgbTimepickerConfig, QMSQueueingService]
})
export class JoinQueueDialogComponent implements OnInit {

  user: Users;
  form: FormGroup;
  loading: boolean;
  submitted: boolean;
  showTimer: boolean;
  time: NgbTimeStruct;
  private token: string;
  servicesList: Array<any>;
  @Input() branchExtension: any;

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private localStorage: LocalStorageService,
    private qmsQueueService: QMSQueueingService
  ) {
    this.servicesList = [];
    this.user = this.localStorage.getUser();
    this.getBranchServices();
  }

  ngOnInit() {
    this.time = { hour: 13, minute: 30, second: 0 };
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
      this.getCurrentTime();
      this.form = this.formBuilder.group({
        joinTime: [this.time],
        joinType: ['', Validators.required],
        queueService: ['', Validators.required],
      });
    }
  }

  getFormData() {
    const queue = new AddToQueue(
      this.user.phone,
      this.branchExtension,
      this.f.queueService.value,
      this.f.queueService.value,
      '0',
      null,
      this.f.joinTime.value,
      this.f.joinTime.value,
      'FORMS369'
    );

    return queue;
  }

  getBranchServices() {
    this.qmsQueueService.authenticateQmsEndpoint().then(
      token => {
        this.token = token;
        this.qmsQueueService.getBranchServices(this.token, this.branchExtension).then(
          b_services => {
            this.qmsQueueService.getCustomerServices(this.token, this.branchExtension).then(
              c_services => {
                this.servicesList = b_services.concat(c_services);
              },
              error => {}
            );
          },
          error => { }
        );
      },
      err => {
        console.log('errrrrrrror: ' + err);
      }
    );
  }

  joinQueue() {
    this.loading = true;
    const queue_data = this.getFormData();
    this.qmsQueueService.addCustomerToBranchQeueu(this.token, queue_data).then(
      res => {
        this.loading = false;
      },
      err => {
        this.loading = false;
      }
    );
  }

  getCurrentTime() {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    this.time = { hour: hour, minute: minute, second: 0 };
    console.log('current time: ' + JSON.stringify(this.time));
  }

  submit() {
    this.submitted = true;
    if (this.form.valid) {
      console.log('ok, continue ...');
      this.joinQueue();
    }
    else {
      console.log('ooops, invalid');
    }
  }

  close() {
    this.modalService.dismissAll();
  }

}
