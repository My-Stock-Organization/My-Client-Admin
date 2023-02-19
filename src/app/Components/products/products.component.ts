import { Component, OnInit } from '@angular/core';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {AfterViewInit, ViewChild} from '@angular/core';
import {MatSort, Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/Services/product/product.service';
import { MatDialog } from '@angular/material/dialog';
import {AddProductDialogComponent} from '../add-product-dialog/add-product-dialog.component'
import {EditProductComponent} from '../edit-product/edit-product.component'
import { MatPaginator } from '@angular/material/paginator';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})

export class ProductsComponent implements AfterViewInit, OnInit{

  products:[]|any= [];
  displayedColumns: string[] = ['image', 'title', 'price','category', 'action'];
    dataSource = new MatTableDataSource(this.products);

    @ViewChild(MatSort)sort!: MatSort;
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    ngAfterViewInit() {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }

    constructor(
      private _liveAnnouncer: LiveAnnouncer,
      private router: ActivatedRoute,
      private prodServ: ProductService,
      public dialog: MatDialog
      ) {
       this.getProducts();
      }

    announceSortChange(sortState: Sort) {
      if (sortState.direction) {
        this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
      } else {
        this._liveAnnouncer.announce('Sorting cleared');
      }
    }


  ngOnInit(): void {
    // this.applyFilter(event);
    this.getProducts();
    this.dataSource.filterPredicate = function (record,filter) {
      return true;
    }
  }

  getProducts(){
    this.prodServ.getAllProducts().subscribe((res:any)=>{
      console.log(res.data[0].title);
      this.products = res.data;
      console.log(this.products);

      this.dataSource=new MatTableDataSource(this.products);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      // localStorage.setItem("idProduct", res.data._id);
    },error=>{console.log("Error");})
  }

  animal: string="";
  name: string="";
  openModel(){
      const dialogRef = this.dialog.open(AddProductDialogComponent, {
        // data: {name: this.name, animal: this.animal}
        height: '400px',
        width: '900px',
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.animal = result;
        this.getProducts();
      });

  }
  openEditModel(index:number){
      const dialogRef = this.dialog.open(EditProductComponent, {
        // data: {name: this.name, animal: this.animal}
        height: '400px',
        width: '900px',
        data: this.products[index],
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.animal = result;
        this.getProducts();
      });

  }
  deleteById(_id:any){
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.prodServ.deleteProduct(_id).subscribe(res=>{
          this.getProducts();
        });
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
      }
    })

  }

  applyFilter(event: Event ){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if(this.dataSource.paginator){
      this.dataSource.paginator.firstPage();
    }
  }
}

