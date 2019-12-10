import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import * as _ from 'lodash';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientService } from 'src/app/services/client/client.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';
import { FormBuilderService } from 'src/app/services/form-builder/form-builder.service';
import { SectionsService } from 'src/app/services/sections/sections.service';

@Component({
  selector: 'app-client-profile-page',
  templateUrl: './client-profile-page.component.html',
  styleUrls: ['./client-profile-page.component.css']
})
export class ClientProfilePageComponent implements OnInit {
  user: any;
  clientData: any;
  hasData: boolean;
  loading: boolean;
  created: boolean;
  updating: boolean;
  allUserData: any;
  hasError: boolean;
  alert_title: string;
  isConnected: boolean;
  alert_message: string;
  allFormSections: Array<any>;
  @ViewChild('updated', { static: false }) updatedDialog: TemplateRef<any>;
  @ViewChild('confirm', { static: false }) confirmDialog: TemplateRef<any>;

  constructor(
    private modalService: NgbModal,
    private clientService: ClientService,
    private sectionService: SectionsService,
    private formBuilder: FormBuilderService,
    private localStorage: LocalStorageService
  ) {
    this.user = this.localStorage.getUser();
    console.log('user_id: ' + this.user.id);
    this.allFormSections = [];
    // this.getAllClientData();
  }

  ngOnInit() {
    this.getAllFormSections();
  }

  showUpdatedDialog(isSuccess: boolean) {
    if (isSuccess) {
      this.alert_title = 'Profile Updated Successfully';
      this.alert_message = 'You have successfully updated your account data';
      this.modalService.open(this.updatedDialog, { centered: true });
    }
    else {
      this.alert_title = 'Profile Update Failed';
      this.alert_message = 'An error occured updating your account data. Our servers may be down or you dont have an active internet connection.';
      this.modalService.open(this.updatedDialog, { centered: true });
    }
  }

  getAllClientData() {
    this.loading = true;
    this.formBuilder.getUserFilledData(_.toString(this.user.id)).then(
      res => {
        console.log('user_data: ' + JSON.stringify(res));
        if (res.length > 0) {
          this.hasData = true;
          this.loading = false;
          this.allUserData = res[0].client_details[0];
          console.log('details: ' + this.allUserData);
          setTimeout(() => {
            this.clientService.fillClientProfileData(this.allFormSections, res[0].client_details[0]);
          }, 1000);
        }
        else {
          this.hasData = false;
          this.loading = false;
        }
      },
      err => {
        console.log('error: ' + JSON.stringify(err));
        this.loading = false;
        this.hasError = true;
      }
    );
  }

  transformToRealText(text: string) {
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

  getAllClientProfileData() {
    const user_form_data = {};
    const allElements = document.querySelectorAll('input');
    _.forEach(allElements, (element) => {
      user_form_data[element.id] = element.value;
    });

    return JSON.stringify(user_form_data);
  }

  getAllFormSections() {
    this.loading = true;
    this.sectionService.getAllSections().then(
      res => {
        if (res.length != 0) {
          this.hasData = true;
          this.loading = false;
          _.forEach(res, (section) => {
            this.allFormSections.push(section);
          });
          this.getAllClientData();
        }
        else {
          this.hasData = false;
          this.loading = false;
        }
      },
      err => {
        this.loading = false;
      }
    );
  }

  updateData() {
    this.updating = true;
    console.log('is submitting');
    const updatedUserData = this.getAllClientProfileData();
    this.clientService.editProfile(this.user.id, JSON.parse(updatedUserData)).then(
      res => {
        const response = res as any;
        if (_.toLower(response.message) == 'ok') {
          this.updating = false;
          this.showUpdatedDialog(true);
        }
        else {
          this.updating = false;
          this.showUpdatedDialog(false);
        }
      },
      err => {
        this.updating = false;
        this.showUpdatedDialog(false);
      }
    );
  }

  save() {
    this.updateData();
  }

  cancel() {
    this.modalService.open(this.confirmDialog, { centered: true }).result.then(
      result => {
        if (result == 'yes') {
          this.discardChanges();
        }
      }
    );
  }

  discardChanges() {
    this.getAllClientData();
  }

  retry() {
    this.getAllClientData();
  }

  returnZero() {
    return 0;
  }

}
