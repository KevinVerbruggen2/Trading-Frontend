import { Component, OnInit } from '@angular/core';
import { RouterLink } from "@angular/router";
import { StockService } from "../../../service/stock.service";
import { StockInterface } from "../../../interface/stock.interface";
import { SubscriptionService } from "../../../service/subscription.service";
import {DecimalPipe, NgForOf, NgIf, SlicePipe} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";

type SortKey = keyof StockInterface;

@Component({
  selector: 'app-stock-overview',
  standalone: true,
  imports: [
    RouterLink,
    NgForOf,
    SlicePipe,
    NgIf,
    ReactiveFormsModule,
    DecimalPipe
  ],
  templateUrl: './stock-overview.component.html',
  styleUrls: ['./stock-overview.component.css']
})
export class StockOverviewComponent extends SubscriptionService implements OnInit {

  allStocks: StockInterface[] = [];
  stocks: StockInterface[] = [];
  filterForm!: FormGroup;
  currentSort: { field: SortKey, direction: 'asc' | 'desc' } | null = null;

  private defaultDescendingFields: SortKey[] = [
    'ongoingCost',
    'oneMonthReturn',
    'threeMonthReturn',
    'sixMonthReturn',
    'oneYearReturn',
    'threeYearAnnualReturn',
    'fiveYearAnnualReturn',
    'tenYearAnnualReturn',
    'risk',
    'volatility',
    'customRating'
  ];

  constructor(private stockService: StockService, private fb: FormBuilder) {
    super();
    this.filterForm = this.fb.group({
      showDetails: [false] // Default to false
    });
  }

  get showDetails(): boolean {
    return this.filterForm.get('showDetails')!.value;
  }

  ngOnInit(): void {
    this.addSubscription(this.stockService.getAllStocks().subscribe({
      next: (response) => {
        this.allStocks = response;
        this.stocks = response;
      },
      error: (error) => {
        console.error('Error fetching stocks', error);
      }
    }));
  }

  sortBy(field: SortKey): void {
    // Check if currentSort is null or not and toggle the direction accordingly
    let direction: 'asc' | 'desc' = 'asc';
    if (this.currentSort?.field === field) {
      direction = this.currentSort?.direction === 'asc' ? 'desc' : 'asc';
    } else {
      direction = this.defaultDescendingFields.includes(field) ? 'desc' : 'asc';
    }

    this.currentSort = { field, direction };

    // Sort the stocks based on the current field and direction
    this.stocks.sort((a, b) => {
      const aValue = a[field] ?? ''; // Default empty string for undefined
      const bValue = b[field] ?? ''; // Default empty string for undefined

      if (aValue === bValue) return 0;
      if (aValue < bValue) return this.currentSort?.direction === 'asc' ? -1 : 1;
      return this.currentSort?.direction === 'asc' ? 1 : -1;
    });
  }

  getSortDirection(field: SortKey): 'asc' | 'desc' | null {
    return this.currentSort && this.currentSort.field === field ? this.currentSort.direction : null;
  }

}
