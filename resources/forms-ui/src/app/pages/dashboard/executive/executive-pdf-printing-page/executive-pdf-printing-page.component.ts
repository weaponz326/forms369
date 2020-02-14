import * as _ from 'lodash';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { PDFDocumentProxy } from 'ng2-pdf-viewer';
import { Users } from 'src/app/models/users.model';
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { EndpointService } from 'src/app/services/endpoint/endpoint.service';
import { PDFAnnotationData, PDFPageProxy, PDFProgressData } from 'pdfjs-dist';
import { FrontDeskService } from 'src/app/services/front-desk/front-desk.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';
import { ReloadingService } from 'src/app/services/reloader/reloading.service';

@Component({
  selector: 'app-executive-pdf-printing-page',
  templateUrl: './executive-pdf-printing-page.component.html',
  styleUrls: ['./executive-pdf-printing-page.component.css']
})
export class ExecutivePdfPrintingPageComponent implements OnInit {
  form: any;
  user: Users;
  pdfSrc: string;
  dpiRatio: any;
  loading: boolean;
  hasError: boolean;
  myForm: FormGroup;
  inputList: Input[];
  clientFormDetails: any[];

  constructor(
    private router: Router,
    private _fb: FormBuilder,
    private reloader: ReloadingService,
    private endpointService: EndpointService,
    private localStorage: LocalStorageService,
    private frontDeskService: FrontDeskService,
  ) {
    this.initVars();
  }

  ngOnInit() {
    this.myForm = this._fb.group({});
  }

  initVars() {
    this.loading = true;
    this.inputList = [];
    this.dpiRatio = 96 / 72;
    this.clientFormDetails = [];
    this.form = window.history.state.form;
    this.form = this.reloader.resolveReloadDataLoss(this.form);
    this.user = this.localStorage.getUser();

    this.frontDeskService.getPrintPDFFile(this.form.form_code, this.user.merchant_id.toString()).then(
      file => {
        if (_.isUndefined(file) || _.isNull(file)) {
          alert('No PDF file is available for this form. Redirecting you to do a default printing');
          this.router.navigateByUrl('executive/printing', { state: { form: this.form }, replaceUrl: true });
        }
        else {
          console.log('ssss: ' + JSON.stringify(file.url));
          this.pdfSrc = this.endpointService.storageHost + 'files/' + file.url;
          window.onafterprint = () => {
            this.showPrintButton();
          };
        }
      },
      err => { }
    );
  }

  onProgress(progressData: PDFProgressData) {
    this.loading = true;
    if (progressData.loaded) {
      this.loading = false;
    }
  }

  onError(error: any) {
    this.loading = false;
    this.hasError = true;
  }

  fieldNamesMatch(pdfFieldName: string, clientFieldName: string) {
    return pdfFieldName == clientFieldName ? true : false;
  }

  fieldTypesMatch(pdfFieldType: string, clientFieldType: string) {
    return pdfFieldType == clientFieldType ? true : false;
  }

  resolveDateFormat(date: string) {
    return moment(date).format('DD MMM YYYY');
  }

  private createInput(annotation: any, rect: number[] = null) {
    const input = new Input();
    const formControl = new FormControl(annotation.buttonValue || '');
    const clientDataKeys = _.keys(this.form.client_submitted_details);
    input.name = annotation.fieldName;

    // match client data to the corresponding form field on the pdf form.
    _.forEach(clientDataKeys, (key, i) => {
      if (annotation.fieldType === 'Tx') {
        // check if field names match
        if (this.fieldNamesMatch(annotation.fieldName, key)) {
          // set the client data to this field
          input.type = 'text';
          const value = this.form.client_submitted_details[key];

          // handle formatting of dates if the key is a date.
          if (_.includes(key, 'd-o-b') || _.includes(key, 'date')) {
            console.log('key: ' + key);
            const formatted_date = this.resolveDateFormat(value);
            input.value = formatted_date;
          }
          else {
            input.value = value;
          }
        }

        console.log('Tx Values: ' + annotation.fieldValue);
      }
      // checkbox
      else if (annotation.fieldType === 'Btn' && annotation.checkBox) {
        // check if field names match
        if (this.fieldNamesMatch(annotation.fieldName, key)) {
          // set the client data to this field
          input.type = 'checkbox';
          if (annotation.exportValue == this.form.client_submitted_details[key]) {
            input.value = this.form.client_submitted_details[key];
            input.checked = true;
            console.log('selected value: ' + this.form.client_submitted_details[key]);
          }
        }
      }
      // radio button
      else if (annotation.fieldType === 'Btn' && annotation.radioButton) {
        // check if field name match
        if (this.fieldNamesMatch(annotation.fieldName, key)) {
          // set the client data to this field
          input.type = 'checkbox';
          if (annotation.exportValue == this.form.client_submitted_details[key]) {
            input.value = this.form.client_submitted_details[key];
            input.checked = true;
            console.log('selected radio: ' + this.form.client_submitted_details[key]);
          }
        }
      }
      else {
        console.log('new type encountered: ' + annotation.fieldType);
      }
    });

    // Calculate all the positions and sizes
    if (rect) {
      input.top = rect[1] - (rect[1] - rect[3]);
      input.left = rect[0];
      input.height = (rect[1] - rect[3]);
      input.width = (rect[2] - rect[0]);
    }

    this.inputList.push(input);
    return formControl;
  }

  addInput(annotation: any, rect: number[] = null) {
    console.log(annotation);
    this.myForm.addControl(annotation.fieldName, this.createInput(annotation, rect));
  }

  pdfFileLoadComplete(pdf: PDFDocumentProxy) {
    for (let i = 1; i <= pdf.numPages; i++) {
      // track the current page
      let currentPage: PDFPageProxy = null;
      pdf.getPage(i).then(p => {
        currentPage = p;
        // get the annotations of the current page
        return p.getAnnotations();
      }).then(ann => {
        const annotations = (<any> ann) as PDFAnnotationData[];
        annotations
          .filter(a => a.subtype === 'Widget') // get the form field annotation only.
          .forEach(a => {
            // get the rectangle that represents the single field
            // and resize it according to the current DPI.
            const fieldRect = currentPage
              .getViewport(this.dpiRatio)
              .convertToViewportRectangle(a.rect);

            // add the corresponding input
            this.addInput(a, fieldRect);
          });
      });
    }
  }

  getInputPosition(input: any): any {
    return {
      top: `${input.top}px`,
      left: `${input.left}px`,
      height: `${input.height}px`,
      width: `${input.width}px`,
    };
  }

  private hidePrintButton() {
    const printBtn = document.getElementById('print-button');
    printBtn.style.display = 'none';
  }

  private showPrintButton() {
    const printBtn = document.getElementById('print-button');
    printBtn.style.display = 'initial';
  }

  print() {
    this.hidePrintButton();
    window.print();
  }
}
