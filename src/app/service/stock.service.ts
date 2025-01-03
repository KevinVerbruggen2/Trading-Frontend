import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {StockInterface} from "../interface/stock.interface";
import {environment} from "../../evironment/evironment";

@Injectable({
  providedIn: 'root',
})
export class StockService {

  private url = environment.NEXT_PUBLIC_API_URL + '/stocks';

  constructor(private http: HttpClient) {}

  getAllStocks(): Observable<StockInterface[]> {
    return this.http.get<StockInterface[]>(this.url);
  }

  //do the same as above but pu the param in body
  scrapeStockData(stockName: string): Observable<StockInterface> {
    let stockInterface: StockInterface = {
      name: stockName
    }
    return this.http.post<StockInterface>(`${this.url}/scrape`, stockInterface);
  }

  scrapeStockDataBulk(numberOfStocks : number, distributor: String, currency: String): Observable<StockInterface[]> {
    let params = {
      numberOfStocks: numberOfStocks,
      distributor: distributor,
      currency: currency
    }
    return this.http.post<StockInterface[]>(`${this.url}/scrape/bulk`, params);
  }

  setFavourite(stock: StockInterface): Observable<StockInterface> {
    let params = {
      stockId: stock.id,
      favourite: stock.favourite
    }
    return this.http.put<StockInterface>(`${this.url}/favourite`, params);
  }

}
