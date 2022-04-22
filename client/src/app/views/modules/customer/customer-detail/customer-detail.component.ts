import { Component, OnInit } from '@angular/core';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Customer} from '../../../../entities/customer';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {EmployeeService} from '../../../../services/employee.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CustomerService} from '../../../../services/customer.service';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.scss']
})
export class CustomerDetailComponent extends AbstractComponent implements OnInit {

      /*
      *  1.define a variable as module name
      *  2. define comdtructer method with injecting relevant dependency
      *  3. define ngonInit
      *  4. define delete method
      *  5. define load data method
      *  6.  define update privilage method
      */
  customer: Customer ;
  selectedId: number;
      //  2. define comdtructer method with injecting relevant dependency

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private customerService: CustomerService,
    private snackBar: MatSnackBar
  ) {
    super();
  }
    // 3. define ngonInit

  ngOnInit(): void {
    this.route.paramMap.subscribe( async (params) => {
      this.selectedId = + params.get('id');
      try{
        await this.loadData();
      } finally {
        this.initialLoaded();
        this.refreshData();
      }
    });
  }
   // 4. define delete method
  async delete(): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: this.customer.code + ' - ' + this.customer.name}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.customerService.delete(this.selectedId);
        await this.router.navigateByUrl('/customers');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }
    // 5. define load data method
  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.customer = await this.customerService.get(this.selectedId);
  }
  //  6.  define update privilage method
    updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_CUSTOMER);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_CUSTOMERS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_CUSTOMER_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_CUSTOMER);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_CUSTOMER);
  }
}
