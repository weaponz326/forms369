import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ListViewService } from 'src/app/services/view/list-view.service';
import { TemplatesService } from 'src/app/services/templates/templates.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';
import { UserTypes } from 'src/app/enums/user-types.enum';

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
  sortingBy: string;
  hasError: boolean;
  hasNoData: boolean;
  isGitAdmin: boolean;
  sortingOrder: string;
  foundNoForm: boolean;
  ascSortSelected: boolean;
  descSortSelected: boolean;
  templatesList: Array<any>;
  @ViewChild('confirm', { static: false }) modalTemplateRef: TemplateRef<any>;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private listViewService: ListViewService,
    private localStorage: LocalStorageService,
    private templatesService: TemplatesService
  ) {
    this.templatesList = [];
    this.sortingOrder = this.listViewService.getSortOrder();
    this.viewMode = this.listViewService.getDesiredViewMode();
    this.isGitAdmin = this.localStorage.getUser().usertype == UserTypes.GitAdmin ? true : false;

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
        this.sortingBy = 'name';
        this.sortByName(this.sortingOrder);
        break;
      case 'created':
        this.sortingBy = 'created';
        this.sortByCreatedDate(this.sortingOrder);
        break;
      default:
        break;
    }
  }

  sortOrder(order: string) {
    switch (order) {
      case 'asc':
        this.sort(this.sortingBy);
        this.sortingOrder = order;
        this.ascSortSelected = true;
        this.descSortSelected = false;
        this.listViewService.setSortOrder(order);
        break;
      case 'desc':
        this.sort(this.sortingBy);
        this.sortingOrder = order;
        this.ascSortSelected = false;
        this.descSortSelected = true;
        this.listViewService.setSortOrder(order);
        break;
      default:
        break;
    }
  }

  sortByName(order: string) {
    if (order == 'asc') {
      console.log('sorting asc');
      this.templatesList = _.sortBy(this.templatesList, (item) => item.name);
    }
    else {
      console.log('sorting desc');
      this.templatesList = _.reverse(_.sortBy(this.templatesList, (item) => item.name));
    }
  }

  sortByCreatedDate(order: string) {
    if (order == 'asc') {
      this.templatesList = _.sortBy(this.templatesList, (item) => item.created_at);
    }
    else {
      this.templatesList = _.reverse(_.sortBy(this.templatesList, (item) => item.created_at));
    }
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

  import(template: any) {
    this.router.navigateByUrl('admin/create/form', { state: { template: template }});
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
        this.hasNoData = true;
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

  retry() {
    this.getAllTemplates();
  }

}
