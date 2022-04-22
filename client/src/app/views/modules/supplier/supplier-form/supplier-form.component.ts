import { Component, OnInit } from '@angular/core';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {SupplierService} from '../../../../services/supplier.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {Supplier} from '../../../../entities/supplier';
import {Suppliertype} from '../../../../entities/suppliertype';
import {SuppliertypeService} from '../../../../services/suppliertype.service';
import {ResourceLink} from '../../../../shared/resource-link';

@Component({
  selector: 'app-supplier-form',
  templateUrl: './supplier-form.component.html',
  styleUrls: ['./supplier-form.component.scss']
})
export class SupplierFormComponent extends  AbstractComponent implements OnInit {

  // 1. define validation for forign keys(supplier dond have forign keys)

  suppliertypes: Suppliertype[] = [];

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
    contact1: new FormControl(null, [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(10),
      Validators.pattern('^([0][1-9][0-9]{8})$'),
    ]),
    contact2: new FormControl(null, [
      Validators.minLength(10),
      Validators.maxLength(10),
      Validators.pattern('^([0][1-9][0-9]{8})$'),
    ]),
    address: new FormControl(null, [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(65535),
    ]),
    email: new FormControl(null, [
      Validators.minLength(5),
      Validators.maxLength(255),
      Validators.pattern('^([A-Za-z0-9_\\-\\.])+\\@([A-Za-z0-9_\\-\\.])+\\.([A-Za-z]{2,4})$' ),
    ]),
    fax: new FormControl(null, [
      Validators.minLength(10),
      Validators.maxLength(10),
      Validators.pattern('^([0][1-9][0-9]{8})$'),
    ]),
    // forign validation
    suppliertype: new FormControl(null, [
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
  get contact1Field(): FormControl{
    return this.form.controls.contact1 as FormControl;
  }
  get contact2Field(): FormControl{
    return this.form.controls.contact2 as FormControl;
  }
  get addressField(): FormControl{
    return this.form.controls.address as FormControl;
  }
  get emailField(): FormControl{
    return this.form.controls.email as FormControl;
  }
  get faxField(): FormControl{
    return this.form.controls.fax as FormControl;
  }

  get suppliertypeField(): FormControl{
    return this.form.controls.suppliertype as FormControl;
  }

  // 4.create constructor with injecting relevent dependencies
  constructor(
    private supplierService: SupplierService,
    private snackBar: MatSnackBar,
    private router: Router,
    private suppliertypeService: SuppliertypeService
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

    this.suppliertypeService.getAll().then((suppliertypes) => {
      this.suppliertypes = suppliertypes;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong ', null, {duration: 2000});
    });

  }

  // 7. create update privilage method
  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_SUPPLIER);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_SUPPLIERS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_SUPPLIER_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_SUPPLIER);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_SUPPLIER);
  }

  // 8.CREATE SUBMIT METHOD
  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const supplier: Supplier = new Supplier();
    supplier.name = this.nameField.value;
    supplier.description = this.descriptionField.value;
    supplier.contact1 = this.contact1Field.value;
    supplier.contact2 = this.contact2Field.value;
    supplier.address = this.addressField.value;
    supplier.email = this.emailField.value;
    supplier.fax = this.faxField.value;
    supplier.suppliertype = this.suppliertypeField.value;

    try{
      const resourceLink: ResourceLink = await this.supplierService.add(supplier);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/suppliers/' + resourceLink.id);
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
          if (msg.contact1) { this.contact1Field.setErrors({server: msg.contact1}); knownError = true; }
          if (msg.contact2) { this.contact2Field.setErrors({server: msg.contact2}); knownError = true; }
          if (msg.address) { this.addressField.setErrors({server: msg.address}); knownError = true; }
          if (msg.email) { this.emailField.setErrors({server: msg.email}); knownError = true; }
          if (msg.fax) { this.faxField.setErrors({server: msg.fax}); knownError = true; }
          if (msg.suppliertype) { this.suppliertypeField.setErrors({server: msg.suppliertype}); knownError = true; }
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
