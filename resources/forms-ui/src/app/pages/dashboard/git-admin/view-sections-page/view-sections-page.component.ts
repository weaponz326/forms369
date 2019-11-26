import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { ListViewService } from 'src/app/services/view/list-view.service';
import { SectionsService } from 'src/app/services/sections/sections.service';

@Component({
  selector: 'app-view-sections-page',
  templateUrl: './view-sections-page.component.html',
  styleUrls: ['./view-sections-page.component.css']
})
export class ViewSectionsPageComponent implements OnInit {
  loading: boolean;
  hasMore: boolean;
  viewMode: string;
  hasError: boolean;
  hasNoData: boolean;
  filterState: string;
  sectionsList: Array<any>;

  constructor(
    private router: Router,
    private sectionService: SectionsService,
    private listViewService: ListViewService
  ) {
    this.sectionsList = [];
    this.viewMode = this.listViewService.getDesiredViewMode();

    this.getAllFormSections();
  }

  ngOnInit() {
    this.filterState = 'all';
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
      case 'created':
        this.sortByCreated();
        break;
      case 'heading':
        this.sortByHeading();
        break;
      default:
        break;
    }
  }

  sortByCreated() {
    this.sectionsList = _.sortBy(this.sectionsList, (item) => item.created_at);
  }

  sortByHeading() {
    this.sectionsList = _.sortBy(this.sectionsList, (item) => item.heading);
  }

  edit(section: any) {
    this.router.navigateByUrl('git_admin/edit/section', { state: { form: section }});
  }

  view(section: any) {
    this.router.navigateByUrl('/git_admin/details/form', { state: { form: section } });
  }

  openNew() {
    this.router.navigateByUrl('/git_admin/create/section');
  }

  delete(id: string) { }

  getAllFormSections() {
    this.loading = true;
    this.sectionService.getAllSections().then(
      res => {
        const sections = res as any;
        if (sections.length > 0) {
          this.hasNoData = false;
          _.forEach(sections, (form) => {
            this.sectionsList.push(form);
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

  loadMore() { }

}
