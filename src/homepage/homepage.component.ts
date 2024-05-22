import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { DataService } from '../data.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Island } from '../models/island.model';
import { RouterLink } from '@angular/router';
import { EditIslandComponent } from '../app/edit-island/edit-island.component';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [NgFor, RouterLink, AsyncPipe, NgIf],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent {
  user: Parse.User;
  magnifiedIsland: Island;

  constructor(public dataService: DataService, private modal: NgbModal,) { 
    this.dataService.user.subscribe((user) => {
      this.user = user;
    });
  }

  openImage(islandReference: Island, content: any) {
    this.magnifiedIsland = islandReference;
    this.modal.open(content, { size: 'xl' });
  }

  editIslandData(islandReference: Island) {
    const modalRef = this.modal.open(EditIslandComponent, { size: 'xl' });
    modalRef.componentInstance.name = 'Edit Island';
    modalRef.componentInstance.islandData = islandReference;
  }
}
