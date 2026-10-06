<?php
namespace Controllers;

use Clases\Email;
use Model\Usuario;
use MVC\Router;

class LoginController{
    public static function login(Router $router){
        $alertas=[];
        if($_SERVER['REQUEST_METHOD'] === 'POST'){
            $usuario=new Usuario($_POST);
            $alertas=$usuario->validarLogin();
            if(empty($alertas)){
                //verificamos que el usuario exista
                $usuario=Usuario::where('email',$usuario->email);
                if(!$usuario || !$usuario->confirmado){
                    Usuario::setAlerta('error','El Usuario no existe o no esta confirmado');
                }else{//comprobar password
                    if(password_verify($_POST['password'],$usuario->password)){
                        session_start();
                        $_SESSION['id']=$usuario->id;
                        $_SESSION['nombre']=$usuario->nombre;
                        $_SESSION['email']=$usuario->email;
                        $_SESSION['login']=true;
                        
                        header('Location:/dashboard');
                    }else{
                        Usuario::setAlerta('error','Password Incorrecto');
                    }
                    
                    
                }
                
            }
            
        }
        $alertas=Usuario::getAlertas();
        $router->render('auth/login',[
            'titulo'=>'Iniciar Sesion',
            'alertas' => $alertas

        ]);
    }

    //Muestra la vista
    public static function logout(){
        session_start();
        $_SESSION = [];
        header('Location:/');
    }

    public static function crear(Router $router){
        $alertas=[];
        $usuario = new Usuario();

        if($_SERVER['REQUEST_METHOD'] === 'POST'){
            $usuario->sincronizar($_POST);
            $alertas=$usuario->validarNuevaCuenta();
            if(empty($alertas)){
                $existeUsuario=Usuario::where('email',$usuario->email);
                if($existeUsuario){
                    Usuario::setAlerta('error','Usuario ya Registrado');
                    $alertas=$usuario::getAlertas();                   
                }else{
                    //crear un nuevo usuario
                    $usuario->hashPassword();
                    //Eliminar password2
                    unset($usuario->password2);
                    //generar token
                     $usuario->crearToken();
                    
                     $email=new Email($usuario->email,$usuario->nombre,$usuario->token);
                     $email->enviarConfirmacion();
                     //crear Usuario
                    $resultado=$usuario->guardar();
                    if($resultado){
                        header('Location:/mensaje');
                    }
                }
            }
            

            

        }
        //Muestra la vista
        $router->render('auth/crear',[
            'usuario'=>$usuario,
            'titulo'=>'Crear Cuenta',
            'alertas' => $alertas
        ]);

    }

    public static function olvide(Router $router){
        $alertas=[];
        if($_SERVER['REQUEST_METHOD'] === 'POST'){
            $usuario=new Usuario($_POST);
            $alertas=$usuario->validarEmail();
           if(empty($alertas)){
            //Buscar el usuario
            $usuario=Usuario::where('email',$usuario->email); 
            if($usuario && $usuario->confirmado){
                //generar nuevo token
                $usuario->crearToken();
                unset($usuario->password2);

                //actualizar el usuario
                $usuario->guardar();

                //emviar el email
                $email = new Email($usuario->email,$usuario->nombre,$usuario->token);
                $email->enviarInstrucciones();
                
                //imprimer alerta
                Usuario::setAlerta('exito','Hemos enviado las instrucciones a tu email');                
            } else{
                Usuario::setAlerta('error','El Usuario no existe o no esta confirmado');
            }
           }

        }
        $alertas=Usuario::getAlertas();
    //Muestra la vista
        $router->render('auth/olvide',[
            'titulo'=>'Olvide Cuenta',
             'alertas' => $alertas
        ]);
    }

    public static function reestablecer(Router $router){
    $token=s($_GET['token']);
    $mostrar=true;
    if(!$token) header('Location:/');
    $usuario=Usuario::where('token',$token);
    if(empty($usuario)){
        Usuario::setAlerta('error','Token no valido');
        $mostrar=false;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST'){
        $usuario->sincronizar($_POST);
        $alertas=$usuario->validarPassword();
        if(empty($alertas)){
            $usuario->hashPassword();
            $usuario->token = null;
            $resultado=$usuario->guardar();
            if($resultado){
                header('Location:/');
            }
        }
        
        
       
    }
    $alertas=Usuario::getAlertas();
    //Muestra la vista
        $router->render('auth/reestablecer',[
            'titulo' =>'Reestablecer Password',
            'alertas' => $alertas,
            'mostrar' => $mostrar
        ]);
    }

    public static function confirmar(Router $router){
       $token=s($_GET['token']);
       if(!$token) header('Location:/');
       $usuario = Usuario::where('token',$token);
       if(empty($usuario)){
            Usuario::setAlerta('error','token no valido');
       }else{
        //confirmar la cuenta
        $usuario->token=null;
        unset($usuario->password2);
        $usuario->confirmado=1;

        //guardar en la base de datos
        $usuario->guardar();
        Usuario::setAlerta('exito','Usuario Creado Correctamente');
       }

        $alertas=Usuario::getAlertas();
    //Muestra la vista
    $router->render('/auth/confirmar',[
        'titulo' => 'Confirma tu cuenta UpTask',
        'alertas' => $alertas
    ]);
    }

    public static function mensaje(Router $router){
        

    //Muestra la vista 
    $router->render('auth/mensaje',[
        'titulo'=> 'Cuenta creada Exitosamente'
    ]);
    }

}
?>