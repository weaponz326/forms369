import { Component, OnInit, Input } from '@angular/core';
import { PDFDocumentProxy } from 'ng2-pdf-viewer';
import { PDFAnnotationData, PDFPageProxy } from 'pdfjs-dist';
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
  myForm: FormGroup;
  inputList: Input[];

  constructor(private _fb: FormBuilder) {
    this.inputList = [];
    this.dpiRatio = 96 / 72;
    this.pdfSrc = 'https://forms369.com/test.pdf';
  }

  ngOnInit() {
    this.myForm = this._fb.group({});
  }

  onProgress() {
    this.loading = true;
  }

  private createInput(annotation: any, rect: number[] = null) {
    const formControl = new FormControl(annotation.buttonValue || '');

    const input = new Input();
    input.name = annotation.fieldName;

    if (annotation.fieldType === 'Tx') {
        if (annotation.fieldName == 'surname') {
          input.type = 'text';
          input.value = 'Addo';
        }
        else {
          input.type = 'text';
          input.value = 'Ralph Marvin';
        }
    }

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
    if (annotation.fieldName == 'surname') {
      console.log('found');
      annotation.fieldValue = 'Ralph';
    }
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

  public getInputPosition(input: any): any {
    return {
        top: `${input.top}px`,
        left: `${input.left}px`,
        height: `${input.height}px`,
        width: `${input.width}px`,
    };
  }

}
