export interface dataProducto{
  success: boolean;
  status: string;
  result: resultProducto[];
  message: string;
}

export interface resultProducto{
  idProducto: number;
  nombre: string;
  valorUnitario: number | null;
}
