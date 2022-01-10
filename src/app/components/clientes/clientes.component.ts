import { Component, OnInit } from '@angular/core';
import { ClientesService  } from '../../shared/services/cliente.service';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { resultCliente } from 'src/app/shared/models/clienteDto';

const RESULT_CLIENTE: resultCliente = {
  idCliente: 0,
  identificacion: '',
  nombre: '',
  apellido: '',
  telefono: ''
}

@Component({
  selector: 'app-clientes',
  providers: [ ClientesService ],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.sass']
})
export class ClientesComponent implements OnInit {
  dataSource: resultCliente[] = [];
  entity: resultCliente = RESULT_CLIENTE;
  modo: number = 0;
  textForm: string = '';
  gridVisible: boolean = true;
  formVisible: boolean = false;

  myForm: FormGroup = new FormGroup({});

  get identificacion(){
    return this.myForm.get('identificacion');
  }
  get nombre(){
    return this.myForm.get('nombre');
  }
  get apellido(){
    return this.myForm.get('apellido');
  }
  get telefono(){
    return this.myForm.get('telefono');
  }

  constructor(
    private clientesService : ClientesService,
  ) { }

  ngOnInit(): void {
    this.getAll();
  }

  getAll(){
    this.clientesService.getAll()
      .subscribe(response => {
        if(response.success){
          this.dataSource = response.result;
          if(this.dataSource.length == 0){
            this.dataSource.push(RESULT_CLIENTE);
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
        identificacion: new FormControl('', [Validators.required]),
        nombre: new FormControl('', [Validators.required]),
        apellido: new FormControl('', [Validators.required]),
        telefono: new FormControl('', [Validators.required]),
      });
    }
    else{
      this.myForm = new FormGroup({
        identificacion: new FormControl(this.entity.identificacion, [Validators.required]),
        nombre: new FormControl(this.entity.nombre, [Validators.required]),
        apellido: new FormControl(this.entity.apellido, [Validators.required]),
        telefono: new FormControl(this.entity.telefono, [Validators.required]),
      });
    }
  }

  nuevo(){
    this.textForm = 'NUEVO PRODUCTO';
    this.entity = RESULT_CLIENTE;
    this.modo = 1;
    this.gridVisible = false;
    this.formVisible = true;

    this.setMyForm();
  }

  editar(item: resultCliente){
    this.textForm = 'EDITAR CLIENTE';
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
      this.entity.identificacion = this.myForm.value.identificacion;
      this.entity.nombre = this.myForm.value.nombre;
      this.entity.apellido = this.myForm.value.apellido;
      this.entity.telefono = this.myForm.value.telefono;
      this.guardar();
    }
  }

  guardar(){
    if(this.modo == 1){
      this.clientesService.Create(this.entity)
      .subscribe(response => {
        if(response.success){
          this.entity = RESULT_CLIENTE;
          this.setMyForm();
          this.getAll();
          this.cancelar();
        }
        else{
          alert(response.message);
        }
      });
    }
    else{
      this.clientesService.Update(this.entity)
      .subscribe(response => {
        if(response.success){
          this.entity = RESULT_CLIENTE;
          this.setMyForm();
          this.getAll();
          this.cancelar();
        }
        else{
          alert(response.message);
        }
      });
    }
  }

  eliminar(item: resultCliente){
    this.clientesService.Delete(item.idCliente)
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
