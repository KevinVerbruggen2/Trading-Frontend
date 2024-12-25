import {Component, effect, OnInit, signal} from '@angular/core';
import { RouterLink } from "@angular/router";
import { StockService } from "../../../service/stock.service";
import { StockInterface } from "../../../interface/stock.interface";
import { SubscriptionService } from "../../../service/subscription.service";
import {DecimalPipe, NgForOf, NgIf, SlicePipe} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {getFullUrl} from "../../../../Util/UrlUtil";

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

  allStocks = signal<StockInterface[]>([]);
  stocks : StockInterface[] = [];
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
    distributor: '',
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
    this.intitForm()

    effect(() => {
      this.allStocks();
      this.applyFilters();
    });

    this.filterForm.valueChanges.subscribe(() => {
      this.updateFilters();
      this.applyFilters();
    });

    // set distributor
    this.filterForm.get('distributor')!.setValue('MeDirect');
  }

  get showDetails(): boolean {
    return this.filterForm.get('showDetails')!.value;
  }

  ngOnInit(): void {
    this.addSubscription(this.stockService.getAllStocks().subscribe({
      next: (response) => {
        this.allStocks.set(response);
      },
      error: (error) => {
        console.error('Error fetching stocks', error);
      }
    }));
  }

  applyFilters(): void {
    let filteredStocks = this.allStocks();
    if (this.filters.favourite !== 'Select' && this.filters.favourite !== '') {
      if (this.filters.favourite === 'True') {
        filteredStocks = filteredStocks.filter(stock => stock.isFavourite);
      } else {
        filteredStocks = filteredStocks.filter(stock => stock.isFavourite === undefined || !stock.isFavourite);
      }
    }
    if (this.filters.etf !== 'Select' && this.filters.etf !== '') {
      filteredStocks = filteredStocks.filter(stock => stock.etf === (this.filters.etf === 'True'));
    }
    if (this.filters.name) {
      filteredStocks = filteredStocks.filter(stock => stock.name?.toLowerCase().includes(this.filters.name.toLowerCase()));
    }
    if (this.filters.category) {
      filteredStocks = filteredStocks.filter(stock => stock.category?.toLowerCase().includes(this.filters.category.toLowerCase()));
    }
    if (this.filters.distributor) {
      filteredStocks = filteredStocks.filter(stock => stock.distributor?.toLowerCase().includes(this.filters.distributor.toLowerCase()));
    }
    if (this.filters.startLaunchDate) {
      filteredStocks = filteredStocks.filter(stock => stock.launchDate && new Date(stock.launchDate) >= new Date(this.filters.startLaunchDate));
    }
    if (this.filters.endLaunchDate) {
      filteredStocks = filteredStocks.filter(stock => stock.launchDate && new Date(stock.launchDate) <= new Date(this.filters.endLaunchDate));
    }

    if (this.filters.minOngoingCost !== null && this.filters.minOngoingCost !== undefined && this.filters.minOngoingCost !== 0.0) {
      filteredStocks = filteredStocks.filter(stock =>
        stock.ongoingCost !== null && stock.ongoingCost !== undefined && stock.ongoingCost >= this.filters.minOngoingCost
      );
    }
    if (this.filters.maxOngoingCost !== null && this.filters.maxOngoingCost !== undefined && this.filters.maxOngoingCost !== 0.0) {
      filteredStocks = filteredStocks.filter(stock =>
        stock.ongoingCost !== null && stock.ongoingCost !== undefined && stock.ongoingCost <= this.filters.maxOngoingCost
      );
    }
    if (this.filters.minOneMonthReturn !== null && this.filters.minOneMonthReturn !== undefined && this.filters.minOneMonthReturn !== 0.0) {
      filteredStocks = filteredStocks.filter(stock =>
        stock.oneMonthReturn !== null && stock.oneMonthReturn !== undefined && stock.oneMonthReturn >= this.filters.minOneMonthReturn
      );
    }
    if (this.filters.maxOneMonthReturn !== null && this.filters.maxOneMonthReturn !== undefined && this.filters.maxOneMonthReturn !== 0.0) {
      filteredStocks = filteredStocks.filter(stock =>
        stock.oneMonthReturn !== null && stock.oneMonthReturn !== undefined && stock.oneMonthReturn <= this.filters.maxOneMonthReturn
      );
    }
    if (this.filters.minThreeMonthReturn !== null && this.filters.minThreeMonthReturn !== undefined && this.filters.minThreeMonthReturn !== 0.0) {
      filteredStocks = filteredStocks.filter(stock =>
        stock.threeMonthReturn !== null && stock.threeMonthReturn !== undefined && stock.threeMonthReturn >= this.filters.minThreeMonthReturn
      );
    }
    if (this.filters.maxThreeMonthReturn !== null && this.filters.maxThreeMonthReturn !== undefined && this.filters.maxThreeMonthReturn !== 0.0) {
      filteredStocks = filteredStocks.filter(stock =>
        stock.threeMonthReturn !== null && stock.threeMonthReturn !== undefined && stock.threeMonthReturn <= this.filters.maxThreeMonthReturn
      );
    }
    if (this.filters.minSixMonthReturn !== null && this.filters.minSixMonthReturn !== undefined && this.filters.minSixMonthReturn !== 0.0) {
      filteredStocks = filteredStocks.filter(stock =>
        stock.sixMonthReturn !== null && stock.sixMonthReturn !== undefined && stock.sixMonthReturn >= this.filters.minSixMonthReturn
      );
    }
    if (this.filters.maxSixMonthReturn !== null && this.filters.maxSixMonthReturn !== undefined && this.filters.maxSixMonthReturn !== 0.0) {
      filteredStocks = filteredStocks.filter(stock =>
        stock.sixMonthReturn !== null && stock.sixMonthReturn !== undefined && stock.sixMonthReturn <= this.filters.maxSixMonthReturn
      );
    }
    if (this.filters.minOneYearReturn !== null && this.filters.minOneYearReturn !== undefined && this.filters.minOneYearReturn !== 0.0) {
      filteredStocks = filteredStocks.filter(stock =>
        stock.oneYearReturn !== null && stock.oneYearReturn !== undefined && stock.oneYearReturn >= this.filters.minOneYearReturn
      );
    }
    if (this.filters.maxOneYearReturn !== null && this.filters.maxOneYearReturn !== undefined && this.filters.maxOneYearReturn !== 0.0) {
      filteredStocks = filteredStocks.filter(stock =>
        stock.oneYearReturn !== null && stock.oneYearReturn !== undefined && stock.oneYearReturn <= this.filters.maxOneYearReturn
      );
    }
    if (this.filters.minThreeYearAnnualReturn !== null && this.filters.minThreeYearAnnualReturn !== undefined && this.filters.minThreeYearAnnualReturn !== 0.0) {
      filteredStocks = filteredStocks.filter(stock =>
        stock.threeYearAnnualReturn !== null && stock.threeYearAnnualReturn !== undefined && stock.threeYearAnnualReturn >= this.filters.minThreeYearAnnualReturn
      );
    }
    if (this.filters.maxThreeYearAnnualReturn !== null && this.filters.maxThreeYearAnnualReturn !== undefined && this.filters.maxThreeYearAnnualReturn !== 0.0) {
      filteredStocks = filteredStocks.filter(stock =>
        stock.threeYearAnnualReturn !== null && stock.threeYearAnnualReturn !== undefined && stock.threeYearAnnualReturn <= this.filters.maxThreeYearAnnualReturn
      );
    }
    if (this.filters.minFiveYearAnnualReturn !== null && this.filters.minFiveYearAnnualReturn !== undefined && this.filters.minFiveYearAnnualReturn !== 0.0) {
      filteredStocks = filteredStocks.filter(stock =>
        stock.fiveYearAnnualReturn !== null && stock.fiveYearAnnualReturn !== undefined && stock.fiveYearAnnualReturn >= this.filters.minFiveYearAnnualReturn
      );
    }
    if (this.filters.maxFiveYearAnnualReturn !== null && this.filters.maxFiveYearAnnualReturn !== undefined && this.filters.maxFiveYearAnnualReturn !== 0.0) {
      filteredStocks = filteredStocks.filter(stock =>
        stock.fiveYearAnnualReturn !== null && stock.fiveYearAnnualReturn !== undefined && stock.fiveYearAnnualReturn <= this.filters.maxFiveYearAnnualReturn
      );
    }
    if (this.filters.minTenYearAnnualReturn !== null && this.filters.minTenYearAnnualReturn !== undefined && this.filters.minTenYearAnnualReturn !== 0.0) {
      filteredStocks = filteredStocks.filter(stock =>
        stock.tenYearAnnualReturn !== null && stock.tenYearAnnualReturn !== undefined && stock.tenYearAnnualReturn >= this.filters.minTenYearAnnualReturn
      );
    }
    if (this.filters.maxTenYearAnnualReturn !== null && this.filters.maxTenYearAnnualReturn !== undefined && this.filters.maxTenYearAnnualReturn !== 0.0) {
      filteredStocks = filteredStocks.filter(stock =>
        stock.tenYearAnnualReturn !== null && stock.tenYearAnnualReturn !== undefined && stock.tenYearAnnualReturn <= this.filters.maxTenYearAnnualReturn
      );
    }
    if (this.filters.minVolatility !== null && this.filters.minVolatility !== undefined && this.filters.minVolatility !== 0.0) {
      filteredStocks = filteredStocks.filter(stock =>
        stock.volatility !== null && stock.volatility !== undefined && stock.volatility >= this.filters.minVolatility
      );
    }
    if (this.filters.maxVolatility !== null && this.filters.maxVolatility !== undefined && this.filters.maxVolatility !== 0.0) {
      filteredStocks = filteredStocks.filter(stock =>
        stock.volatility !== null && stock.volatility !== undefined && stock.volatility <= this.filters.maxVolatility
      );
    }
    if (this.filters.minCustomRating !== null && this.filters.minCustomRating !== undefined && this.filters.minCustomRating !== 0.0) {
      filteredStocks = filteredStocks.filter(stock => {
        const rating = Number(stock.customRating);
        return rating !== null && !isNaN(rating) && rating >= this.filters.minCustomRating;
      });
    }
    if (this.filters.maxCustomRating !== null && this.filters.maxCustomRating !== undefined && this.filters.maxCustomRating !== 0.0) {
      filteredStocks = filteredStocks.filter(stock => {
        const rating = Number(stock.customRating);
        return rating !== null && !isNaN(rating) && rating <= this.filters.maxCustomRating;
      });
    }

    this.stocks = filteredStocks;
  }

  setSortBy(field: SortKey): void {
    // Check if currentSort is null or not and toggle the direction accordingly
    let direction: 'asc' | 'desc' = 'asc';
    if (this.currentSort?.field === field) {
      direction = this.currentSort?.direction === 'asc' ? 'desc' : 'asc';
    } else {
      direction = this.defaultDescendingFields.includes(field) ? 'desc' : 'asc';
    }
    this.currentSort = { field, direction };
    this.sortStocks();
  }

  sortStocks(): void {
    const {field, direction} = this.currentSort || {};
    if (!field) return;

    const sortedStocks = [...this.allStocks()].sort((a, b) => {
      const aValue = a[field] ?? '';
      const bValue = b[field] ?? '';

      if (aValue === bValue) return 0;
      if (aValue < bValue) return this.currentSort?.direction === 'asc' ? -1 : 1;
      return this.currentSort?.direction === 'asc' ? 1 : -1;
    });

    this.allStocks.set(sortedStocks);
  }

  getSortDirection(field: SortKey): 'asc' | 'desc' | null {
    return this.currentSort && this.currentSort.field === field ? this.currentSort.direction : null;
  }

  private intitForm() {
    this.filterForm = this.fb.group({
      showDetails: [false],
      favourite: [''],
      name: [''],
      etf: [''],
      startLaunchDate: [''],
      endLaunchDate: [''],
      category: [''],
      distributor: ['MeDirect'],
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

  private updateFilters() {
    this.filters.favourite = this.filterForm.get('favourite')!.value;
    this.filters.name = this.filterForm.get('name')!.value;
    this.filters.etf = this.filterForm.get('etf')!.value;
    this.filters.startLaunchDate = this.filterForm.get('startLaunchDate')!.value;
    this.filters.endLaunchDate = this.filterForm.get('endLaunchDate')!.value;
    this.filters.category = this.filterForm.get('category')!.value;
    this.filters.distributor = this.filterForm.get('distributor')!.value;
    this.filters.minOngoingCost = this.filterForm.get('minOngoingCost')!.value;
    this.filters.maxOngoingCost = this.filterForm.get('maxOngoingCost')!.value;
    this.filters.minOneMonthReturn = this.filterForm.get('minOneMonthReturn')!.value;
    this.filters.maxOneMonthReturn = this.filterForm.get('maxOneMonthReturn')!.value;
    this.filters.minThreeMonthReturn = this.filterForm.get('minThreeMonthReturn')!.value;
    this.filters.maxThreeMonthReturn = this.filterForm.get('maxThreeMonthReturn')!.value;
    this.filters.minSixMonthReturn = this.filterForm.get('minSixMonthReturn')!.value;
    this.filters.maxSixMonthReturn = this.filterForm.get('maxSixMonthReturn')!.value;
    this.filters.minOneYearReturn = this.filterForm.get('minOneYearReturn')!.value;
    this.filters.maxOneYearReturn = this.filterForm.get('maxOneYearReturn')!.value;
    this.filters.minThreeYearAnnualReturn = this.filterForm.get('minThreeYearAnnualReturn')!.value;
    this.filters.maxThreeYearAnnualReturn = this.filterForm.get('maxThreeYearAnnualReturn')!.value;
    this.filters.minFiveYearAnnualReturn = this.filterForm.get('minFiveYearAnnualReturn')!.value;
    this.filters.maxFiveYearAnnualReturn = this.filterForm.get('maxFiveYearAnnualReturn')!.value;
    this.filters.minTenYearAnnualReturn = this.filterForm.get('minTenYearAnnualReturn')!.value;
    this.filters.maxTenYearAnnualReturn = this.filterForm.get('maxTenYearAnnualReturn')!.value;
    this.filters.minRisk = this.filterForm.get('minRisk')!.value;
    this.filters.maxRisk = this.filterForm.get('maxRisk')!.value;
    this.filters.minVolatility = this.filterForm.get('minVolatility')!.value;
    this.filters.maxVolatility = this.filterForm.get('maxVolatility')!.value;
    this.filters.minCustomRating = this.filterForm.get('minCustomRating')!.value;
    this.filters.maxCustomRating = this.filterForm.get('maxCustomRating')!.value;
    console.log(this.filters)
  }

  protected readonly getFullUrl = getFullUrl;

  getActiveFilters() : string[] {
    const activeFilters: string[] = [];
    for (const key in this.filters) {
      const value = (this.filters as any)[key];
      if (value !== undefined && value !== null && value !== '' && value !== 0.0 && value !== 'Select') {
        activeFilters.push(`${key}: ${value}`);
      }
    }
    return activeFilters;
  }

  resetFilter(name: string) {
    // get everything before first : in name
    let key = name.split(':')[0].trim();
    this.filterForm.get(key)?.reset();
  }
}
