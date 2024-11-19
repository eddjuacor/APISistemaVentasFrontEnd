import { DetalleVenta } from "./detalle-venta"

export interface Venta {
    idVenta?:string,
    numeroDocumento?:string,
    tipoPago:string,
    fechaRegistro?:string,
    totalTexto:string,
    detalleVenta:DetalleVenta[]
}