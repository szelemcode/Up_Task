<?php

namespace Controllers;

use Model\Proyecto;
use Model\Tarea;

class TareaController{
    public static function index () {
        session_start();
        $proyectoId = $_GET['id'];

        if(!$proyectoId){
            header('Location:/dashboard');
        }

        $proyecto = Proyecto::where('url',$proyectoId);
        if(!$proyecto || $proyecto->propietarioId !== $_SESSION['id']){
            header('Location:/404');
        }

        $tareas = Tarea::belongsTo('proyectoId',$proyecto->id);

        echo json_encode(['tareas' => $tareas]);
    }

    public static function crear () {
        if($_SERVER['REQUEST_METHOD'] === 'POST'){

        session_start();
        $proyectoId=$_POST['proyectoId'];// obtiene la url que se usara para buscar el proyecto
        $proyecto = Proyecto::where('url',$proyectoId);// buscamos el proyecto con la url
        if(!$proyecto  || $proyecto->propietarioId !== $_SESSION['id']) {
            $respuesta = [
                'tipo' => 'error',
                'mensaje' => 'Hubo un error al agregar la tarea'
            ];
            echo json_encode($respuesta);
            return;
           } // else{
        //      $respuesta = [
        //         'tipo' => 'exito',
        //         'mensaje' => 'Tarea Creada Correctamente'
        //     ];
        //     echo json_encode($respuesta);
        //     }
        
        //Todo bien crear e instanciar tarea
        $tarea = new Tarea($_POST);//va a tener el nombre de la tarea y el proyecto id
        $tarea->proyectoId = $proyecto->id; //el proyectoId tiene la url , pero nosotros necesimaos
        // insertar el id sino dara error ,por eso se cambia el valor
        $resultado = $tarea->guardar();
        $respuesta = [
            'tipo' => 'exito',
            'id' => $resultado['id'],
            'mensaje' => 'Tarea Creada Correctamente'
        ];
        echo json_encode($respuesta);
        }


    }

    public static function actualizar () {
         if($_SERVER['REQUEST_METHOD'] === 'POST'){
            
        }

    }
 
    public static function eliminar () {
         if($_SERVER['REQUEST_METHOD'] === 'POST'){
            
        }

    }
 
}

?>