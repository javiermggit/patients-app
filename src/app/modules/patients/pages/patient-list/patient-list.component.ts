import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../models/patient.model';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-patient-list',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './patient-list.component.html',
    styleUrls: ['./patient-list.component.css']
})
export class PatientListComponent implements OnInit {

    patients: Patient[] = [];
    showForm: boolean = false;
    isEditMode: boolean = false;
    editingPatientId: number | null = null;

    form: any = {
        firstName: '',
        lastName: '',
        documentType: '',
        documentNumber: ''
    };
    searchText: string = '';

    constructor(
        private patientService: PatientService,
        @Inject(PLATFORM_ID) private platformId: Object,
        private cdr: ChangeDetectorRef
    ) { }

    get patientsFiltered(): Patient[] {
        if (!this.searchText) {
            return this.patients;
        }

        const text = this.searchText.toLowerCase();

        return this.patients.filter(p =>
            p.firstName.toLowerCase().includes(text) ||
            p.lastName.toLowerCase().includes(text) ||
            p.documentNumber.includes(text)
        );
    }


    ngOnInit(): void {

        this.patientService.getAll().subscribe({
            next: (response: any) => {
                console.log('RESPUESTA COMPLETA:', response);

                if (Array.isArray(response?.data)) {
                    this.patients = response.data;
                } else {
                    this.patients = [];
                }

                console.log('PACIENTES FINALES:', this.patients);
                console.log('CANTIDAD:', this.patients.length);

                //ACTUALIZACION
                this.cdr.detectChanges();
            },
            error: err => console.error('ERROR API:', err)
        });
    }

    editPatient(patient: Patient): void {

        this.isEditMode = true;
        this.editingPatientId = patient.patientId;
        this.showForm = true;

        this.form = {
            firstName: patient.firstName,
            lastName: patient.lastName,
            documentType: patient.documentType,
            documentNumber: patient.documentNumber,
            phoneNumber: patient.phoneNumber,
            email: patient.email,
            birthDate: patient.birthDate?.substring(0, 10)
        };
    }


   deletePatient(patient: Patient): void {

  const confirmed = confirm(
    `¿Está seguro de eliminar al paciente ${patient.firstName} ${patient.lastName}?`
  );

  if (!confirmed) return;

  this.patientService.delete(patient.patientId!).subscribe({
    next: () => {
      alert('Paciente eliminado correctamente');
      this.reloadPatients();
    },
    error: () => {
      alert('Error al eliminar el paciente');
    }
  });
}


    savePatient(formRef: any): void {

        //  Validar documento duplicado
        const duplicated = this.patients.some(p =>
            p.documentNumber === this.form.documentNumber &&
            p.patientId !== this.editingPatientId
        );

        if (duplicated) {
            alert('Ya existe un paciente con este número de documento');
            return;
        }

        // EDITAR
        if (this.isEditMode && this.editingPatientId) {

            this.patientService.update(this.editingPatientId, this.form).subscribe({
                next: () => {
                    alert('Paciente actualizado correctamente');
                    this.afterSave(formRef);
                },
                error: () => alert('Error al actualizar paciente')
            });

        }
        //  CREAR
        else {

            this.patientService.create(this.form).subscribe({
                next: () => {
                    alert('Paciente creado correctamente');
                    this.afterSave(formRef);
                },
                error: () => alert('Error al crear paciente')
            });

        }
    }

    afterSave(formRef: any): void {
        this.showForm = false;
        this.isEditMode = false;
        this.editingPatientId = null;

        formRef.resetForm();
        this.resetForm();
        this.reloadPatients();
    }

    cancelForm(): void {
        this.showForm = false;
        this.isEditMode = false;
        this.editingPatientId = null;
        this.resetForm();
    }

    documentExists(documentNumber: string): boolean {
        return this.patients.some(
            p => p.documentNumber === documentNumber
        );
    }

    resetForm(): void {
        this.form = {
            firstName: '',
            lastName: '',
            documentType: '',
            documentNumber: ''
        };
    }

   reloadPatients(): void {
  this.patientService.getAll().subscribe({
    next: (response: any) => {
      this.patients = Array.isArray(response?.data) ? response.data : [];
      this.cdr.detectChanges();
    },
    error: err => console.error(err)
  });
}



}
