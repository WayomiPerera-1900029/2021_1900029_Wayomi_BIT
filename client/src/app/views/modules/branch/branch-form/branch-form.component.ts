import { Component, OnInit } from '@angular/core';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {BranchService} from '../../../../services/branch.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {Branch} from '../../../../entities/branch';
import {ResourceLink} from '../../../../shared/resource-link';

@Component({
  selector: 'app-branch-form',
  templateUrl: './branch-form.component.html',
  styleUrls: ['./branch-form.component.scss']
})
export class BranchFormComponent extends AbstractComponent implements OnInit {

  // 1. define validation for forign keys(branch dond have forign keys)
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
    tel1: new FormControl(null, [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(10),
      Validators.pattern('^([0][1-9][0-9]{8})$'),
    ]),
    tel2: new FormControl(null, [
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
  });

  // 3.define getters for form field.
  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }
  get nameField(): FormControl{
    return this.form.controls.name as FormControl;
  }
  get tel1Field(): FormControl{
    return this.form.controls.tel1 as FormControl;
  }
  get tel2Field(): FormControl{
    return this.form.controls.tel2 as FormControl;
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

  get branchstatusField(): FormControl{
    return this.form.controls.branchstatus as FormControl;
  }

  // 4.create constructor with injecting relevent dependencies
  constructor(
    private branchService: BranchService,
    private snackBar: MatSnackBar,
    private router: Router,
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
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_BRANCH);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_BRANCHES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_BRANCH_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_BRANCH);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_BRANCH);
  }

  // 8.CREATE SUBMIT METHOD
  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const branch: Branch = new Branch();
    branch.name = this.nameField.value;
    branch.description = this.descriptionField.value;
    branch.tel1 = this.tel1Field.value;
    branch.tel2 = this.tel2Field.value;
    branch.address = this.addressField.value;
    branch.email = this.emailField.value;
    branch.fax = this.faxField.value;

    try{
      const resourceLink: ResourceLink = await this.branchService.add(branch);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/branches/' + resourceLink.id);
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
          if (msg.tel1) { this.tel1Field.setErrors({server: msg.tel1}); knownError = true; }
          if (msg.tel2) { this.tel2Field.setErrors({server: msg.tel2}); knownError = true; }
          if (msg.address) { this.addressField.setErrors({server: msg.address}); knownError = true; }
          if (msg.email) { this.emailField.setErrors({server: msg.email}); knownError = true; }
          if (msg.fax) { this.faxField.setErrors({server: msg.fax}); knownError = true; }
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
