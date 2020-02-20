import * as _ from 'lodash';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService } from 'src/app/services/client/client.service';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { LoggingService } from 'src/app/services/logging/logging.service';
import { EndpointService } from 'src/app/services/endpoint/endpoint.service';
import { DateTimeService } from 'src/app/services/date-time/date-time.service';
import { ReloadingService } from 'src/app/services/reloader/reloading.service';
import { FrontDeskService } from 'src/app/services/front-desk/front-desk.service';
import { DownloaderService } from 'src/app/services/downloader/downloader.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';

@Component({
  selector: 'app-exec-clients-forms-data-page',
  templateUrl: './exec-clients-forms-data-page.component.html',
  styleUrls: ['./exec-clients-forms-data-page.component.css']
})
export class ExecClientsFormsDataPageComponent implements OnInit {

  form: any;
  user: any;
  imgUrl: string;
  keys: Array<any>;
  hasMore: boolean;
  hasData: boolean;
  loading: boolean;
  hasError: boolean;
  isLoading: boolean;
  submitted: boolean;
  documentUrl: string;
  loadingMore: boolean;
  filterForm: FormGroup;
  hasMoreError: boolean;
  hasDocuments: boolean;
  hasNoAttachments: boolean;
  tableContents: Array<any>;
  respondentData: Array<any>;
  clientFormData: Array<any>;
  tableHeaders: Array<string>;
  loadingAttachments: boolean;
  attachmentList: Array<any>;
  filterModalRef: NgbModalRef;
  attachModalRef: NgbModalRef;
  alltableContents: Array<any>;
  submittedFormData: Array<any>;
  @ViewChild('filter', { static: false }) filterModal: TemplateRef<any>;
  @ViewChild('attachment', { static: false }) attachmentsModal: TemplateRef<any>;
  @ViewChild('viewDocAttachment', { static: false }) viewDocDialog: TemplateRef<any>;
  @ViewChild('viewImgAttachment', { static: false }) viewImgDialog: TemplateRef<any>;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private logging: LoggingService,
    private dateTime: DateTimeService,
    private clientService: ClientService,
    private reloadService: ReloadingService,
    private endpointService: EndpointService,
    private localStorage: LocalStorageService,
    private downloadService: DownloaderService,
    private frontDeskService: FrontDeskService,
  ) {
    this.initVars();
    this.getAllRespondentsData();
  }

  ngOnInit() {
    this.filterForm = this.fb.group({
      endDate: ['', Validators.required],
      filterBy: ['', Validators.required],
      startDate: ['', Validators.required]
    });
  }

  public get f() {
    return this.filterForm.controls;
  }

  initVars() {
    this.keys = [];
    this.tableHeaders = [];
    this.tableContents = [];
    this.clientFormData = [];
    this.attachmentList = [];
    this.respondentData = [];
    this.alltableContents = [];
    this.submittedFormData = [];
    this.form = window.history.state.form;
    this.user = this.localStorage.getUser();
    this.logging.log('form: ' + JSON.stringify(this.form));
    this.form = this.reloadService.resolveReloadDataLoss(this.form);
  }

  checkIfHasMore() {
    return _.isEmpty(this.frontDeskService.nextPaginationUrl) ? false : true;
  }

  getDataHeaders(res: any) {
    this.tableHeaders = [];
    const form_fields = this.form.form_fields;
    const client_data_key = _.keys(res[0].client_submitted_details);

    _.forEach(form_fields, field => {
      _.forEach(client_data_key, client_key => {
        if (!_.isUndefined(field.name)) {
          if (field.name == client_key) {
            this.keys.push(client_key);
            const key = this.transformText(client_key);
            this.tableHeaders.push(key);
          }
        }
      });
    });
  }

  getDataBody(res: any) {
    let objArr = [];
    _.forEach(res, data => {
      _.forEach(this.keys, k => {
        objArr.push(data.client_submitted_details[k]);
      });
      objArr.push(moment(data.submitted_at).format('DD MMM YYYY hh:mm A'));
      console.log(objArr);
      this.tableContents.push(objArr);
      objArr = [];
    });
  }

  getAllRespondentsData() {
    this.loading = true;
    this.frontDeskService.getRespondantData(this.form.form_code).then(
      res => {
        this.loading = false;
        this.hasMore = this.checkIfHasMore();
        console.log('res: ' + JSON.stringify(res));
        if (res.length == 0) {
          this.hasData = false;
        }
        else {
          this.hasData = true;
          this.getDataHeaders(res);
          this.getDataBody(res);
          this.respondentData = res;
          _.forEach(res, (data) => {
            this.submittedFormData.push(data);
            this.clientFormData.push(data.client_submitted_details);
          });
        }
      },
      err => {
        this.loading = false;
        console.log('err: ' + JSON.stringify(err));
      }
    );
  }

  loadMore() {
    this.loadingMore = true;
    const moreUrl = this.frontDeskService.nextPaginationUrl;
    this.frontDeskService.getRespondantData(this.form.form_code, moreUrl).then(
      res => {
        this.loadingMore = false;
        this.hasMoreError = false;
        this.hasMore = this.checkIfHasMore();
        console.log('res: ' + JSON.stringify(res));
        if (res.length == 0) {
          this.hasData = false;
        }
        else {
          this.hasData = true;
          this.getDataBody(res);
          console.log('getBody: ' + JSON.stringify(this.tableContents));
          console.log('submitted_data: ' + JSON.stringify(res));
          _.forEach(res, (data) => {
            this.submittedFormData.push(data);
            this.clientFormData.push(data.client_submitted_details);
          });
        }
      },
      err => {
        this.loadingMore = false;
        this.hasMoreError = true;
      }
    );
  }

  transformText(text: string) {
    if (_.includes(text, '-')) {
      return text.replace(/-/g, ' ');
    }
    else if (_.includes(text, '_')) {
      return _.replace(text, '_', ' ');
    }
    else {
      return text;
    }
  }

  transformUrl(url: string) {
    const index = url.lastIndexOf('/') + 1;
    return url.substr(index);
  }

  isFirst(index: number) {
    return index == 0 ? true : false;
  }

  isImageFile(url: string) {
    const index = url.lastIndexOf('.') + 1;
    const extension = url.substr(index);
    return extension == 'jpeg' || extension == 'png' || extension == 'jpg' || extension == 'gif'
      ? true
      : false;
  }

  getAttachments(index: number) {
    console.log('indeX: ' + index);
    console.log('daaaaaata: ' + JSON.stringify(this.submittedFormData[index]));
    this.loadingAttachments = true;
    const selected_form = this.submittedFormData[index];
    const host = this.endpointService.apiHost + 'storage/attachments/';
    this.clientService.getFormAttachment(selected_form.submission_code).then(
      files => {
        console.log('aaaaaaa: ' + files.length);
        if (files.length == 0) {
          this.loadingAttachments = false;
          this.hasNoAttachments = true;
        }
        else {
          this.loadingAttachments = false;
          _.forEach(files, (file) => {
            if (!this.isImageFile(file.url)) {
              this.hasDocuments = true;
            }
            file.url = host + file.url;
            this.attachmentList.push(file);
          });
        }
      },
      err => {
        this.logging.log('error: ' + JSON.stringify(err));
      }
    );
  }

  openFilterModal() {
    this.filterModalRef = this.modalService.open(this.filterModal, { centered: true });
  }

  openAttachmentModal(index: number) {
    this.attachModalRef = this.modalService.open(this.attachmentsModal, { centered: true });
    this.attachmentList = [];
    this.hasNoAttachments = false;
    this.getAttachments(index);
  }

  openModal(e: Event, url: string) {
    if (this.isImageFile(url)) {
      this.openImageAttachmentModal(e, url);
    }
    else {
      this.openDocumentAttachmentModal(e, url);
    }
  }

  openImageAttachmentModal(e: Event, url: string) {
    e.stopPropagation();
    this.imgUrl = url;
    this.modalService.open(this.viewImgDialog, { centered: true });
  }

  openDocumentAttachmentModal(e: Event, url: string) {
    e.stopPropagation();
    this.documentUrl = url;
    this.modalService.open(this.viewDocDialog, { centered: true });
  }

  downloadAll(format: string) {
    switch (format) {
      case 'pdf':
        this.downloadAsPDF();
        break;
      case 'csv':
        this.downloadAsCSV();
        break;
      case 'excel':
        this.downloadAsExcel();
        break;
      default:
        break;
    }
  }

  downloadAsPDF() {
    const table_id = 'table-data';
    const filename = 'forms369_' + this.form.form_code + '_data';
    this.downloadService.exportToPDF(table_id, filename);
  }

  downloadAsCSV() {
    const table_id = 'table-data';
    const filename = 'forms369_' + this.form.form_code + '_data';
    this.downloadService.exportToCsv(table_id, filename);
  }

  downloadAsExcel() {
    const table_id = 'table-data';
    const filename = 'forms369_' + this.form.form_code + '_data';
    this.downloadService.exportToExcel(table_id, filename);
  }

  downloadDataPdf(index: number) {
    const print_data = {
      print: false,
      form_data: this.form.form_fields,
      client_data: this.clientFormData[index],
    };
    this.router.navigateByUrl('executive/pdf_printing', { state: { form: print_data } });
  }

  print(e: Event, index: number) {
    e.stopPropagation();
    const print_data = {
      print: true,
      form_data: this.form.form_fields,
      client_data: this.clientFormData[index],
    };

    this.user.can_print == 0
      ? this.router.navigateByUrl('executive/printing', { state: { form: print_data }})
      : this.router.navigateByUrl('executive/pdf_printing', { state: { form: print_data } });
  }

  retry() {
    this.getAllRespondentsData();
  }

  handleFilterDataFilling(array: Array<any>) {
    this.keys = [];
    this.tableContents = [];
    this.getDataHeaders(array);
    this.getDataBody(array);
    console.log('submitted_data: ' + JSON.stringify(array));
    _.forEach(array, (data) => {
      this.submittedFormData.push(data);
      this.clientFormData.push(data.client_submitted_details);
    });
  }

  resetFilter() {
    this.handleFilterDataFilling(this.respondentData);
    this.filterModalRef.close();
  }

  onFilter() {
    this.submitted = true;
    if (this.filterForm.valid) {
      const filter_by = this.f.filterBy.value;
      if (filter_by == 'processed_at') {
        this.filterByProcessedDate();
      }
      else if (filter_by == 'submitted_at') {
        this.filterBySubmittedDate();
      }
      else {}
    }
  }

  filterBySubmittedDate() {
    const end = this.f.endDate.value;
    const start = this.f.startDate.value;

    // Bootstrap date picker returns single digit for months from Jan to Sept
    // In order to allow us to compare against MYSQL which returns double digits
    // for that, we convert the month accordingly.
    const end_month = _.toNumber(end.month) <= 9 ? '0' + end.month : end.month;
    const start_month = _.toNumber(start.month) <= 9 ? '0' + start.month : start.month;

    const end_date = end.year + '-' + end_month + '-' + end.day;
    const start_date = start.year + '-' + start_month + '-' + start.day;
    console.log(start_date);
    console.log(end_month);

    let submitted_forms = this.respondentData;
    submitted_forms = _.filter(submitted_forms,
      (f) =>
      this.dateTime.getDatePart(f.submitted_at) >= start_date &&
      this.dateTime.getDatePart(f.submitted_at) <= end_date
    );

    console.log('submitted: ' + JSON.stringify(submitted_forms));
    submitted_forms.length != 0 ? this.handleFilterDataFilling(submitted_forms) : this.tableContents = [];
    this.filterModalRef.close();
  }

  filterByProcessedDate() {
    const end = this.f.endDate.value;
    const start = this.f.startDate.value;

    // Bootstrap date picker returns single digit for months from Jan to Sept
    // In order to allow us to compare against MYSQL which returns double digits
    // for that, we convert the month accordingly.
    const end_month = _.toNumber(end.month) <= 9 ? '0' + end.month : end.month;
    const start_month = _.toNumber(start.month) <= 9 ? '0' + start.month : start.month;

    const end_date = end.year + '-' + end_month + '-' + end.day;
    const start_date = start.year + '-' + start_month + '-' + start.day;
    console.log(start_date);
    console.log(end_date);

    let submitted_forms = this.respondentData;
    submitted_forms = _.filter(submitted_forms,
      (f) =>
        this.dateTime.getDatePart(f.last_processed) >= start_date &&
        this.dateTime.getDatePart(f.last_processed) <= end_date
    );

    console.log('submitted: ' + JSON.stringify(submitted_forms));

    submitted_forms.length != 0 ? this.handleFilterDataFilling(submitted_forms) : this.tableContents = [];
    this.filterModalRef.close();
  }

}
