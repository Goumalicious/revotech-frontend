import {Component, TemplateRef} from '@angular/core';
import { NgbToast } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../toast-service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-toasts',
  templateUrl: 'toasts-container.component.html',
  imports: [NgbToast, NgFor, NgIf],
  standalone: true,
  host: {'class': 'toast-container position-fixed top-0 end-0 p-3', 'style': 'z-index: 1200'}
})
export class ToastsContainerComponent {
  constructor(public toastService: ToastService) {}

  isTemplate(toast) { return toast.textOrTpl instanceof TemplateRef; }
}
