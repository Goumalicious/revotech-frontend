import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../../data.service';
import { ToastService } from '../../toast-service';
import { Island } from '../../models/island.model';
import { NgIf } from '@angular/common';
import Parse from 'parse';

@Component({
  selector: 'app-edit-island',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgbAlert],
  templateUrl: './edit-island.component.html',
  styleUrl: './edit-island.component.scss'
})
export class EditIslandComponent {
  errorText: string;
  busy: boolean;
  isLoggedIn: boolean = false;
  islandData: Island;
  islandDataFormGroup = new FormGroup({ title: new FormControl(null), short_info: new FormControl(null), description: new FormControl(null), url: new FormControl(null), })

  constructor(public activeModal: NgbActiveModal, private dataService: DataService, private toastService: ToastService) { }
  image: any;

  ngOnInit(): void {
    if (this.islandData?.image_file) {
      this.image = { link: this.islandData.image_file?._url };
    }
    this.isLoggedIn = this.dataService.isLoggedIn();
    this.islandDataFormGroup.patchValue({
      title: this.islandData.title,
      short_info: this.islandData.short_info,
      description: this.islandData.description,
      url: this.islandData.url,
    })
  }
  async imageChanged(evt: Event) {
    const input = evt.target as HTMLInputElement;
    const list = input?.files;
    this.errorText = null;
    if (list?.length) {
      const reader = new FileReader();
      const file = list[0];
      if (file.size > 5 * 1024 * 1024) {
        this.errorText = 'Photo cannot be larger than 5 MB';
        return;
      }
      reader.onload = (_event: any) => {
        this.image = {
          link: _event.target.result,
          file: file,
          name: file.name
        };
      };
      reader.readAsDataURL(file);
    } else {
      this.image = undefined;
    }
  }
  async onSave() {
    const dataToSave = { ...this.islandDataFormGroup.value } as Record<string, any>;
    if (this.image?.file) {
      dataToSave.image_file = new Parse.File(this.image.file.name, this.image.file);
    }
    this.busy = true;
    const updatedObject = await this.dataService.saveIsland(this.islandData.objectId, dataToSave).catch((err) => {
      this.toastService.showError('Error in Updating Island Information');
      return null;
    });
    this.busy = false;
    if (!updatedObject) {
      return;
    }
    this.toastService.showSuccess('Island Information Updated');
    this.activeModal.close();
    this.dataService.getAllIslands();
  }
}
