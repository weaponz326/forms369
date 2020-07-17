import { Users } from 'src/app/models/users.model';
import { AddToQueue } from 'src/app/models/add-to-queue.model';
import { NgbTimepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbTimeStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoggingService } from 'src/app/services/logging/logging.service';
import { QMSQueueingService } from 'src/app/services/qms/qmsqueueing.service';
import { DateTimeService } from 'src/app/services/date-time/date-time.service';
import { Component, OnInit, Input, ViewChild, TemplateRef, Output, EventEmitter } from '@angular/core';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';

@Component({
  selector: 'app-join-queue-dialog',
  templateUrl: './join-queue-dialog.component.html',
  styleUrls: ['./join-queue-dialog.component.css'],
  providers: [NgbTimepickerConfig, QMSQueueingService]
})
export class JoinQueueDialogComponent implements OnInit {

  user: Users;
  token: string;
  queueData: any;
  form: FormGroup;
  loading: boolean;
  submitted: boolean;
  showTimer: boolean;
  time: NgbTimeStruct;
  servicesList: Array<any>;
  @Input() branchExtension: any;
  @Output() queueSkipped = new EventEmitter();
  @Output() processCompleted = new EventEmitter();
  @ViewChild('alreadyJoinQueue', { static: false }) alreadyJoinQueueDialog: TemplateRef<any>;

  constructor(
    private modalService: NgbModal,
    private logger: LoggingService,
    private formBuilder: FormBuilder,
    private dateTimeService: DateTimeService,
    private localStorage: LocalStorageService,
    private qmsQueueService: QMSQueueingService,
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

  showAlreadyJoinQueueDialog() {
    this.modalService.dismissAll();
    this.modalService.open(this.alreadyJoinQueueDialog, { centered: true, backdrop: 'static', keyboard: false });
  }

  resolveDate() {
    const now = new Date();
    const month = now.getMonth() + 1;
    const date = now.getFullYear().toString() + '-' + month.toString() + '-' + now.getDate().toString();
    const formatted_date = this.dateTimeService.getDatePart(date);
    this.logger.log('formttated_:: ' + formatted_date);
    const fullDateTime = formatted_date + ' ' + this.joinTime.value.hour +
      ':' + this.joinTime.value.minute + ':' + now.getSeconds();
    this.logger.log('submitted_join_at: ' + fullDateTime);
    return fullDateTime;
  }

  getFormData() {
    const join_at = this.resolveDate();
    const joinTime = this.f.joinTime.value == 'now' ? 0 : 1;
    const queue = new AddToQueue(
      this.user.phone,
      this.branchExtension,
      this.f.queueService.value,
      this.f.queueService.value,
      '0',
      'null',
      joinTime,
      join_at,
      'FORMS369'
    );

    this.queueData = {
      serviceId: this.f.queueService.value,
      phone: this.user.phone,
      joinNow: joinTime,
      joinAtTime: join_at
    };
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
        this.logger.log('errrrrrrror: ' + err);
      }
    );
  }

  joinQueue() {
    this.loading = true;
    const queue_data = this.getFormData();
    this.qmsQueueService.addCustomerToBranchQeueu(this.token, queue_data).then(
      res => {
        this.loading = false;
        if (res.error == 0) {
          this.modalService.dismissAll();
          this.processCompleted.emit(true);
        }
        else {
          this.showAlreadyJoinQueueDialog();
        }
      },
      err => {
        this.loading = false;
        this.processCompleted.emit(false);
      }
    );
  }

  getCurrentTime() {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    this.time = { hour: hour, minute: minute, second: 0 };
    this.logger.log('current time: ' + JSON.stringify(this.time));
  }

  submit() {
    this.submitted = true;
    if (this.form.valid) {
      this.logger.log('ok, continue ...');
      this.joinQueue();
    }
    else {
      this.logger.log('ooops, invalid');
    }
  }

  doneProcessing(data: any) {
    this.processCompleted.emit(data);
  }

  skip() {
    this.queueSkipped.emit(true);
    console.log('emitted event');
    this.close();
  }

  close() {
    this.modalService.dismissAll();
  }

}
