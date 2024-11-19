import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validator, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from '../../Interfaces/login';
import { UsuarioService } from '../../Services/usuario.service';
import { UtilidadService } from '../../Reutilizable/utilidad.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  formularioLogin:FormGroup;
  ocultarPassword:boolean = true;
  mostrarLoading:boolean = false

  constructor(
    private fb:FormBuilder, 
    private router:Router, 
    private _usuarioServicio: UsuarioService,
    private _utilidadServicio: UtilidadService
  ){

    this.formularioLogin = this.fb.group({
      email:['',Validators.required],
      password:['',Validators.required]
    });
  }

  ngOnInit(): void {
    
  }

  iniciarSesion(){

    this.mostrarLoading=true;

    const request:Login = {
      correo: this.formularioLogin.value.email,
      clave: this.formularioLogin.value.password
    }

    this._usuarioServicio.iniciarSesion(request).subscribe({
      next:(data)=>{
        if(data.status){
          this._utilidadServicio.guardarSesionUsuario(data.value);
          this.router.navigate(["pages"])
        }else
          this._utilidadServicio.mostrarAlerta("No se encontraro coinsidencias", "Oopss!")
      },
      complete: ()=>{
        this.mostrarLoading = false;
      },
      error:()=>{
        this._utilidadServicio.mostrarAlerta("Hubo un error", "Ooppss!")
      }
    })
  }
}
