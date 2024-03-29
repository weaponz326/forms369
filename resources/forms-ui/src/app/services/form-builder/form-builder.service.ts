import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EndpointService } from '../endpoint/endpoint.service';
import { SectionsService } from '../sections/sections.service';

@Injectable({
  providedIn: 'root'
})
export class FormBuilderService {

  headers: HttpHeaders;
  disableClassName: any;
  private formFieldClassName: string;

  constructor(private http: HttpClient, private endpointService: EndpointService, private sectionService: SectionsService) {
    this.headers = this.endpointService.headers();
    this.formFieldClassName = 'form-control';
    this.disableClassName = {
      className: {
        style: 'pointer-events: none'
      }
    };
  }

  disableDefaultFormControls() {
    return [
      'autocomplete',
      'button',
      'hidden',
      'number',
    ];
  }

  handleFieldsTypeAttrs() {
    return {
      text: this.disableClassName,
      file: this.disableClassName,
      button: this.disableClassName,
      hidden: this.disableClassName,
      number: this.disableClassName,
      textarea: this.disableClassName,
      autocomplete: this.disableClassName,
    };
  }

  disableFieldAttrs() {
    return {
      'header': [
        'access',
        'className'
      ],
      'autocomplete': [
        'access',
        'className',
        'placeholder',
      ],
      'button': [
        'style',
        'value',
        'access',
        'subtype',
        'className'
      ],
      'checkbox-group': [
        'other',
        'toggle',
        'access',
        'className'
      ],
      'file': [
        'access',
        'subtype',
        'className',
        'placeholder',
      ],
      'hidden': [
      ],
      'number': [
        'value',
        'access',
        'className',
        'placeholder'
      ],
      'radio-group': [
        'other',
        'toggle',
        'access',
        'className'
      ],
      'select': [
        'access',
        'className',
        'placeholder'
      ],
      'paragraph': [
        'access',
        'subtype',
        'className'
      ],
      'textarea': [
        'value',
        'access',
        'subtype',
        'className',
        'placeholder'
      ],
      'text': [
        'value',
        'access',
        'subtype',
        'className',
        'placeholder'
      ]
    };
  }

  disableAllFieldAttrs() {
    return {
      'header': [
        'access',
        'className'
      ],
      'autocomplete': [
        'access',
        'className',
        'placeholder',
      ],
      'button': [
        'style',
        'value',
        'access',
        'subtype',
        'className'
      ],
      'checkbox-group': [
        'other',
        'toggle',
        'access',
        'className'
      ],
      'file': [
        'access',
        'subtype',
        'className',
        'placeholder',
      ],
      'hidden': [
      ],
      'number': [
        'value',
        'access',
        'className',
        'placeholder'
      ],
      'radio-group': [
        'other',
        'toggle',
        'access',
        'className'
      ],
      'select': [
        'access',
        'className',
        'placeholder'
      ],
      'paragraph': [
        'access',
        'subtype',
        'className'
      ],
      'textarea': [
        'name',
        'value',
        'access',
        'subtype',
        'className',
        'placeholder'
      ],
      'text': [
        'name',
        'value',
        'access',
        'subtype',
        'className',
        'placeholder'
      ]
    };
  }

  disableSectionFormFields() {
    return [
      'header',
      'autocomplete',
      'button',
      'checkbox-group',
      'file',
      'hidden',
      'number',
      'radio-group',
      'select',
      'paragraph',
      'textarea',
      'text',
      'date'
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
            required: true,
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
            required: true,
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
            required: true,
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
            required: true,
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
            name: 'email',
            label: 'Email Address',
            required: true,
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
            required: true,
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
            required: true,
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
            required: true,
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
            required: true,
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
            required: true,
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
            required: true,
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
            required: true,
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
            required: true,
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
            required: true,
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
            required: true,
            values: [
              {
                label: 'Male',
                value: 'Male',
                selected: false,
              },
              {
                label: 'Female',
                value: 'Female',
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
            required: true,
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
            required: true,
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
            required: true,
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
            required: true,
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
            required: true,
            name: 'amount',
            label: 'Amount',
            className: this.formFieldClassName
          }
        ]
      }
    ];
  }

  generateFormFieldsBySections(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      // lets get all sections first.
      const form_fields = [];
      this.sectionService.getAllSections().then(
        res => {
          console.log('res: ' + JSON.stringify(res));
          _.forEach(res, (section) => {
            form_fields.push({
              icon: '*',
              label: section.heading,
              fields: section.form_fields
            });
          });
          resolve(form_fields);
        },
        err => {
          console.log('err: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  generateSectionAndDefaultFormFields(): Promise<any> {
    return new Promise((resolve, reject) => {
      const allFormFields = [];
      this.generateFormFieldsBySections().then(
        fields => {
          _.forEach(fields, (field) => {
            allFormFields.push(field);
          });

          const defaultFormFields = this.generateFormFields();
          _.forEach(defaultFormFields, (defaultField) => {
            allFormFields.push(defaultField);
          });

          resolve(allFormFields);
        },
        error => {
          console.log('error: ' + JSON.stringify(error));
          reject(error);
        }
      );
    });
  }

  getClientProvidedData(client_id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/getClientsDetails/' + client_id;
      console.log(url);
      this.http.get(url, { headers: this.headers }).subscribe(
        (res: any) => {
          console.log('client_data: ' + JSON.stringify(res));
          const client = res.client;
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
        if (data.userData.length == 1) {
          user_form_data[data.name] = data.userData[0];
          console.log('___userData__', data.userData[0]);
        }
        else {
          const values = [];
          _.forEach(data.userData, (value) => {
            values.push(value);
            user_form_data[data.name] = values;
          });
        }
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
    const code = Math.random().toString(36).substr(2, 5).toUpperCase();
    if (/\d/.test(code)) {
      return code;
    }
    else {
      return this.generateUniqueFormCode();
    }
  }

  disableFormFields(form: any[]) {
    const inputFields = document.querySelectorAll('input');
    inputFields.forEach(input => {
      input.disabled = true;
    });
  }
}

