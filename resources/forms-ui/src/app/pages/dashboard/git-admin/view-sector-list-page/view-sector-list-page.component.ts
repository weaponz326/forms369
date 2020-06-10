import * as _ from 'lodash';
import { Router } from '@angular/router';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { SectorsService } from 'src/app/services/sectors/sectors.service';
import { DateTimeService } from 'src/app/services/date-time/date-time.service';
import { ListViewService } from 'src/app/services/view/list-view.service';

@Component({
  selector: 'app-view-sector-list-page',
  templateUrl: './view-sector-list-page.component.html',
  styleUrls: ['./view-sector-list-page.component.css']
})
export class ViewSectorListPageComponent implements OnInit {

  loading: boolean;
  hasData: boolean;
  viewMode: string;
  hasError: boolean;
  sectorsList: Array<any>;
  loadingModalRef: NgbModalRef;
  @ViewChild('loader', { static: false }) loadingModal: TemplateRef<any>;
  @ViewChild('confirm', { static: false }) confirmModal: TemplateRef<any>;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private dateService: DateTimeService,
    private sectorService: SectorsService,
    private listViewService: ListViewService,
  ) {
    this.sectorsList = [];
    this.viewMode = this.listViewService.getDesiredViewMode();
    this.getAllSectors();
  }

  ngOnInit() {
  }

  showLoadingModal() {
    this.loadingModalRef = this.modalService.open(this.loadingModal, { centered: true });
  }

  hideLoadingModal() {
    this.loadingModalRef.close();
  }

  edit(ev: Event, sector: any) {
    ev.stopPropagation();
    this.router.navigateByUrl('git_admin/edit/sector', { state: { sector: sector } });
  }

  delete(ev: Event, id: string, index: number) {
    ev.stopPropagation();
    this.modalService.open(this.confirmModal, { centered: true }).result.then(
      result => {
        if (result == 'delete') {
          this.showLoadingModal();
          // this.formService.deleteForm(id).then(
          //   ok => {
          //     const res = ok as any;
          //     if (_.toLower(res.message) == 'ok') {
          //       this.allFormsList.splice(index, 1);
          //       this.hideLoadingModal();
          //     }
          //     else {
          //       this.hideLoadingModal();
          //     }
          //   },
          //   err => {
          //     this.hideLoadingModal();
          //   }
          // );
        }
      }
    );
  }

  getAllSectors() {
    this.loading = true;
    this.sectorService.getSectors().then(
      sectors => {
        if (sectors.length != 0) {
          this.hasData = true;
          this.loading = false;
          _.forEach(sectors, (sector) => {
            sector.created_at = this.dateService.safeDateFormat(sector.created_at);
            this.sectorsList.push(sector);
          });
        }
        else {
          this.hasData = false;
          this.loading = false;
        }
      },
      err => {
        this.loading = false;
        this.hasError = true;
      }
    );
  }

}
