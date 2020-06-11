import * as _ from 'lodash';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SectorsService } from 'src/app/services/sectors/sectors.service';

@Component({
  selector: 'app-create-sector-page',
  templateUrl: './create-sector-page.component.html',
  styleUrls: ['./create-sector-page.component.css']
})
export class CreateSectorPageComponent implements OnInit {

  form: FormGroup;
  loading: boolean;
  created: boolean;
  submitted: boolean;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private sectorService: SectorsService
  ) {}

  ngOnInit() {
    this.buildForm();
  }

  public get f() {
    return this.form.controls;
  }

  buildForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
    });
  }

  create() {
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
