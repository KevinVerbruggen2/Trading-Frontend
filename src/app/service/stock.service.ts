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

  /*
  @PostMapping("/scrape")
    public ResponseEntity<Stock> scrapeAndCreateStock(@RequestParam String name) {
   */
  scrapeStockData(stockName: string): Observable<StockInterface> {
    // post request to backend
    return this.http.post<StockInterface>(`${this.url}/scrape?name=${stockName}`, {});
  }




}
