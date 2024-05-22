import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbAlert, NgbToast } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../data.service';
import { NgIf } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '../toast-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgbAlert],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  formGroup = new FormGroup({username: new FormControl(null, Validators.required), password: new FormControl(null, Validators.required)})
  isLoggedIn: boolean = false;
  errorText: string;

  constructor (public activeModal: NgbActiveModal, private dataService: DataService, private toastService: ToastService) {}

  ngOnInit(): void {
    this.isLoggedIn = this.dataService.isLoggedIn();
  }

  onLogin(): void {
    this.errorText = null;
    this.dataService.loginUser(this.formGroup.value.username, this.formGroup.value.password).then(user => {
      this.isLoggedIn = true;
      this.activeModal.close();
      this.toastService.showSuccess('Succesfully Logged In')
    }).catch((error: Error) => {
      this.errorText = error.message;
    });
  }
}
