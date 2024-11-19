import { Component, OnInit } from '@angular/core';

import {Chart, registerables} from 'chart.js'
import { DashboardService } from '../../../../Services/dashboard.service';
Chart.register(...registerables);


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  //variables
  totalIngresos:string = "0";
  totalVentas:string = "0";
  totalProductos:string = "0";


  constructor(
    private _dashboardServicio:DashboardService
  ){}

  mostrarGraficos(labbelGrafico:any[], dataGrafico:any){

    const chartBarras = new Chart("chartBarras",{
      type:'bar',
      data:{
        labels:labbelGrafico,
        datasets:[{
          label:"# de Ventas",
          data:dataGrafico,
          backgroundColor:[
            'rgba(54,162,235,0.2)'
          ],
          borderColor:[
            'rgba(54, 1162, 235, 1)'
          ],
          borderWidth:1
        }]
      },
      options:{
        maintainAspectRatio:false,
        responsive:true,
        scales:{
          y:{
            beginAtZero:true
          }
        }
      }
    });
  }

  ngOnInit(): void {
    this._dashboardServicio.resumen().subscribe({
      next:(data)=>{
        if(data.status){
          this.totalIngresos = data.value.totalIngresos;
          this.totalVentas = data.value.totalVentas;
          this.totalProductos = data.value.totalProductos;

          const arrayData:any[]=data.value.ventasUltimaSemana;

          const labelTemp = arrayData.map((value)=> value.fecha);
          const dataTemp = arrayData.map((value)=> value.total);
          console.log(labelTemp, dataTemp);
          this.mostrarGraficos(labelTemp,dataTemp);
        }
      },
      error:(e)=>{}
    })
  }
}
