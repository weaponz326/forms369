import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ListViewService } from 'src/app/services/view/list-view.service';
import { TemplatesService } from 'src/app/services/templates/templates.service';

@Component({
  selector: 'app-list-template-page',
  templateUrl: './list-template-page.component.html',
  styleUrls: ['./list-template-page.component.css']
})
export class ListTemplatePageComponent implements OnInit {
  query: string;
  loading: boolean;
  viewMode: string;
  hasMore: boolean;
  hasError: boolean;
  hasNoData: boolean;
  foundNoForm: boolean;
  templatesList: Array<any>;
  @ViewChild('confirm', { static: false }) modalTemplateRef: TemplateRef<any>;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private listViewService: ListViewService,
    private templatesService: TemplatesService
  ) {
    this.templatesList = [];
    this.viewMode = this.listViewService.getDesiredViewMode();

    this.getAllTemplates();
  }

  ngOnInit() {
  }

  toggleViewMode(mode: string) {
    switch (mode) {
      case 'list':
        this.viewMode = 'list';
        this.listViewService.setDesiredViewMode('list');
        break;
      case 'grid':
        this.viewMode = 'grid';
        this.listViewService.setDesiredViewMode('grid');
        break;
      default:
        break;
    }
  }

  sort(sort_category: string) {
    switch (sort_category) {
      case 'name':
        this.sortByName();
        break;
      default:
        break;
    }
  }

  sortByName() {
    this.templatesList = _.sortBy(this.templatesList, (item) => item.name);
  }

  edit(form: any) {
    this.router.navigateByUrl('templates/edit', { state: { form: form }});
  }

  view(form: any) {
    this.router.navigateByUrl('templates/view', { state: { form: form }});
  }

  openNewForm() {
    this.router.navigateByUrl('templates/create');
  }

  delete(id: string, index: number) {
    this.modalService.open(this.modalTemplateRef, { centered: true }).result.then((result) => {
      if (result == 'delete') {
        this.deleteTemplate(id, index);
      }
    });
  }

  deleteTemplate(id: string, index: number) {
    this.templatesService.deleteTemplate(id).then(
      res => {
        this.templatesList.splice(index, 1);
      },
      err => {}
    );
  }

  getAllTemplates() {
    this.loading = true;
    this.templatesService.getAllTemplates().then(
      res => {
        const templates = res as any;
        if (templates.length > 0) {
          this.hasNoData = false;
          _.forEach(templates, (form) => {
            console.log(form);
            this.templatesList.push(form);
          });
        }
        else {
          this.hasNoData = true;
        }
        this.loading = false;
      },
      err => {
        this.loading = false;
        this.hasError = true;
      }
    );
  }

  search(e: KeyboardEvent) {
    if (e.key == 'Enter') {
      // we need to know whether the user is searching by a form code
      // or the user is searching by a form name.
      // First, check if its a form code.
      console.log(this.query);
      this.hasError = false;
      this.templatesList = [];
      this.loading = true;
      this.templatesService.findTemplate(this.query).then(
        forms => {
          if (forms.length == 0) {
            this.loading = false;
            this.foundNoForm = true;
          }
          else {
            this.loading = false;
            this.foundNoForm = false;
            _.forEach(forms, (form) => {
              this.templatesList.push(form);
            });
          }
        },
        err => {
          this.hasError = true;
          this.loading = false;
        }
      );
    }
    else {
      if (this.foundNoForm && this.query.length == 0) {
        this.hasNoData = true;
        this.foundNoForm = false;
        console.log('hererer');
        this.getAllTemplates();
      }
    }
  }

  loadMore() {}

}
