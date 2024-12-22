import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {StockService} from "../../../service/stock.service";
import {SubscriptionService} from "../../../service/subscription.service";

@Component({
  selector: 'app-add-stock',
  standalone: true,
  templateUrl: './add-stock.component.html',
  imports: [
    ReactiveFormsModule
  ],
  styleUrls: ['./add-stock.component.css']
})
export class AddStockComponent extends SubscriptionService {

  addStockForm!: FormGroup;

  constructor(private fb: FormBuilder, private stockService: StockService) {
    super();
    this.addStockForm = this.fb.group({
      name: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.addStockForm.valid) {
      const name = this.addStockForm.get('name')!.value;

      this.addSubscription(this.stockService.scrapeStockData(name).subscribe({
        next: (response) => {
          console.log('Stock added successfully', response);
          this.addStockForm.reset();
        },
        error: (error) => {
          console.error('Error adding stock', error);
        }
      }));
    }
  }
}
