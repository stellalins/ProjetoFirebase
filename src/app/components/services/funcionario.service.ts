import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import firebase  from 'firebase/compat/app';
import 'firebase/compat/storage'
import { environment } from 'src/environments/environment';

import { Observable, Subject } from 'rxjs';
import { Funcionario } from '../funcionario/funcionario';


firebase.initializeApp(environment.firebase)

@Injectable({
  providedIn: 'root'
})
export class FuncionarioService {

  private funcionarioEdit = new Subject<any>()

  storageRef = firebase.app().storage().ref()

  constructor( private fireAngular:AngularFirestore) { }

  listarFuncionarios(): Observable<any>{
    return this.fireAngular.collection('funcionario').snapshotChanges();
  }

  addFuncionario(funcionario: Funcionario):Promise<any>{
    return this.fireAngular.collection('funcionario').add(funcionario)
  }

  excluirFuncionario(id: string):Promise<any>{
    return this.fireAngular.collection('funcionario').doc(id).delete()
  }

  pegarDadosDoFuncionarioEscolhido(funcionario:Funcionario){
    this.funcionarioEdit.next(funcionario)
  }

  getFuncionarioEdit(): Observable<Funcionario>{
    return this.funcionarioEdit.asObservable()
  }

  editarFuncionario(id: string, funcionario:Funcionario):Promise<any>{
    return this.fireAngular.collection('funcionario').doc(id).update(funcionario)
  }

  async subirImagem(nome: string, imgBase64:any){
    try{
      let resultado = await this.storageRef.child("imgFoto/" + nome).putString(imgBase64,'data_url')
      console.log(resultado)
      return await resultado.ref.getDownloadURL()
    }catch(err){
      console.log(err)
      return null
    }
  }


}