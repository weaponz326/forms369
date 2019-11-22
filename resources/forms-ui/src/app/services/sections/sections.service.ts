import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EndpointService } from '../endpoint/endpoint.service';

@Injectable({
  providedIn: 'root'
})
export class SectionsService {

  headers: HttpHeaders;
  constructor(private http: HttpClient, private endpointService: EndpointService) {
    this.headers = this.endpointService.headers();
  }

  createSection(section: any): Promise<any> {
    return new Promise((resolve, reject) => {});
  }

  editSection(section_id: string, section: any): Promise<any> {
    return new Promise((resolve, reject) => {});
  }

  getSection(section_id: string): Promise<any> {
    return new Promise((resolve, reject) => {});
  }

  getAllSections(): Promise<any> {
    return new Promise((resolve, reject) => {});
  }

  deleteSection(section_id: string): Promise<any> {
    return new Promise((resolve, reject) => {});
  }
}
