import { Component, OnInit } from '@angular/core';
import { resultProducto } from 'src/app/shared/models/productoDto';
import { ProductosService  } from '../../shared/services/producto.service';

import { FormControl, FormGroup, Validators } from '@angular/forms';

const RESULT_PRODUCTO: resultProducto = {
  idProducto: 0,
  nombre: '',
  valorUnitario: null
}

@Component({
  selector: 'app-productos',
  providers: [ ProductosService ],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.sass']
})
export class ProductosComponent implements OnInit {
  dataSource: resultProducto[] = [];
  entity: resultProducto = RESULT_PRODUCTO;
  modo: number = 0;
  textForm: string = '';
  gridVisible: boolean = true;
  formVisible: boolean = false;

  myForm: FormGroup = new FormGroup({});

  get nombre(){
    return this.myForm.get('nombre');
  }
  get valorUnitario(){
    return this.myForm.get('valorUnitario');
  }

  constructor(
    private productoService : ProductosService,
  ) { }

  ngOnInit(): void {
    this.getAll();
  }

  getAll(){
    this.productoService.getAll()
      .subscribe(response => {
        if(response.success){
          this.dataSource = response.result;
          if(this.dataSource.length == 0){
            this.dataSource.push(RESULT_PRODUCTO);
          }
        }
        else{
          alert(response.message);
        }
      });
  }

  setMyForm(){
    if(this.modo == 1){
      this.myForm = new FormGroup({
        nombre: new FormControl('', [Validators.required]),
        valorUnitario: new FormControl('', [Validators.required, Validators.min(1)]),
      });
    }
    else{
      this.myForm = new FormGroup({
        nombre: new FormControl(this.entity.nombre, [Validators.required]),
        valorUnitario: new FormControl(this.entity.valorUnitario, [Validators.required, Validators.min(1)]),
      });
    }
  }

  nuevo(){
    this.textForm = 'NUEVO PRODUCTO';
    this.entity = RESULT_PRODUCTO;
    this.modo = 1;
    this.gridVisible = false;
    this.formVisible = true;

    this.setMyForm();
  }

  editar(item: resultProducto){
    this.textForm = 'EDITAR PRODUCTO';
    this.entity = item;
    this.modo = 2;
    this.gridVisible = false;
    this.formVisible = true;

    this.setMyForm();
  }


  cancelar(){
    this.modo = 0;
    this.formVisible = false;
    this.gridVisible = true;
  }

  onSubmit() {
    if(this.myForm.valid){
      this.entity.nombre = this.myForm.value.nombre;
      this.entity.valorUnitario = this.myForm.value.valorUnitario;
      this.guardar();
    }
  }

  guardar(){
    if(this.modo == 1){
      this.productoService.Create(this.entity)
      .subscribe(response => {
        if(response.success){
          this.getAll();
          this.cancelar();
        }
        else{
          alert(response.message);
        }
      });
    }
    else{
      this.productoService.Update(this.entity)
      .subscribe(response => {
        if(response.success){
          this.getAll();
          this.cancelar();
        }
        else{
          alert(response.message);
        }
      });
    }
  }

  eliminar(item: resultProducto){
    this.productoService.Delete(item.idProducto)
      .subscribe(response => {
        if(response.success){
          this.getAll();
        }
        else{
          alert(response.message);
        }
      });
  }

}
