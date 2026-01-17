import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PatientListComponent } from './patient-list.component';
import { PatientService } from '../../services/patient.service';
import { of } from 'rxjs';

describe('PatientListComponent', () => {
  let component: PatientListComponent;
  let fixture: ComponentFixture<PatientListComponent>;
  let patientServiceMock: any;

  beforeEach(async () => {
    patientServiceMock = {
      getAll: jasmine.createSpy('getAll').and.returnValue(
        of({
          data: [
            {
              patientId: 1,
              firstName: 'Juan',
              lastName: 'Perez',
              documentNumber: '123'
            }
          ]
        })
      )
    };

    await TestBed.configureTestingModule({
      imports: [PatientListComponent],
      providers: [
        { provide: PatientService, useValue: patientServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PatientListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe cargar pacientes', () => {
    expect(component.patients.length).toBe(1);
  });
});
