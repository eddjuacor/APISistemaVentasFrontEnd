import { Component, OnInit, AfterViewInit, ViewChild, viewChild } from '@angular/core';

import { FormBuilder, FormGroup, Validators, ValueChangeEvent } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { MAT_DATE_FORMATS } from '@angular/material/core';
import moment from 'moment';

import * as XLSX from "xlsx"

import { Reporte } from '../../../../Interfaces/reporte';
import { VentaService } from '../../../../Services/venta.service';
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';


export const MY_DATA_FORMATS={
  parse:{
    dateInput: 'DD/MM/YYYY'
  },
  display:{
    dateInput: 'DD/MM/YYYY',
    monthYearLabel:'MMMM YYYY'
  }
}



@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrl: './reporte.component.css',
  providers:[
    {provide:MAT_DATE_FORMATS,useValue:MY_DATA_FORMATS}
  ]
})
export class ReporteComponent implements OnInit{

  //variables
  formularioFiltro:FormGroup;
  listaVentaReporte:Reporte[]=[];
  columnasTabla:string[]=['fechaRegistro','numeroVenta','tipoPago','total','producto','cantidad','totalProducto'];
  dataVentaReporte=new MatTableDataSource(this.listaVentaReporte);
  @ViewChild(MatPaginator) paginacionTabla!:MatPaginator;


  constructor(
    //inyecciones
    private fb:FormBuilder,
    private _ventaServicio:VentaService,
    private _utilidadServicio:UtilidadService
  ){
    //campos formulario
    this.formularioFiltro = this.fb.group({
      fechaInicio:['', Validators.required],
      fechaFin:['', Validators.required]
    })
  }

  ngOnInit(): void {
    
  }

  //paginacion
  ngAfterViewInit(): void {
    this.dataVentaReporte.paginator=this.paginacionTabla;
  }

  //busqueda segun rango especificado
  buscarVentas(){
    const _fechaInicio = moment(this.formularioFiltro.value.fechaInicio).format("DD/MM/YYYY");
    const _fechaFin = moment(this.formularioFiltro.value.fechaFin).format("DD/MM/YYYY");

    if(_fechaInicio === "invalid date" || _fechaFin === "invalid date")
      {
        this. _utilidadServicio.mostrarAlerta("Debe ingresar ambas fechas", "Oops!")
        return;
      }

      this._ventaServicio.reporte(
        _fechaFin,
        _fechaFin
      ).subscribe({
        next:(data)=>{
          if(data.status){
            this.listaVentaReporte = data.value;
            this.dataVentaReporte = data.value;
          }else{
            this.listaVentaReporte=[];
            this.dataVentaReporte.data=[];
            this._utilidadServicio.mostrarAlerta("No se encontro datos", "Oops!")  
          }
        },
        error:(e)=>{}
      })
  }

  exportarExcel(){
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(this.listaVentaReporte);

    XLSX.utils.book_append_sheet(wb, ws, "Reporte");
    XLSX.writeFile(wb, "Reporte Ventas.xlsx");
  }
}
