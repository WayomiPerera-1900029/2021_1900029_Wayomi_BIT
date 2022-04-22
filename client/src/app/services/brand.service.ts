import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Brand} from '../entities/brand';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Brand[]>{
    const brands = await this.http.get<Brand[]>(ApiManager.getURL('brands')).toPromise();
    return brands.map((brand) => Object.assign(new Brand(), brand));
  }

}
