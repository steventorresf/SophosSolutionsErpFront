export interface dataCliente{
  success: boolean;
  status: string;
  result: resultCliente[];
  message: string;
}

export interface resultCliente{
  idCliente: number;
  identificacion: string;
  nombre: string;
  apellido: string;
  telefono: string;
}
