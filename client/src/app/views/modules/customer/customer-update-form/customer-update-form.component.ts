import { Component, OnInit } from '@angular/core';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Employee} from '../../../../entities/employee';
import {Customer} from '../../../../entities/customer';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CustomerService} from '../../../../services/customer.service';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';

@Component({
  selector: 'app-customer-update-form',
  templateUrl: './customer-update-form.component.html',
  styleUrls: ['./customer-update-form.component.scss']
})
export class CustomerUpdateFormComponent extends AbstractComponent implements OnInit {
  /**
   *  1.define a variable as module name
   *  2.define constructor method with injecting relevant dependency
   *  3.define ngonInit
   *  4.define delete method
   *  5.define load data method
   *  6.define update privilege method
   *  7.create Loaddata Method
   *  8.create update privilege method
   *  9.create discard changes method
   *  10.create set values method
   *  11.create submit method
   */

    // 1.define a variable as module name
  customer: Customer;
  selectedId: number;

  // 3.define form with validation rules
  form = new FormGroup({
    description: new FormControl(null, [
      Validators.maxLength(65535),
    ]),
    name: new FormControl(null, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(255),
      Validators.pattern('^[a-zA-Z]+(([\',. -][a-zA-Z ])?[a-zA-Z]*)*$')
    ]),
    mobile: new FormControl(null, [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(10),
      Validators.pattern('^([0][1-9][0-9]{8})$'),
    ]),
    land: new FormControl(null, [
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
      Validators.pattern('^([A-Za-z0-9_\\-\\.])+\\@([A-Za-z0-9_\\-\\.])+\\.([A-Za-z]{2,4})$'),
    ]),
    fax: new FormControl(null, [
      Validators.minLength(10),
      Validators.maxLength(10),
      Validators.pattern('^([0][1-9][0-9]{8})$'),
    ]),

  });

  // 4.define getters for form field.
  get descriptionField(): FormControl {
    return this.form.controls.description as FormControl;
  }

  get nameField(): FormControl {
    return this.form.controls.name as FormControl;
  }

  get mobileField(): FormControl {
    return this.form.controls.mobile as FormControl;
  }

  get landField(): FormControl {
    return this.form.controls.land as FormControl;
  }

  get addressField(): FormControl {
    return this.form.controls.address as FormControl;
  }

  get emailField(): FormControl {
    return this.form.controls.email as FormControl;
  }

  get faxField(): FormControl {
    return this.form.controls.fax as FormControl;
  }

  // 5.create constructor with injecting relevent dependencies
  constructor(
    private customerService: CustomerService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {
    super();
  }

  //  6.define ngonInit
  ngOnInit(): void {
    this.route.paramMap.subscribe(async (params) => {
      this.selectedId = +params.get('id');
      await this.loadData();
      this.refreshData();
    });

  }

  // 7.create Loaddata Method
  async loadData(): Promise<any> {

    this.updatePrivileges();
    if (!this.privilege.update) {
      return;
    }

    this.customer = await this.customerService.get(this.selectedId);
    this.setValues();
  }

  // 8.create update privilege method
  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_CUSTOMER);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_CUSTOMERS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_CUSTOMER_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_CUSTOMER);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_CUSTOMER);
  }

  //  9.create discard changes method
  discardChanges(): void {
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  // 10.create set values method

  setValues(): void {
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.customer.description);
    }
    if (this.nameField.pristine) {
      this.nameField.setValue(this.customer.name);
    }
    if (this.mobileField.pristine) {
      this.mobileField.setValue(this.customer.mobile);
    }
    if (this.landField.pristine) {
      this.landField.setValue(this.customer.land);
    }
    if (this.addressField.pristine) {
      this.addressField.setValue(this.customer.address);
    }
    if (this.emailField.pristine) {
      this.emailField.setValue(this.customer.email);
    }
    if (this.faxField.pristine) {
      this.faxField.setValue(this.customer.fax);
    }
  }

  //  11.create submit method
  async submit(): Promise<void> {
    if (this.form.invalid) {
      return;
    }

    const newcustomer: Customer = new Customer();
    newcustomer.name = this.nameField.value;
    newcustomer.description = this.descriptionField.value;
    newcustomer.mobile = this.mobileField.value;
    newcustomer.land = this.landField.value;
    newcustomer.address = this.addressField.value;
    newcustomer.email = this.emailField.value;
    newcustomer.fax = this.faxField.value;

    try {
      const resourceLink: ResourceLink = await this.customerService.update(this.selectedId, newcustomer);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/customers/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/customers');
      }
    } catch (e) {
      switch (e.status) {
        case 401:
          break;
        case 403:
          this.snackBar.open(e.error.message, null, {duration: 2000});
          break;
        case 400:
          const msg = JSON.parse(e.error.message);
          let knownError = false;
          if (msg.description) {
            this.descriptionField.setErrors({server: msg.description});
            knownError = true;
          }
          if (msg.name) {
            this.nameField.setErrors({server: msg.name});
            knownError = true;
          }
          if (msg.mobile) {
            this.mobileField.setErrors({server: msg.mobile});
            knownError = true;
          }
          if (msg.land) {
            this.landField.setErrors({server: msg.land});
            knownError = true;
          }
          if (msg.address) {
            this.addressField.setErrors({server: msg.address});
            knownError = true;
          }
          if (msg.email) {
            this.emailField.setErrors({server: msg.email});
            knownError = true;
          }
          if (msg.fax) {
            this.faxField.setErrors({server: msg.fax});
            knownError = true;
          }
          if (!knownError) {
            this.snackBar.open('Validation Error', null, {duration: 2000});
          }
          break;
        default:
          this.snackBar.open('Something is wrong', null, {duration: 2000});
      }
    }
  }
}
