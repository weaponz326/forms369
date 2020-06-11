import * as _ from 'lodash';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SectorsService } from 'src/app/services/sectors/sectors.service';

@Component({
  selector: 'app-edit-sector-page',
  templateUrl: './edit-sector-page.component.html',
  styleUrls: ['./edit-sector-page.component.css']
})
export class EditSectorPageComponent implements OnInit {

  sector: any;
  form: FormGroup;
  loading: boolean;
  created: boolean;
  submitted: boolean;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private sectorService: SectorsService
  ) {
    this.sector = window.history.state.sector;
  }

  ngOnInit() {
    this.buildForm();
  }

  public get f() {
    return this.form.controls;
  }

  buildForm() {
    this.form = this.fb.group({
      name: [this.sector.name, Validators.required],
    });
  }

  edit() {
    this.submitted = true;
    if (this.form.valid) {
      this.form.disable();
      this.loading = true;
      this.sectorService.createSector(this.f.name.value).then(
        ok => {
          if (ok) {
            this.form.enable();
            this.created = true;
            this.loading = false;
          }
          else {
            this.form.enable();
            this.created = false;
            this.loading = false;
          }
        },
        err => {
          this.form.enable();
          this.created = false;
          this.loading = false;
          console.log(JSON.stringify(err));
        }
      );
    }
  }

  ok() {
    this.router.navigateByUrl('git_admin/lists/sector');
  }

  reload() {
    this.created = false;
    this.submitted = false;
    this.f.name.setValue('');
  }

  cancel() {
    this.ok();
  }

}
