import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {NgForOf, NgIf} from "@angular/common";
import {AssetPair} from "../../../interface/assetPair.interface";
import {AssetPairService} from "../../../service/assetPair.service";
import {SubscriptionService} from "../../../service/subscription.service";


@Component({
  selector: 'app-asset-pair-management',
  templateUrl: './asset-pair-management.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    NgIf
  ],
  styleUrls: ['./asset-pair-management.component.css']
})
export class AssetPairManagementComponent extends SubscriptionService implements OnInit {
  assetPairs: AssetPair[] = [];
  filterForm: FormGroup;
  sortColumn: string = 'altName';
  sortDirection: 'asc' | 'desc' = 'asc';


  constructor(
    private formBuilder: FormBuilder,
    private assetPairService: AssetPairService
  ) {
    super();
    this.filterForm = this.formBuilder.group({
      base: [''],
      quote: [''],
      favourite: [false],
      activelyMonitor: [false]
    });
  }

  ngOnInit() {
    this.loadAssetPairs();
    this.filterForm.valueChanges.subscribe(() => this.filterAssetPairs());
  }

  loadAssetPairs() {
    this.addSubscription(this.assetPairService.getAllAssetPairs().subscribe({
      next: (data: AssetPair[]) => {
        this.assetPairs = data;
        this.filterAssetPairs();
      },
      error: (error) => {
        console.error('Error loading asset pairs:', error);
      }
    }))
  }

  filterAssetPairs() {
    const filters = this.filterForm.value;
    this.assetPairs = this.assetPairs.filter(pair =>
      (!filters.base || pair.base.toLowerCase().includes(filters.base.toLowerCase())) &&
      (!filters.quote || pair.quote.toLowerCase().includes(filters.quote.toLowerCase())) &&
      (!filters.favourite || pair.favourite) &&
      (!filters.activelyMonitor || pair.activelyMonitor)
    );
    this.sortAssetPairs();
  }

  setSortBy(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.sortAssetPairs();
  }

  sortAssetPairs() {
    this.assetPairs.sort((a, b) => {
      const valueA = a[this.sortColumn as keyof AssetPair];
      const valueB = b[this.sortColumn as keyof AssetPair];

      if (valueA == null) return this.sortDirection === 'asc' ? 1 : -1;
      if (valueB == null) return this.sortDirection === 'asc' ? -1 : 1;

      // Explicit type conversion and handling
      if (typeof valueA === 'string') {
        return this.sortDirection === 'asc'
          ? valueA.localeCompare(String(valueB))
          : String(valueB).localeCompare(valueA);
      }

      if (typeof valueA === 'number') {
        return this.sortDirection === 'asc'
          ? valueA - (valueB as number)
          : (valueB as number) - valueA;
      }

      if (typeof valueA === 'boolean') {
        return this.sortDirection === 'asc'
          ? (valueA === valueB ? 0 : valueA ? 1 : -1)
          : (valueA === valueB ? 0 : valueA ? -1 : 1);
      }

      return 0;
    });
  }



  getSortDirection(column: string): string {
    return this.sortColumn === column ? this.sortDirection : '';
  }

  toggleFavourite(pair: any) {
    pair.favourite = !pair.favourite;
    // Optionally, you can call a service method to update the favourite status on the backend
  }
}
