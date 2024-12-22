import { Routes } from '@angular/router';
import {StockOverviewComponent} from "./components/stock-management/stock-overview/stock-overview.component";
import {AddStockComponent} from "./components/stock-management/add-stock/add-stock.component";

export const routes: Routes = [

  {
    path: 'stock-management',
    children: [
      {
        path: 'stock-overview',
        component: StockOverviewComponent
      },
      {
        path: 'add-stock',
        component: AddStockComponent
      }
    ]
  }

];
