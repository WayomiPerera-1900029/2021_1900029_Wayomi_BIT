import {DataPage} from '../shared/data-page';
import {Supplier} from './supplier';
import {User} from './user';
import {Itemcategory} from './itemcategory';
import {Itemtype} from './itemtype';
import {Itemstatus} from './itemstatus';
import {Brand} from './brand';
import {Unit} from './unit';

export class Item{
  id: number;
  code: string;
  tocreation: string;
  description: string;
  name: string;
  photo: string;
  creator: User;
  itemcategory: Itemcategory;
  itemtype: Itemtype;
  itemstatus: Itemstatus;
  brand: Brand;
  unit: Unit;
  supplierlist: Supplier[];

  constructor(id: number= null) {
    this.id = id;
  }
}

export class ItemDataPage extends DataPage{
  content: Item[];
}
