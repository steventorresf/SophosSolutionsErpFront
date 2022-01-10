import { Component, OnInit } from '@angular/core';
import { VentasService  } from '../../shared/services/venta.service';
import { ClientesService  } from '../../shared/services/cliente.service';
import { ProductosService  } from '../../shared/services/producto.service';

import { FormControl, FormGroup, Validators } from '@angular/forms';

const PRODUCTO_DEFAULT: any = {
  id: 0,
  idProducto: 0,
  nombre: '',
  cantidad: null,
  valorUnitario: null,
  valorTotal: null,
};

@Component({
  selector: 'app-ventas',
  providers: [ VentasService, ClientesService, ProductosService ],
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.sass']
})
export class VentasComponent implements OnInit {
  gridVisible: boolean = true;
  formVisible: boolean = false;
  ventaVisible: boolean = false;
  dataClientes: any[] = [];
  dataProductos: any[] = [];
  productoList: any[] = [PRODUCTO_DEFAULT];
  id: number = 0;
  nombre: string = '';
  dataVenta: any = {
    noVenta: 0,
    nombreCliente: '',
    fechaVenta: '',
    ventaDetalleList: []
  };

  myForm: FormGroup = new FormGroup({
    idCliente: new FormControl(null, [Validators.required]),
    fechaVenta: new FormControl(null, [Validators.required])
  });
  myFormPro: FormGroup = new FormGroup({});

  constructor(
    private ventaService : VentasService,
    private clientesService : ClientesService,
    private productoService : ProductosService,
  ) { }

  getClientes(){
    this.clientesService.getAll()
      .subscribe(response => {
        if(response.success){
          this.dataClientes = response.result;
        }
        else{
          alert(response.message);
        }
      });
  }

  getProductos(){
    this.productoService.getAll()
      .subscribe(response => {
        if(response.success){
          this.dataProductos = response.result;
        }
        else{
          alert(response.message);
        }
      });
  }

  ngOnInit(): void {
    this.getClientes();
    this.getProductos();
  }

  setMyFormPro(){
    this.myFormPro = new FormGroup({
      idProducto: new FormControl('', [Validators.required]),
      cantidad: new FormControl(1, [Validators.required, Validators.min(1)]),
      valorUnitario: new FormControl(null, [Validators.required, Validators.min(1)]),
    });
  }

  get idCliente(){
    return this.myForm.get('idCliente');
  }

  get fechaVenta(){
    return this.myForm.get('fechaVenta');
  }

  get idProducto(){
    return this.myFormPro.get('idProducto');
  }
  get cantidad(){
    return this.myFormPro.get('cantidad');
  }
  get valorUnitario(){
    return this.myFormPro.get('valorUnitario');
  }

  agregar(){
    this.setMyFormPro();
    this.gridVisible = false;
    this.formVisible = true;
  }

  cancelar(){
    this.formVisible = false;
    this.gridVisible = true;
  }

  changeSelectModel($event: any){
    for(let i = 0; i < this.dataProductos.length; i++){
      if(this.dataProductos[i].idProducto == $event){
        this.myFormPro = new FormGroup({
          idProducto: new FormControl(this.myFormPro.value.idProducto, [Validators.required]),
          cantidad: new FormControl(1, [Validators.required, Validators.min(1)]),
          valorUnitario: new FormControl(this.dataProductos[i].valorUnitario, [Validators.required, Validators.min(1)]),
        });
        this.nombre = this.dataProductos[i].nombre;
        break;
      }
    }
  }

  onSubmitPro(){
    if(this.myFormPro.valid){
      if(this.productoList.length == 1 && this.productoList[0].idProducto == 0){
        this.productoList = [];
      }

      this.id++;
      this.productoList.push({
        id: this.id,
        idProducto: this.myFormPro.value.idProducto,
        nombre: this.nombre,
        cantidad: this.myFormPro.value.cantidad,
        valorUnitario: this.myFormPro.value.valorUnitario,
        valorTotal: this.myFormPro.value.valorUnitario * this.myFormPro.value.cantidad,
      });

      this.cancelar();
    }
  }

  quitar(item: any){
    let ind = -1;
    for(let i = 0; i < this.productoList.length; i++){
      if(this.productoList[i].id == item.id){
        ind = i;
        break;
      }
    }

    this.productoList.splice(ind, 1);

    if(this.productoList.length == 0){
      this.productoList = [PRODUCTO_DEFAULT];
    }
  }

  onSubmit(){
    if(this.myForm.valid){
      if(this.productoList.length > 0){
        if(this.productoList.length == 1 && this.productoList[0].id == 0){
          return;
        }

        let obData: any = {
          idCliente: this.myForm.value.idCliente,
          fechaVenta: this.myForm.value.fechaVenta,
          ventaDetalleList: [],
        }

        for(let i = 0; i < this.productoList.length; i++){
          obData.ventaDetalleList.push(this.productoList[i]);
        }

        this.ventaService.Create(obData)
          .subscribe(response => {
            if(response.success){
              this.gridVisible = false;
              this.ventaVisible = true;
              this.postSubmitOk(response.result);
            }
            else{
              alert(response.message);
            }
          });
      }
    }
  }

  postSubmitOk(id: number){
    this.ventaService.get(id)
      .subscribe(response => {
        if(response.success){
          this.dataVenta = response.result;
        }
        else{
          alert(response.message);
        }
      });
  }

  nuevaVenta(){
    window.location.reload();
  }

}
