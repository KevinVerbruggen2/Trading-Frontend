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

  checkedOptions = [
    'True',
    'False',
    'Select'
  ]

  filters = {
    favourite: 'Select',
    name: '',
    etf: 'Select',
    startLaunchDate: '',
    endLaunchDate: '',
    category: '',
    minOngoingCost: 0.0,
    maxOngoingCost: 0.0,
    minOneMonthReturn: 0.0,
    maxOneMonthReturn: 0.0,
    minThreeMonthReturn: 0.0,
    maxThreeMonthReturn: 0.0,
    minSixMonthReturn: 0.0,
    maxSixMonthReturn: 0.0,
    minOneYearReturn: 0.0,
    maxOneYearReturn: 0.0,
    minThreeYearAnnualReturn: 0.0,
    maxThreeYearAnnualReturn: 0.0,
    minFiveYearAnnualReturn: 0.0,
    maxFiveYearAnnualReturn: 0.0,
    minTenYearAnnualReturn: 0.0,
    maxTenYearAnnualReturn: 0.0,
    minRisk: 0.0,
    maxRisk: 0.0,
    minVolatility: 0.0,
    maxVolatility: 0.0,
    minCustomRating: 0.0,
    maxCustomRating: 0.0,
  }

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
      showDetails: [false],
      favourite: [''],
      name: [''],
      etf: [''],
      startLaunchDate: [''],
      endLaunchDate: [''],
      category: [''],
      minOngoingCost: [0.0],
      maxOngoingCost: [0.0],
      minOneMonthReturn: [0.0],
      maxOneMonthReturn: [0.0],
      minThreeMonthReturn: [0.0],
      maxThreeMonthReturn: [0.0],
      minSixMonthReturn: [0.0],
      maxSixMonthReturn: [0.0],
      minOneYearReturn: [0.0],
      maxOneYearReturn: [0.0],
      minThreeYearAnnualReturn: [0.0],
      maxThreeYearAnnualReturn: [0.0],
      minFiveYearAnnualReturn: [0.0],
      maxFiveYearAnnualReturn: [0.0],
      minTenYearAnnualReturn: [0.0],
      maxTenYearAnnualReturn: [0.0],
      minRisk: [0.0],
      maxRisk: [0.0],
      minVolatility: [0.0],
      maxVolatility: [0.0],
      minCustomRating: [0.0],
      maxCustomRating: [0.0]
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
