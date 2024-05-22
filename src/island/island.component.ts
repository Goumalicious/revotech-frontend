import { AfterContentInit, AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { DataService } from '../data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, takeWhile } from 'rxjs';
import { Island } from '../models/island.model';
import { NgClass, NgIf } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-island',
  standalone: true,
  imports: [NgClass, GoogleMapsModule, NgIf],
  templateUrl: './island.component.html',
  styleUrl: './island.component.scss'
})
export class IslandComponent {
  islandId: number;
  islandData: Island;
  options: google.maps.MapOptions;

  markerOptions: google.maps.MarkerOptions = { draggable: false };
  islandPosition: google.maps.LatLngLiteral;

  constructor(private dataService: DataService, private route: ActivatedRoute, private router: Router) {
    this.route.params.subscribe(
      params => {
        this.islandId = +params['id'];
        if (!this.islandId) {
          this.router.navigate(['']);
          return;
        }

        this.dataService.islandsArray.pipe(takeWhile((val) => val === null, true)).subscribe((data) => {
          if (!data) {
            return;
          }
          this.islandData = data.find((island) => island.order === this.islandId);
          if (!this.islandData) {
            this.router.navigate(['']);
            return;
          }
          this.options = {
            zoom: 8,
            center: { lat: this.islandData.location[1], lng: this.islandData.location[0] }
          };
          this.islandPosition = { lat: +this.islandData.location[1], lng: +this.islandData.location[0] };
        })
      }
    );
  }
}
