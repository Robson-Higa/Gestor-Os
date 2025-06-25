export type TipoUsuario = 'admin' | 'tecnico' | 'usuario';

export interface Usuario {
  uid: string;
  nome: string;
  email: string;
  tipo: TipoUsuario;
}
