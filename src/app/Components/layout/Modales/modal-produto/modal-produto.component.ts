import { Component, OnInit, Inject } from '@angular/core';


import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Categoria } from '../../../../Interfaces/categoria';
import { Producto } from '../../../../Interfaces/producto';
import { CategoriaService } from '../../../../Services/categoria.service';
import { ProductoService } from '../../../../Services/producto.service';
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';



@Component({
  selector: 'app-modal-produto',
  templateUrl: './modal-produto.component.html',
  styleUrl: './modal-produto.component.css'
})
export class ModalProdutoComponent implements OnInit {

  formularioProducto:FormGroup;
  tituloAccion:string="Agregar";
  botonAccion:string="Guardar"
  listaCategorias:Categoria[]=[];


  constructor(
    private modalActual:MatDialogRef<ModalProdutoComponent>,
    @Inject(MAT_DIALOG_DATA)public datosProducto:Producto,
    private fb: FormBuilder,
    private _categoriaServicio:CategoriaService,
    private _productoServicio:ProductoService,
    private _utilidadServicio:UtilidadService
  ){
    this.formularioProducto = this.fb.group({
      nombre:["", Validators.required],
      idCategoria:["", Validators.required],
      stock:["", Validators.required],
      precio:["", Validators.required],
      esActivo:["", Validators.required],
    });

    if(this.datosProducto !== null){
      this.tituloAccion = "Editar";
      this.botonAccion = "Actualizar";
    }

    this._categoriaServicio.lista().subscribe({
      next:(data)=>{
        if(data.status = true) this.listaCategorias = data.value
      },
      error:(e)=>{}
    })
  }

  ngOnInit():void{
    if(this.datosProducto != null){
      this.formularioProducto.patchValue({
        nombre: this.datosProducto.nombre,
        idCategoria: this.datosProducto.idCategoria,
        stock: this.datosProducto.stock,
        precio: this.datosProducto.precio,
        esActivo: this.datosProducto.esActivo.toString()
      })
    }
  }

  guardarEditar_Producto(){

    const _producto:Producto = {
      idProducto: this.datosProducto == null ? 0:this.datosProducto.idProducto,
      nombre: this.formularioProducto.value.nombre,
      idCategoria: this.formularioProducto.value.idCategoria,
      descripcionCategoria: "",
      precio: this.formularioProducto.value.precio,
      stock: this.formularioProducto.value.stock,
      esActivo: parseInt(this.formularioProducto.value.esActivo)
    }

    if(this.datosProducto == null){
      this._productoServicio.guardar(_producto).subscribe({
        next:(data)=>{
          if(data.status){
            this._utilidadServicio.mostrarAlerta("El producto fuer registrado", "Exito");
            this.modalActual.close("ture");
            
          }else
          this._utilidadServicio.mostrarAlerta("No se puedo registrar el producto","Error")
        },
        error:(e)=>{}
      });
    }else{
      this._productoServicio.editar(_producto).subscribe({
        next:(data)=>{
          if(data.status){
            this._utilidadServicio.mostrarAlerta("El producto fue editado", "Exito");
            this.modalActual.close("ture");
            
          }else
          this._utilidadServicio.mostrarAlerta("No se puedo editar el producto","Error")
        },
        error:(e)=>{}
      });
    }
  }


}
