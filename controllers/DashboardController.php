<?php

namespace Controllers;

use Model\Proyecto;
use Model\Usuario;
use MVC\Router;

class DashboardController{
    public  static function index(Router $router){
        session_start();
        isAuth();
        $id = $_SESSION['id'];
        $proyectos=Proyecto::belongsTo('propietarioId',$id);
        
    
    
    $router->render('dashboard/index',[
        'titulo'=> 'Proyectos',
        'proyectos' => $proyectos
    ]);
    }

    public static function crear_proyecto(Router $router){
        
        session_start();
        isAuth();
        $alertas=[];

        if($_SERVER['REQUEST_METHOD'] === 'POST'){
            $proyecto = new Proyecto($_POST);
            $alertas=$proyecto->validarProyecto();
        if(empty($alertas)){
            //generar una url unica
            $hash = md5(uniqid());
            $proyecto->url = $hash; //url del proyecto

             //almacenar el creador del proyecto
             $proyecto->propietarioId=$_SESSION['id'];

             //guardar proyecto
             $proyecto->guardar();

             //redireccionar
             header('Location:/proyecto?id=' . $proyecto->url);

            
            
        }
        }
        
        $alertas=Proyecto::getAlertas();

    $router->render('dashboard/crear-proyecto', [
        'titulo' => 'Crear Proyecto',
        'alertas' => $alertas
    ]);
        
    }

    
    public static function proyecto(Router $router){

    session_start();
    isAuth();
    $token = $_GET['id'];

    if(!$token) header('location:/dashboard');
    $proyecto= Proyecto::where('url',$token);
    if($proyecto->propietarioId !== $_SESSION['id'])  header('location:/dashboard');
       
        
    
    
    

    $alertas=Proyecto::getAlertas();
    $router->render('dashboard/proyecto',[
        'titulo' => $proyecto->proyecto,
        'alertas' => $alertas
    ]);
    }


     public static function perfil(Router $router){
        session_start();
        isAuth();
        $alertas=[];

        $usuario = Usuario::find($_SESSION['id']);
       
        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            $usuario->sincronizar($_POST);
            $alertas = $usuario->validar_perfil();
            if(empty($alertas)) {
                $existeUsuario = Usuario::where('email',$usuario->email);
                if($existeUsuario && $existeUsuario->id !== $usuario->id){
                    //mensaje de error
                    Usuario::setAlerta('error','Email no valido');
                }else {
                    //guardar Registro
                    $usuario->guardar();
                   // debuguear($resultado);
                    Usuario::setAlerta('exito','Guardado Correctamente');
                    //asignar el nombre nuevo a la barra
                    $_SESSION['nombre'] = $usuario->nombre;
                }
              
            }
           
        }
        $alertas = Usuario::getAlertas();
    $router->render('dashboard/perfil', [
        'titulo' => 'Perfil',
        'usuario' => $usuario,
        'alertas' => $alertas
    ]);

    }
}
?>