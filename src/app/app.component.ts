import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { Island } from '../models/island.model';
import { NgFor, NgIf } from '@angular/common';
import { NgbCollapse, NgbModal, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Observable, debounceTime, distinctUntilChanged, map } from 'rxjs';
import { FormsModule, NgModel } from '@angular/forms';
import { DataService } from '../data.service';
import { LoginComponent } from '../login/login.component';
import { ToastsContainerComponent } from '../toasts-container/toasts-container.component';
import { ToastService } from '../toast-service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgFor, NgIf, NgbTypeahead, FormsModule, RouterLink, NgbCollapse, RouterLinkActive, ToastsContainerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  title = 'revotech-frontend';
  user: Parse.User;
  searchText: string;
  isMenuCollapsed: any;

  constructor(private dataService: DataService, private router: Router, private modalService: NgbModal, private toastService: ToastService) {
    this.dataService.user.subscribe((user) => {
      this.user = user;
    });
  }

  formatter(result: Island) {
    if (!result?.order) {
      return null;
    }
    return result.title;
  };

  islandSelected(evt: any) {
    if (!evt?.item?.order) {
      return;
    }
    this.router.navigate(['island', evt.item.order]);
  }

  openLoginModal() {
    const modalRef = this.modalService.open(LoginComponent);
    modalRef.componentInstance.name = 'Login';
  }

  onLogout(): void {
    this.dataService.logoutUser().then(() => {
      this.toastService.showSuccess('Log Out - Successful')
    }).catch(error => {
      this.toastService.showError('Error Logging Out')
    });
  }

  search = function (text$: Observable<string>): Observable<Island[]> {
    return text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(function (term) {
        const regex = new RegExp("\\b" + term + "\\b", "gi");
        const dataArr = this.dataService.islandsArray.value.filter((island) => island.description.toLowerCase().match(regex)?.length || island.title.toLowerCase().includes(term));
        return term.length < 2 ? [] : dataArr?.length ? dataArr : [{ title: 'No results found' }]
      }.bind(this))
    );
  }.bind(this);
}
