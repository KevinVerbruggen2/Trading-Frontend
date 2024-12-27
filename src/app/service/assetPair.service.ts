import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {environment} from "../../evironment/evironment";
import {Observable} from "rxjs";
import {StockInterface} from "../interface/stock.interface";
import {AssetPair} from "../interface/assetPair.interface";

@Injectable({
  providedIn: 'root'
})
export class AssetPairService {

  private url = environment.NEXT_PUBLIC_API_URL + '/asset-pair';

  constructor(private http: HttpClient) {}

  getAllAssetPairs(): Observable<AssetPair[]> {
    return this.http.get<AssetPair[]>(this.url);
  }
}


