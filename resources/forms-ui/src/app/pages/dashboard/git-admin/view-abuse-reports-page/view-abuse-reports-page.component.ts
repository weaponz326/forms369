import * as _ from 'lodash';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { DateTimeService } from 'src/app/services/date-time/date-time.service';
import { AbuseReportsService } from 'src/app/services/abuse-reports/abuse-reports.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-abuse-reports-page',
  templateUrl: './view-abuse-reports-page.component.html',
  styleUrls: ['./view-abuse-reports-page.component.css']
})
export class ViewAbuseReportsPageComponent implements OnInit {
  loading: boolean;
  hasData: boolean;
  hasMore: boolean;
  hasError: boolean;
  loadingMore: boolean;
  hasMoreError: boolean;
  reportMessage: string;
  abuseReportsList: Array<any>;
  loadingModalRef: NgbModalRef;
  @ViewChild('loader', { static: false }) loadingModal: TemplateRef<any>;
  @ViewChild('confirmDelete', { static: false }) deleteModal: TemplateRef<any>;
  @ViewChild('confirmDeactivate', { static: false }) deactivateModal: TemplateRef<any>;
  @ViewChild('abuseReportMessage', { static: false }) readMessageModal: TemplateRef<any>;

  constructor(
    private modalService: NgbModal,
    private dateService: DateTimeService,
    private abuseReportService: AbuseReportsService
  ) {
    this.reportMessage = '';
    this.abuseReportsList = [];
    this.getAbuseReports();
  }

  ngOnInit() {
  }

  showLoadingModal() {
    this.loadingModalRef = this.modalService.open(this.loadingModal, { centered: true });
  }

  hideLoadingModal() {
    this.loadingModalRef.close();
  }

  showAddressReportSuccessAlert() {
    Swal.fire({
      title: 'Successful',
      text: 'This abuse report has been successfully addressed.',
      icon: 'success'
    });
  }

  showAddressReportFailedAlert() {
    Swal.fire({
      title: 'Failed',
      text: 'Failed to address the abuse report. Please check your internet connection and try again!',
      icon: 'error'
    });
  }

  getAbuseReports() {
    this.loading = true;
    this.abuseReportService.getAbuseReports().then(
      reports => {
        if (reports.length != 0) {
          this.hasData = true;
          this.loading = false;
          _.forEach(reports, (code) => {
            code.created_at = code.created_at == null ? '' : this.dateService.safeDateFormat(code.created_at);
            this.abuseReportsList.push(code);
          });
        }
        else {
          this.hasData = false;
          this.loading = false;
        }
      },
      err => {
        this.loading = false;
        this.hasError = true;
      }
    );
  }

  readMessage(message: string) {
    this.reportMessage = message;
    this.modalService.open(this.readMessageModal, { centered: true });
  }

  address(id: string) {
    this.addressReport(id);
  }

  addressReport(id: string) {
    this.abuseReportService.addressAbuseReport(id).then(
      ok => {
        ok ? this.showAddressReportSuccessAlert() : this.showAddressReportFailedAlert();
      },
      err => {
        console.log('error: ' + JSON.stringify(err));
        this.showAddressReportFailedAlert();
      }
    );
  }

  deleteAccessReport() {
  }

  delete(id: number) {
    this.modalService.open(this.deleteModal, { centered: true }).result.then(
      result => {
        if (result == 'delete') {
          this.deleteAccessReport();
        }
      }
    );
  }
}
