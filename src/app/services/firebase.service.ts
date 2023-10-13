import { Injectable } from '@angular/core';
import { 
  Auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
  authState,
  signOut
} from '@angular/fire/auth'; 
import { Firestore, collection, addDoc, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { Usuario } from '../models/usuario.model';
import { UtilsService } from './utils.service';
import { Answer } from '../models/answer.model';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
    private auth: Auth,
    private db: Firestore,
    private utilsService: UtilsService
  ) { }

  // AUTENTICACION
  login(usuario: Usuario){
    return signInWithEmailAndPassword(this.auth, usuario.email, usuario.password)
  }

  signUp(usuario: Usuario){
    return createUserWithEmailAndPassword(this.auth, usuario.email, usuario.password)
  }

  updateUser(usuario: any){
    const auth = getAuth();
    return updateProfile(auth.currentUser, usuario)
  }

  getAuthState(){
    return authState;
  }

  async signOut(){
    await signOut(this.auth);
    this.utilsService.routerLink('/inicio-sesion');
    localStorage.removeItem('usuario')
  }

  // FIRESTORE
  async addAnswer(answer: Answer, userId: string, cnt: number){
    let respuesta = "respuestas/" + JSON.stringify(cnt);
    let path = `users/${userId}`;
    await setDoc(doc(this.db, path, respuesta), answer); 
  }
}
