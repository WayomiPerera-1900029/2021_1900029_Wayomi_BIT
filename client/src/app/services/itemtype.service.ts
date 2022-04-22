import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Itemtype} from '../entities/itemtype';

@Injectable({
  providedIn: 'root'
})
export class ItemtypeService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Itemtype[]>{
    const itemtypes = await this.http.get<Itemtype[]>(ApiManager.getURL('itemtypes')).toPromise();
    return itemtypes.map((itemtype) => Object.assign(new Itemtype(), itemtype));
  }

}
