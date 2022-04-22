import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {EmployeeService} from '../../../../services/employee.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {CustomerService} from '../../../../services/customer.service';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {Employee} from '../../../../entities/employee';
import {DateHelper} from '../../../../shared/date-helper';
import {ResourceLink} from '../../../../shared/resource-link';
import {Customer} from '../../../../entities/customer';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss']
})
export class CustomerFormComponent extends AbstractComponent implements OnInit {
             // 1. define validation for forign keys(customer dond have forign keys)
            // 2.define form with validation rules
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
      Validators.pattern('^([A-Za-z0-9_\\-\\.])+\\@([A-Za-z0-9_\\-\\.])+\\.([A-Za-z]{2,4})$' ),
    ]),
    fax: new FormControl(null, [
      Validators.minLength(10),
      Validators.maxLength(10),
      Validators.pattern('^([0][1-9][0-9]{8})$'),
    ]),

  });
       // 3.define getters for form field.
  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }
  get nameField(): FormControl{
    return this.form.controls.name as FormControl;
  }
  get mobileField(): FormControl{
    return this.form.controls.mobile as FormControl;
  }
  get landField(): FormControl{
    return this.form.controls.land as FormControl;
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
  // 4.create constructor with injecting relevent dependencies
  constructor(
    private customerService: CustomerService,
    private snackBar: MatSnackBar,
    private router: Router
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
  }
        // 7. create update privilage method
  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_CUSTOMER);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_CUSTOMERS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_CUSTOMER_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_CUSTOMER);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_CUSTOMER);
  }

       // 8.CREATE SUBMIT METHOD
  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const customer: Customer = new Customer();
    customer.name = this.nameField.value;
    customer.description = this.descriptionField.value;
    customer.mobile = this.mobileField.value;
    customer.land = this.landField.value;
    customer.address = this.addressField.value;
    customer.email = this.emailField.value;
    customer.fax = this.faxField.value;

    try{
      const resourceLink: ResourceLink = await this.customerService.add(customer);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/customers/' + resourceLink.id);
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
          if (msg.mobile) { this.mobileField.setErrors({server: msg.mobile}); knownError = true; }
          if (msg.land) { this.landField.setErrors({server: msg.land}); knownError = true; }
          if (msg.address) { this.addressField.setErrors({server: msg.address}); knownError = true; }
          if (msg.email) { this.emailField.setErrors({server: msg.email}); knownError = true; }
          if (msg.fax) { this.faxField.setErrors({server: msg.fax}); knownError = true; }
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
