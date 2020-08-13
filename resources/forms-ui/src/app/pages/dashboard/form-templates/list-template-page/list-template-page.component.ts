import * as _ from 'lodash';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserTypes } from 'src/app/enums/user-types.enum';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ListViewService } from 'src/app/services/view/list-view.service';
import { TemplatesService } from 'src/app/services/templates/templates.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';

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
  searchOption: string;
  foundNoForm: boolean;
  loadingMore: boolean;
  hasMoreError: boolean;
  ascSortSelected: boolean;
  descSortSelected: boolean;
  templatesList: Array<any>;
  allTemplatesList: Array<any>;
  @ViewChild('confirm', { static: false }) modalTemplateRef: TemplateRef<any>;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private listViewService: ListViewService,
    private localStorage: LocalStorageService,
    private templatesService: TemplatesService
  ) {
    this.query = '';
    this.searchOption = '';
    this.templatesList = [];
    this.allTemplatesList = [];
    this.sortingBy = 'created';
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
      console.log('sorting asc');
      this.templatesList = _.sortBy(this.templatesList, (item) => item.created_at);
    }
    else {
      console.log('sorting desc');
      this.templatesList = _.reverse(_.sortBy(this.templatesList, (item) => item.created_at));
    }
  }

  searchByTemplateName() {
    console.log('search by: ' + this.searchOption);
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

  searchByTemplateCategory() {
    _.forEach(this.allTemplatesList, (template) => {
      if (_.toLower(template.category_name).includes(_.toLower(this.query))) {
        this.templatesList.push(template);
      }
    });
  }

  edit(ev: Event, form: any) {
    ev.stopPropagation();
    this.router.navigateByUrl('templates/edit', { state: { form: form }});
  }

  view(ev: Event, form: any) {
    ev.stopPropagation();
    this.router.navigateByUrl('templates/view', { state: { form: form }});
  }

  openNewForm() {
    this.router.navigateByUrl('templates/create');
  }

  checkIfHasMore() {
    return _.isNull(this.templatesService.nextPaginationUrl) ? false : true;
  }

  delete(ev: Event, id: string, index: number) {
    ev.stopPropagation();
    this.modalService.open(this.modalTemplateRef, { centered: true }).result.then((result) => {
      if (result == 'delete') {
        this.deleteTemplate(id, index);
      }
    });
  }

  import(ev: Event, template: any) {
    ev.stopPropagation();
    this.isGitAdmin
      ? this.router.navigateByUrl('git_admin/setup_form', { state: { template: template }})
      : this.router.navigateByUrl('admin/create/form', { state: { template: template }});
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
        this.hasMore = this.checkIfHasMore();
        if (templates.length > 0) {
          this.hasNoData = false;
          _.forEach(templates, (form) => {
            console.log(form);
            this.templatesList.push(form);
          });
          this.allTemplatesList = this.templatesList;
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
      if (this.query.length != 0) {
        console.log(this.query);
        this.hasMore = false;
        this.hasError = false;
        this.templatesList = [];

        switch (this.searchOption) {
          case 'name':
            this.searchByTemplateName();
            break;
          case 'category':
            this.searchByTemplateCategory();
            break;
          default:
            break;
        }
      }
      else {
        this.templatesList = this.allTemplatesList;
        this.hasMore = this.checkIfHasMore();
        if (this.foundNoForm && this.query.length == 0) {
          this.hasNoData = false;
          this.foundNoForm = false;
          this.templatesList = this.allTemplatesList;
        }
      }
    }
  }

  loadMore() {
    this.loadingMore = true;
    const moreUrl = this.templatesService.nextPaginationUrl;
    this.templatesService.getAllTemplates(moreUrl).then(
      res => {
        this.loadingMore = false;
        this.hasMoreError = false;
        const templates = res as any;
        this.hasMore = this.checkIfHasMore();
        _.forEach(templates, (template) => {
          this.templatesList.push(template);
        });
      },
      err => {
        this.loadingMore = false;
        this.hasMoreError = true;
      }
    );
  }

  retry() {
    this.getAllTemplates();
  }

}
