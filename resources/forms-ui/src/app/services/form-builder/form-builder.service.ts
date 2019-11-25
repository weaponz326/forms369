import * as _ from 'lodash';
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
            name: 'firstname',
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
            name: 'lastname',
            label: 'Last Name',
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
            name: 'middle-name',
            label: 'Middle Name',
            className: this.formFieldClassName
          }
        ]
      },
      {
        icon: 'F',
        label: 'Full Name',
        fields: [
          {
            type: 'text',
            name: 'full-name',
            label: 'Full Name',
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
            name: 'email-address',
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
            name: 'phone-number',
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
            name: 'age',
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
            name: 'd-o-b',
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
            name: 'p-o-b',
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
            name: 'country',
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
            name: 'city',
            label: 'City',
            className: this.formFieldClassName
          }
        ]
      },
      {
        icon: 'P',
        label: 'P.O Box',
        fields: [
          {
            type: 'text',
            name: 'p-o-box',
            label: 'P.O Box',
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
            name: 'house-address',
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
            name: 'street-name',
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
            name: 'gender',
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
            name: 'file',
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
            name: 'pin-code',
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
            name: 'driver-license',
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
            name: 'voter-id',
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
            name: 'amount',
            label: 'Amount',
            className: this.formFieldClassName
          }
        ]
      }
    ];
  }

  getUserFilledData(client_id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/getClientsDetails/' + client_id;
      console.log(url);
      this.http.get(url, { headers: this.headers }).subscribe(
        (res: any) => {
          const client = res.client[0];
          resolve(client);
        },
        err => {
          reject(err);
        }
      );
    });
  }

  getFormUserData(form_data: Array<any>) {
    const user_form_data = {};
    _.forEach(form_data, (data) => {
      if (!_.isEmpty(data.userData)) {
        user_form_data[data.name] = data.userData[0];
      }
    });

    return JSON.stringify(user_form_data);
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

  disableFormFields(form: any[]) {
    const inputFields = document.querySelectorAll('input');
    inputFields.forEach(input => {
      input.disabled = true;
    });
  }
}

