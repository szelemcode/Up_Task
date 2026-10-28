<?php

namespace Model;

class Usuario extends ActiveRecord{
    protected static $tabla = 'usuarios';
    protected static $columnasDB = ['id','nombre','email','password','token','confirmado'];
      //en la base de datos solo existe un atributo password
     public $id;
     public $nombre;
     public $email;
     public $password;
     public $password2;
     public $token;
     public $confirmado;

     public function __construct($arg=[]){
        $this->id = $arg['id'] ?? null;
        $this->nombre= $arg['nombre'] ?? '';
        $this->email = $arg['email'] ?? '';
        $this->password = $arg['password'] ?? '';
        $this->password2 = $arg['password2'] ?? null;
        $this->token = $arg['token'] ?? '';
        $this->confirmado = $arg['confirmado'] ?? 0;
     }

     public function validarNuevaCuenta(){
      if(!$this->nombre){
         self::$alertas['error'][]='El nombre del Usuario es obligatorio';
      }
      if(!$this->email){
         self::$alertas['error'][]='El email del Usuario es obligatorio';
      }
      if(!$this->password){
         self::$alertas['error'][]='El password del Usuario es obligatorio';
      }
      if(strlen($this->password)<6){
         self::$alertas['error'][]='El password tiene que tener al menos6 caracteres';
      }
      if($this->password !== $this->password2){
         self::$alertas['error'][]='Los passwords son diferentes';
      }
      return self::$alertas;
     }

     public function validarEmail(){
      if(!$this->email){
         self::$alertas['error'][]='El mail es obligatorio';
      }
      if(!filter_var($this->email, FILTER_VALIDATE_EMAIL)){
         Usuario::setAlerta('error','El Email no es valido');
      }
      
      return self::$alertas;
     }

     public function validar_perfil() {
      if(!$this->nombre) {
         self::$alertas['error'][]='El nombre es obligatorio';
      }
      if(!$this->email){
         self::$alertas['error'][]='El Email es obligatorio';
      }
      return self::$alertas;
     }

     public function validarPassword(){
      if(!$this->password){
         self::$alertas['error'][]='El password del Usuario es obligatorio';
      }
      if(strlen($this->password)<6){
         self::$alertas['error'][]='El password tiene que tener al menos6 caracteres';
      }
     }

     public function validarLogin(){
      $this->validarEmail();
      $this->validarPassword();
      return self::$alertas;
     }

     public function existeUsuario(){
      $query= "select * from " . static::$tabla . "where email=" . self::$db->scape_string($this->email);
      $query.="limit 1";
      $resultado=self::$db->query($query);
      if($resultado->num_rows){
         self::$alertas['error'][]='El usuario ya esta registrado';
      }
      return $resultado;
     }

     //Hashea el password
     public function hashPassword(){
      $this->password = password_hash($this->password, PASSWORD_BCRYPT);
     }

     //Generar Token
      public function crearToken(){
      $this->token=uniqid();
     }

   
     
}


     
?>