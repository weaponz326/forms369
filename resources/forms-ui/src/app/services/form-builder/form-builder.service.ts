import { Injectable } from '@angular/core';
import { Forms } from 'src/app/models/forms.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EndpointService } from '../endpoint/endpoint.service';

@Injectable({
  providedIn: 'root'
})
export class FormBuilderService {

  headers: HttpHeaders;
  private formFieldClassName: string;

  constructor(private http: HttpClient, private endpointService: EndpointService) {
    this.headers = this.endpointService.headers();
    this.formFieldClassName = 'form-control';
  }

  disableDefaultFormControls() {
    return [
      'autocomplete',
      'button',
      'checkbox-group',
      'date',
      'file',
      'hidden',
      'number',
      'radio-group',
      'select'
    ];
  }

  generateFormFields() {
    return [
      {
        icon: 'F',
        label: 'First Name',
        fields: [
          {
            type: 'text',
            label: 'First Name',
            className: this.formFieldClassName
          }
        ]
      },
      {
        icon: 'L',
        label: 'Last Name',
        fields: [
          {
            type: 'text',
            label: 'First Name',
            className: this.formFieldClassName
          }
        ]
      },
      {
        icon: 'M',
        label: 'Middle Name',
        fields: [
          {
            type: 'text',
            label: 'Middle Name',
            className: this.formFieldClassName
          }
        ]
      },
      {
        icon: 'E',
        label: 'Email Address',
        fields: [
          {
            type: 'text',
            label: 'Email Address',
            className: this.formFieldClassName
          }
        ]
      },
      {
        icon: 'P',
        label: 'Phone Number',
        fields: [
          {
            type: 'text',
            label: 'Phone Number',
            className: this.formFieldClassName
          }
        ]
      },
      {
        icon: 'A',
        label: 'Age',
        fields: [
          {
            type: 'text',
            label: 'Age',
            className: this.formFieldClassName
          }
        ]
      },
      {
        icon: 'D',
        label: 'Date Of Birth',
        fields: [
          {
            type: 'date',
            label: 'Date of Birth',
            className: this.formFieldClassName
          }
        ]
      },
      {
        icon: 'P',
        label: 'Place Of Birth',
        fields: [
          {
            type: 'text',
            label: 'Place of Birth',
            className: this.formFieldClassName
          }
        ]
      },
      {
        icon: 'C',
        label: 'Country',
        fields: [
          {
            type: 'text',
            label: 'Country',
            className: this.formFieldClassName
          }
        ]
      },
      {
        icon: 'C',
        label: 'City',
        fields: [
          {
            type: 'text',
            label: 'City',
            className: this.formFieldClassName
          }
        ]
      },
      {
        icon: 'H',
        label: 'House Address',
        fields: [
          {
            type: 'text',
            label: 'House Address',
            className: this.formFieldClassName
          }
        ]
      },
      {
        icon: 'S',
        label: 'Street Name',
        fields: [
          {
            type: 'text',
            label: 'Street Name',
            className: this.formFieldClassName
          }
        ]
      },
      {
        icon: 'G',
        label: 'Gender',
        fields: [
          {
            type: 'radio-group',
            label: 'Gender',
            values: [
              {
                label: 'Male',
                value: 'male',
                selected: false,
              },
              {
                label: 'Female',
                value: 'female',
                selected: false
              }
            ]
          }
        ]
      },
      {
        icon: 'P',
        label: 'Photo',
        fields: [
          {
            type: 'file',
            label: 'Photo',
            className: this.formFieldClassName
          }
        ]
      },
      {
        icon: 'C',
        label: 'PIN Code',
        fields: [
          {
            type: 'text',
            label: 'Pin Code',
            maxLength: 6,
            className: this.formFieldClassName
          }
        ]
      },
      {
        icon: 'D',
        label: 'Driver\'s License',
        fields: [
          {
            type: 'text',
            label: 'Driver\s License',
            className: this.formFieldClassName
          }
        ]
      },
      {
        icon: 'V',
        label: 'Voter\'s ID No.',
        fields: [
          {
            type: 'text',
            label: 'Voter\s ID No.',
            className: this.formFieldClassName
          }
        ]
      },
      {
        icon: 'A',
        label: 'Amount',
        fields: [
          {
            type: 'text',
            label: 'Amount',
            className: this.formFieldClassName
          }
        ]
      }
    ];
  }

  /**
   * Generates an alphanumeric string which is 6 in length.
   * NOTE: This generated code must include a number.
   *
   * @returns {string}
   * @memberof FormBuilderService
   */
  generateUniqueFormCode(): string {
    const code = Math.random().toString(36).substr(2, 6).toUpperCase();
    if (/\d/.test(code)) {
      return code;
    }
    else {
      this.generateUniqueFormCode();
    }
  }
}
