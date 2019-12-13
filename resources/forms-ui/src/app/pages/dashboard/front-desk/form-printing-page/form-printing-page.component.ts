import { Component, OnInit, Input } from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import { PDFDocumentProxy } from 'ng2-pdf-viewer';
import { PDFAnnotationData, PDFPageProxy, PDFProgressData } from 'pdfjs-dist';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-form-printing-page',
  templateUrl: './form-printing-page.component.html',
  styleUrls: ['./form-printing-page.component.css']
})
export class FormPrintingPageComponent implements OnInit {

  form: any;
  pdfSrc: string;
  dpiRatio: any;
  loading: boolean;
  hasError: boolean;
  myForm: FormGroup;
  inputList: Input[];
  clientFormDetails: any[];

  constructor(private _fb: FormBuilder) {
    this.inputList = [];
    this.dpiRatio = 96 / 72;
    this.pdfSrc = 'https://forms369.com/EDITED_TAX_RELIEF_APPLICATION_FORM.pdf';
    this.clientFormDetails = [];
    this.form = window.history.state.form;
    window.onafterprint = () => {
      console.log('print window closed');
      this.showPrintButton();
    };
  }

  ngOnInit() {
    this.myForm = this._fb.group({});
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
    return moment().format('DD MMM YYYY');
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
          .filter(a => a .subtype === 'Widget') // get the form field annotation only.
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
