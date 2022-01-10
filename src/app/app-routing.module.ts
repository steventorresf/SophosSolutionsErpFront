import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ClientesComponent } from  './components/clientes/clientes.component';
import { ProductosComponent } from  './components/productos/productos.component';
import { VentasComponent } from  './components/ventas/ventas.component';

const routes: Routes = [
  { path: 'Clientes', component: ClientesComponent },
  { path: 'Productos', component: ProductosComponent },
  { path: 'Ventas', component: VentasComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
