import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddToQueue } from 'src/app/models/add-to-queue.model';
import { LoggingService } from 'src/app/services/logging/logging.service';
import { QMSQueueingService } from 'src/app/services/qms/qmsqueueing.service';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-already-joined-queue-dialog',
  templateUrl: './already-joined-queue-dialog.component.html',
  styleUrls: ['./already-joined-queue-dialog.component.css']
})
export class AlreadyJoinedQueueDialogComponent implements OnInit {

  loading: boolean;
  @Input() token: string;
  @Input() phone: string;
  @Input() joinNow: number;
  @Input() serviceId: string;
  @Input() joinAtTime: string;
  @Input() branchExtension: any;
  @Output() processCompleted = new EventEmitter();

  constructor(
    private modalService: NgbModal,
    private logger: LoggingService,
    private qmsQueueService: QMSQueueingService
  ) {}

  ngOnInit() {
  }

  maintain() {
    this.logger.log(this.token + ' ' + this.serviceId + ' ' + this.joinAtTime + ' ' + this.joinNow + ' ' + this.branchExtension);
    this.processCompleted.emit(true);
    this.modalService.dismissAll();
  }

  getFormData() {
    const queue = new AddToQueue(
      this.phone,
      this.branchExtension,
      this.serviceId,
      this.serviceId,
      '0',
      'null',
      this.joinNow,
      this.joinAtTime,
      'FORMS369'
    );

    return queue;
  }

  joinQueue() {
    const queue_data = this.getFormData();
    this.qmsQueueService.addCustomerToBranchQueue(this.token, queue_data).then(
      res => {
        this.loading = false;
        if (res.message.error == 0) {
          this.processCompleted.emit(true);
          sessionStorage.setItem('qms_join_event', 'joined');
          this.modalService.dismissAll();
        }
        else {
          this.processCompleted.emit(false);
          sessionStorage.setItem('qms_join_event', 'joined');
          this.modalService.dismissAll();
        }
      },
      err => {
        this.loading = false;
        this.processCompleted.emit(false);
      }
    );
  }

  rejoin() {
    this.loading = true;
    this.qmsQueueService.cancelQueueRequest(this.token, this.phone, this.branchExtension).then(
      res => {
        this.joinQueue();
      },
      err => {
        this.processCompleted.emit(false);
        this.logger.log('cancel_queue_error: ' + err);
      }
    );
  }

}
