import {Component, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {StockService} from "../../../service/stock.service";
import {StockInterface} from "../../../interface/stock.interface";
import {SubscriptionService} from "../../../service/subscription.service";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-stock-overview',
  standalone: true,
  imports: [
    RouterLink,
    NgForOf
  ],
  templateUrl: './stock-overview.component.html',
  styleUrl: './stock-overview.component.css'
})
export class StockOverviewComponent extends SubscriptionService implements OnInit {

  allStocks: StockInterface[] = [];
  stocks: StockInterface[] = [];

  constructor(private stockService: StockService) {
    super();
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
}
