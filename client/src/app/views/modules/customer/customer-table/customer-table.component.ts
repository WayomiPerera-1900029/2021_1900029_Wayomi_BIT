import { Component, OnInit } from '@angular/core';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Employee, EmployeeDataPage} from '../../../../entities/employee';
import {Employeestatus} from '../../../../entities/employeestatus';
import {FormControl} from '@angular/forms';
import {EmployeestatusService} from '../../../../services/employeestatus.service';
import {EmployeeService} from '../../../../services/employee.service';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {Customer, CustomerDataPage} from '../../../../entities/customer';
import {CustomerService} from '../../../../services/customer.service';

@Component({
  selector: 'app-customer-table',
  templateUrl: './customer-table.component.html',
  styleUrls: ['./customer-table.component.scss']
})
export class CustomerTableComponent extends AbstractComponent implements OnInit {
  /*
  * 1.define tabels variables
  * 2.Define Data variables
  * 3.Define search fields
  * 4.create constructor with injecting relevant dependencies
  * 5.create ngoninit method
  * 6.create load data method
  * 7.create update privillege method
  * 8.create setDisplayedColumns method
  * 9.create paginate method
  * 10.create delete method.
   */

 // 1.define tabels variables
  customerDataPage: CustomerDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;

   // 3.Define search fields
  codeField = new FormControl();
  nameField = new FormControl();
  mobileField = new FormControl();
  emailField = new FormControl();
    // 4.create constructor with injecting relevant dependencies
  constructor(
    private customerService: CustomerService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    super();
  }
    // 5.create ngoninit method
  async ngOnInit(): Promise<void> {

    await this.loadData();
    this.refreshData();
  }
  //  6.create load data method
    async loadData(): Promise<any> {
    this.updatePrivileges();
    if (!this.privilege.showAll) {return; }
    this.setDisplayedColumns();

    const pageRequest = new PageRequest();
    pageRequest.pageIndex  = this.pageIndex;
    pageRequest.pageSize  = this.pageSize;

    pageRequest.addSearchCriteria('code', this.codeField.value);
    pageRequest.addSearchCriteria('name', this.nameField.value);
    pageRequest.addSearchCriteria('mobile', this.mobileField.value);
    pageRequest.addSearchCriteria('email', this.emailField.value);


    this.customerService.getAll(pageRequest).then((page: CustomerDataPage) => {
        this.customerDataPage = page;
      }).catch( e => {
        console.log(e);
        this.snackBar.open('Something is wrong', null, {duration: 2000});
      });
  }
        //  7.create update privillege method
  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_CUSTOMER);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_CUSTOMERS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_CUSTOMER_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_CUSTOMER);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_CUSTOMER);
  }
        // 8.create setDisplayedColumns method
  setDisplayedColumns(): void{
    this.displayedColumns = ['code', 'name',  'mobile', 'land', 'email'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }
      // 9.create paginate method
  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }
     // 10.create delete method.
  async delete(customer: Customer): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: customer.code + ' - ' + customer.name }
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.customerService.delete(customer.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }

}
