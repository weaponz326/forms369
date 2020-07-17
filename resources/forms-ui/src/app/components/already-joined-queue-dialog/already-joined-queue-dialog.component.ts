import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, Input } from '@angular/core';
import { AddToQueue } from 'src/app/models/add-to-queue.model';
import { LoggingService } from 'src/app/services/logging/logging.service';
import { QMSQueueingService } from 'src/app/services/qms/qmsqueueing.service';

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

  constructor(
    private modalService: NgbModal,
    private logger: LoggingService,
    private qmsQueueService: QMSQueueingService
  ) {}

  ngOnInit() {
  }

  maintain() {
    console.log(this.token + ' ' + this.serviceId + ' ' + this.joinAtTime + ' ' + this.joinNow + ' ' + this.branchExtension);
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
    this.loading = true;
    const queue_data = this.getFormData();
    this.qmsQueueService.addCustomerToBranchQeueu(this.token, queue_data).then(
      res => {
        this.loading = false;
        if (res.error == 0) {
          this.modalService.dismissAll();
        }
        else {
        }
      },
      err => {
        this.loading = false;
      }
    );
  }

  rejoin() {
    this.qmsQueueService.cancelQueueRequest(this.token, this.phone, this.branchExtension).then(
      res => {
        this.joinQueue();
      },
      err => {
        this.logger.log('cancel_queue_error: ' + err);
      }
    );
  }

}
