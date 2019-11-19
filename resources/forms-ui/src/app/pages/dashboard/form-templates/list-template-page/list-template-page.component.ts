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

  loading: boolean;
  viewMode: string;
  hasError: boolean;
  hasNoData: boolean;
  templatesList: Array<any>;
  @ViewChild('content', { static: false }) modalTemplateRef: TemplateRef<any>;

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

  loadMore() {}

}
