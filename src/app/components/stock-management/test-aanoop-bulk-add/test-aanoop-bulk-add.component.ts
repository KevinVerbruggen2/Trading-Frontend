import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {NgForOf, NgIf} from "@angular/common";
import {subscribe} from "node:diagnostics_channel";
import {SubscriptionService} from "../../../service/subscription.service";
import {StockService} from "../../../service/stock.service";

@Component({
  selector: 'app-test-aanoop-bulk-add',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgForOf
  ],
  templateUrl: './test-aanoop-bulk-add.component.html',
  styleUrl: './test-aanoop-bulk-add.component.css'
})
export class TestAanoopBulkAddComponent extends SubscriptionService {

  bulkAddForm!: FormGroup;

  distributors = [
    { value: 'distributor_AG Insurance', label: 'AG Insurance' },
    { value: 'distributor_Allianz Belgium', label: 'Allianz Belgium' },
    { value: 'distributor_Aphilion', label: 'Aphilion' },
    { value: 'distributor_Argenta', label: 'Argenta' },
    { value: 'distributor_AXA', label: 'AXA' },
    { value: 'distributor_Bank de Kremer', label: 'Bank de Kremer' },
    { value: 'distributor_Bank Degroof Petercam', label: 'Bank Degroof Petercam' },
    { value: 'distributor_Bank J. Van Breda & C°', label: 'Bank J. Van Breda & C°' },
    { value: 'distributor_Bank Nagelmackers', label: 'Bank Nagelmackers' },
    { value: 'distributor_Banque Privée Edmond de Rothschild Europe', label: 'Banque Privée Edmond de Rothschild Europe' },
    { value: 'distributor_Belfius', label: 'Belfius' },
    { value: 'distributor_Beobank', label: 'Beobank' },
    { value: 'distributor_Beurs van Milaan', label: 'Beurs van Milaan' },
    { value: 'distributor_BNP Paribas Fortis', label: 'BNP Paribas Fortis' },
    { value: 'distributor_bpost bank', label: 'bpost bank' },
    { value: 'distributor_CapitalatWork', label: 'CapitalatWork' },
    { value: 'distributor_Crelan', label: 'Crelan' },
    { value: 'distributor_DefA Finance', label: 'DefA Finance' },
    { value: 'distributor_DeGiro', label: 'DeGiro' },
    { value: 'distributor_Delen Private Bank', label: 'Delen Private Bank' },
    { value: 'distributor_Deutsche Bank', label: 'Deutsche Bank' },
    { value: 'distributor_Dierickx Leys Effectenbank', label: 'Dierickx Leys Effectenbank' },
    { value: 'distributor_Duitse beurs - Xetra', label: 'Duitse beurs - Xetra' },
    { value: 'distributor_Euronext Amsterdam', label: 'Euronext Amsterdam' },
    { value: 'distributor_Euronext Brussel', label: 'Euronext Brussel' },
    { value: 'distributor_Euronext Parijs', label: 'Euronext Parijs' },
    { value: 'distributor_Fintro', label: 'Fintro' },
    { value: 'distributor_ING België', label: 'ING België' },
    { value: 'distributor_ING Luxembourg', label: 'ING Luxembourg' },
    { value: 'distributor_KBC', label: 'KBC' },
    { value: 'distributor_KBC Bolero', label: 'KBC Bolero' },
    { value: 'distributor_Keytrade Bank', label: 'Keytrade Bank' },
    { value: 'distributor_London Stock Exchange', label: 'London Stock Exchange' },
    { value: 'distributor_MeDirect', label: 'MeDirect' },
    { value: 'distributor_Monument', label: 'Monument' },
    { value: 'distributor_Puilaetco', label: 'Puilaetco' },
    { value: 'distributor_Saxo Bank', label: 'Saxo Bank' },
    { value: 'distributor_SIX Swiss Exchange', label: 'SIX Swiss Exchange' },
    { value: 'distributor_Société Générale Private Banking', label: 'Société Générale Private Banking' },
    { value: 'distributor_Stockholm (OMX)', label: 'Stockholm (OMX)' },
    { value: 'distributor_TreeTop Asset Management Belgium', label: 'TreeTop Asset Management Belgium' },
    { value: 'distributor_Triodos Bank', label: 'Triodos Bank' },
    { value: 'distributor_Van Lanschot Bankiers', label: 'Van Lanschot Bankiers' },
    { value: 'distributor_VDK Bank', label: 'VDK Bank' },
    { value: 'distributor_VDV Conseil', label: 'VDV Conseil' }
  ];

  currencyOptions = [
    { value: 'EUR', label: 'Euro (EUR)' },
    { value: 'USD', label: 'US Dollar (USD)' },
    { value: 'ALL', label: 'All Currencies' }
  ];

  constructor(
    private fb: FormBuilder,
    private stockService: StockService
  ) {
    super();
    this.bulkAddForm = this.fb.group({
      numberOfStocks: ['10', [Validators.required, Validators.min(1)]],
      distributor: ['distributor_MeDirect', Validators.required], // Set MeDirect as default
      currency: ['EUR', Validators.required] // Set EUR as default
    });
  }

  onSubmit() {
    const formData = this.bulkAddForm.value;
    const numberOfStocks = formData.numberOfStocks;
    const distributor = formData.distributor;
    const currency = formData.currency;

    if (this.bulkAddForm.valid) {
      this.addSubscription(
        this.stockService.scrapeStockDataBulk(numberOfStocks, distributor, currency).subscribe(
          {
            next: (response) => {
              console.log('Stock added successfully', response);
              this. bulkAddForm = this.fb.group({
                numberOfStocks: ['10', [Validators.required, Validators.min(1)]],
                distributor: ['distributor_MeDirect', Validators.required], // Set MeDirect as default
                currency: ['EUR', Validators.required] // Set EUR as default
              });
            },
            error: (error) => {
              console.error('Error adding stock', error);
            }
          }
        )
      )
    }

  }
}
