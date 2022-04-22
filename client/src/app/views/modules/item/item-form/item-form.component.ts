import { Component, OnInit } from '@angular/core';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Itemtype} from '../../../../entities/itemtype';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ItemService} from '../../../../services/item.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {ItemtypeService} from '../../../../services/itemtype.service';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {Item} from '../../../../entities/item';
import {ResourceLink} from '../../../../shared/resource-link';
import {Itemcategory} from '../../../../entities/itemcategory';
import {Itemstatus} from '../../../../entities/itemstatus';
import {Brand} from '../../../../entities/brand';
import {Unit} from '../../../../entities/unit';
import {ItemcategoryService} from '../../../../services/itemcategory.service';
import {BrandService} from '../../../../services/brand.service';
import {UnitService} from '../../../../services/unit.service';

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.scss']
})
export class ItemFormComponent extends AbstractComponent implements OnInit {

  // 1. define validation for forign keys(item dond have forign keys)

  itemtypes: Itemtype[] = [];
  itemcategories: Itemcategory[] = [];
  brands: Brand[] = [];
  units: Unit[] = [];

  // 2.define form with validation rules
    form = new FormGroup({
      description: new FormControl(null, [
      Validators.maxLength(65535),
    ]),
    name: new FormControl(null, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(255),
    ]),
      photo: new FormControl(),
    // forign validation
    itemtype: new FormControl(null, [
      Validators.required,
    ]),
      itemcategory: new FormControl(null, [
      Validators.required,
    ]),
      brand: new FormControl(null, [
      Validators.required,
    ]),
       unit: new FormControl(null, [
      Validators.required,
    ]),

  });

  // 3.define getters for form field.
  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }
  get nameField(): FormControl{
    return this.form.controls.name as FormControl;
  }
  get photoField(): FormControl{
    return this.form.controls.photo as FormControl;
  }
  get itemtypeField(): FormControl{
    return this.form.controls.itemtype as FormControl;
  }
  get itemcategoryField(): FormControl{
    return this.form.controls.itemcategory as FormControl;
  }
  get brandField(): FormControl{
    return this.form.controls.brand as FormControl;
  }
  get unitField(): FormControl{
    return this.form.controls.unit as FormControl;
  }

  // 4.create constructor with injecting relevent dependencies
  constructor(
    private itemService: ItemService,
    private snackBar: MatSnackBar,
    private router: Router,
    private itemtypeService: ItemtypeService,
    private itemcategoryService: ItemcategoryService,
    private brandService: BrandService,
    private unitService: UnitService,
  ) { super(); }

  // 5.create ngoninit method
  ngOnInit(): void {
    this.loadData();
    this.refreshData();
  }

  // 6.create Loaddata method
  async loadData(): Promise<any>{
    this.updatePrivileges();
    if (!this.privilege.add) { return; }

    this.itemtypeService.getAll().then((itemtypes) => {
      this.itemtypes = itemtypes;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong ', null, {duration: 2000});
    });
    this.itemcategoryService.getAll().then((itemcategories) => {
      this.itemcategories = itemcategories;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong ', null, {duration: 2000});
    });
    this.brandService.getAll().then((brands) => {
      this.brands = brands;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong ', null, {duration: 2000});
    });
    this.unitService.getAll().then((units) => {
      this.units = units;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong ', null, {duration: 2000});
    });

  }

  // 7. create update privilage method
  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_ITEM);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_ITEMS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_ITEM_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_ITEM);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_ITEM);
  }

  // 8.CREATE SUBMIT METHOD
  async submit(): Promise<void> {
    this.photoField.updateValueAndValidity();
    this.photoField.markAsTouched();

    if (this.form.invalid) { return; }

    const item: Item = new Item();
    item.name = this.nameField.value;

    const photoIds = this.photoField.value;
    if (photoIds !== null && photoIds !== []){
      item.photo = photoIds[0];
    }else {item.photo = null; }
    item.description = this.descriptionField.value;
    item.itemtype = this.itemtypeField.value;
    item.itemcategory = this.itemcategoryField.value;
    item.brand = this.brandField.value;
    item.unit = this.unitField.value;

    try{
      const resourceLink: ResourceLink = await this.itemService.add(item);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/items/' + resourceLink.id);
      } else {
        this.form.reset();
        this.snackBar.open('Successfully saved', null, {duration: 2000});
      }
    }catch (e) {
      switch (e.status) {
        case 401: break;
        case 403: this.snackBar.open(e.error.message, null, {duration: 2000}); break;
        case 400:
          const msg = JSON.parse(e.error.message);
          let knownError = false;
          if (msg.description) { this.descriptionField.setErrors({server: msg.description}); knownError = true; }
          if (msg.name) { this.nameField.setErrors({server: msg.name}); knownError = true; }
          if (msg.itemtype) { this.itemtypeField.setErrors({server: msg.itemtype}); knownError = true; }
          if (msg.itemcategory) { this.itemcategoryField.setErrors({server: msg.itemcategory}); knownError = true; }
          if (msg.brand) { this.brandField.setErrors({server: msg.brand}); knownError = true; }
          if (msg.unit) { this.unitField.setErrors({server: msg.unit}); knownError = true; }
          if (!knownError) {
            this.snackBar.open('Validation Error', null, {duration: 2000});
          }
          break;
        default:
          console.log(e);
          this.snackBar.open('Something is wrong ', null, {duration: 2000});
      }
    }

  }


}
