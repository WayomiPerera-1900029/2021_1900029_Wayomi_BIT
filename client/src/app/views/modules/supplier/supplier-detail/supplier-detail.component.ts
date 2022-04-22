import { Component, OnInit } from '@angular/core';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Supplier} from '../../../../entities/supplier';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {SupplierService} from '../../../../services/supplier.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';

@Component({
  selector: 'app-supplier-detail',
  templateUrl: './supplier-detail.component.html',
  styleUrls: ['./supplier-detail.component.scss']
})
export class SupplierDetailComponent extends AbstractComponent implements OnInit {


  /*
  *  1.define a variable as module name
  *  2. define comdtructer method with injecting relevant dependency
  *  3. define ngonInit
  *  4. define delete method
  *  5. define load data method
  *  6.  define update privilage method
  */
  supplier: Supplier ;
  selectedId: number;
  //  2. define comdtructer method with injecting relevant dependency

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private supplierService: SupplierService,
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
      data: {message: this.supplier.code + ' - ' + this.supplier.name}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.supplierService.delete(this.selectedId);
        await this.router.navigateByUrl('/suppliers');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }
  // 5. define load data method
  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.supplier = await this.supplierService.get(this.selectedId);
  }
  //  6.  define update privilage method
  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_SUPPLIER);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_SUPPLIERS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_SUPPLIER_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_SUPPLIER);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_SUPPLIER);
  }

}
