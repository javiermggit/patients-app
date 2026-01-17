import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Patient } from '../models/patient.model';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private apiUrl = 'http://localhost:5280/api/patients';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Patient[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

create(patient: any): Observable<any> {
  return this.http.post(this.apiUrl, patient);
}
update(id: number, patient: any): Observable<any> {
  return this.http.put(`${this.apiUrl}/${id}`, patient);
}

delete(id: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/${id}`);
}
}
