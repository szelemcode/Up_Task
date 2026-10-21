(function(){
    obtenerTareas();
    let tareas =[];
    
    //BOTON PARA MOSTRAR EL MODAL DE AGREGAR TAREA
    const nuevaTareaBtn=document.querySelector('#agregar-tarea');
    nuevaTareaBtn.addEventListener('click',function(){
        mostrarFormulario();
    });

    async function obtenerTareas(){
        try {
            const id=obtenerProyecto();
            const url=`api/tareas?id=${id}`;// url relativa
            const respuesta = await fetch(url);
            const resultado = await respuesta.json();

            //const {tareas} = resultado; //destructuring
            tareas=resultado.tareas;//asignamos resultado.tareas a la variable global tareas
            mostrarTareas();
           // console.log(url);

        } catch (error){

        }
    }

function mostrarTareas(){
    limpiarTareas();
    if(tareas.length === 0){
        const contenedorTareas = document.querySelector('#listado-tareas');

        const textoNoTareas = document.createElement('LI');// no puede ser un div porque contenedor tareas es un ul
        textoNoTareas.textContent='No Hay Tareas';
        textoNoTareas.classList.add('no-tareas');

        contenedorTareas.appendChild(textoNoTareas);
        return;
    }

    // los estados son ceros y uno para que sea mas amigable se crea este objeto
    // para mostrar acorde al estado si esta pendiente o competa
    const estados = {
        0: 'Pendiente',
        1: 'Completa'
    }

    tareas.forEach(tarea =>{//recorro el arreglo de objetos
        const contenedorTarea = document.createElement('LI');
        contenedorTarea.dataset.tareaId=tarea.id;//el id se saca del objeto tarea
        contenedorTarea.classList.add('tarea');
        
        const nombreTarea = document.createElement('P');
        nombreTarea.textContent= tarea.nombre;
        //para editar el nombre luego que se agrego la tarea
        nombreTarea.ondblclick = function () {
            mostrarFormulario(editar=true, tarea);
        }

        const opcionesDiv = document.createElement('DIV');
        opcionesDiv.classList.add('opciones');

        //botones
        const btnEstadoTarea = document.createElement('BUTTON');
        btnEstadoTarea.classList.add('estado-tarea');
        btnEstadoTarea.classList.add(`${estados[tarea.estado].toLowerCase()}`)
        btnEstadoTarea.textContent= estados[tarea.estado];//hacemos uso del ojeto 
        btnEstadoTarea.dataset.estadoTarea=tarea.estado;
        btnEstadoTarea.ondblclick=function(){
            cambiarEstadoTarea({...tarea});
        }

        const btnEliminarTarea = document.createElement('BUTTON');
        btnEliminarTarea.classList.add('eliminar-tarea');
        btnEliminarTarea.dataset.idTarea = tarea.id;
        btnEliminarTarea.textContent = 'Eliminar Tarea';
        btnEliminarTarea.ondblclick = function(){
            confirmarEliminarTarea({...tarea})
        }
        
        opcionesDiv.appendChild(btnEstadoTarea);
        opcionesDiv.appendChild(btnEliminarTarea);

        contenedorTarea.appendChild(nombreTarea);
        contenedorTarea.appendChild(opcionesDiv);

        const listadoTareas = document.querySelector('#listado-tareas');
        listadoTareas.appendChild(contenedorTarea);

    });
    

}    


function mostrarFormulario(editar = false, tarea = {} ){
    console.log(tarea);
    const modal= document.createElement('DIV');
    modal.classList.add('modal');
    modal.innerHTML=`
    <form class="formulario nueva-tarea">
         <legend>${editar ? 'Editar Tarea' : 'Añade una nueva tarea'}</legend>
         <div class="campo">
         <label>Tarea</label>
         <input
            type="text"
            name="tarea"
            placeholder="${tarea.nombre ? 'Edita la tarea': 'Agregar tarea al proyecto actual'}"
            id="tarea"
            value = "${tarea.nombre ? tarea.nombre : ''}"
         />$
         </div>
         <div class="opciones">
            <input 
                type="submit" 
                class="submit-nueva-tarea" 
                value="${editar ? 'Guardar Camios' :'Añadir Tarea'}"></input>
            <button type="button" class="cerrar-modal">Cancelar</button>
         </div>         
    </form>
`;

//modelo de concurrencia o loop de eventos
setTimeout(()=>{
    const formulario = document.querySelector('.formulario');
    formulario.classList.add('animar');
},0);
    modal.addEventListener('click',function(e){
        e.preventDefault();

        if(e.target.classList.contains('cerrar-modal')){
            const formulario=document.querySelector('.formulario');
            formulario.classList.add('cerrar');
            setTimeout(() => {
                modal.remove();
            }, 500);
            
        }
        if(e.target.classList.contains('submit-nueva-tarea')){
            submitForumularioNuevaTarea();
        }
    })

    document.querySelector('.dashboard').appendChild(modal);
}

function submitForumularioNuevaTarea(){
    const tarea=document.querySelector('#tarea').value.trim();

    if(tarea === ''){
        //mostrar una alerta de error
        mostrarAlerta('El nombre de la tarea es obligatorio','error',document.querySelector('.formulario legend'));
        return;
    }

    agregarTarea(tarea);
}


    //Muestra un mensaje en la interfaz
    function mostrarAlerta(mensaje, tipo, referencia){
        //previene la creacion de multiples alertas
        const alertaPrevia=document.querySelector('.alerta');
            if(alertaPrevia){
                alertaPrevia.remove();
            }
        


        const alerta=document.createElement('DIV');
        alerta.classList.add('alerta', tipo);
        alerta.textContent=mensaje;
        
        //inserta la alerta antes del legend
        referencia.parentElement.insertBefore(alerta, referencia.nextElementSibling);

        //Eliminar la alerta luego de 5 segundos
        setTimeout(() => {
            alerta.remove();
            
        }, 5000);
        

    }
    
    //consultar al servidor para agregar una nueva tarea al proyecto actual
    async function agregarTarea(tarea){
        //construir la peticion
        const datos= new FormData();
        datos.append('nombre', tarea);
        datos.append('proyectoId', obtenerProyecto());


        try{
             const url=`${location.origin}/api/tarea`;
             const respuesta= await fetch(url,{
                method: 'POST',
                body: datos
             });
            //  console.log(url);
            //  console.log(respuesta.status);
             const resultado= await respuesta.json();
             //console.log(resultado); //imprime lo que se manda desde php a la consola para probar
            
             //si se intenta agregar una tarea a un proyecto que no existe muestra esta alerta
             // o si la alerta es de exito tambien , entonces se aprovecha el codigo
             mostrarAlerta(resultado.mensaje, resultado.tipo, document.querySelector('.formulario legend'));

             if(resultado.tipo === 'exito'){
                const modal = document.querySelector('.modal');
                setTimeout(() => {
                    modal.remove();
                    //window.location.reload();//recarga la pagina
                },3000);

                //agregar el objeto de  tarea  al gloal de tareas
                const tareaObj= {
                    id: String(resultado.id),//se obtiene del fetch que se mando de php
                    nombre: tarea, //se obtiene del input en la funcion mostrarFormulario
                    estado: "0", // es siempre 0 porque es una tarea nueva
                    proyectoId: resultado.proyectoId //se obtiene del fetch que se mando de php
                }
                    tareas = [...tareas,tareaObj];
                    mostrarTareas();
                
             }

        }catch (error) {
            console.log(error);
        }

    }

    function cambiarEstadoTarea(tarea){

            const nuevoEstado=tarea.estado === "1" ? "0" : "1" ;// se pasan como strings porque llegan como string desde php
            tarea.estado = nuevoEstado;
            actualizarTarea(tarea);
    }

    async function actualizarTarea(tarea){
        const {estado, id, nombre, proyectoId} = tarea;
        const datos = new FormData;
        datos.append('id', id);
        datos.append('nombre', nombre);
        datos.append('estado', estado);
        datos.append('proyectoId', obtenerProyecto());//paso la url no el id 

        //para recorrer los valores del form data
        // for (let valor of datos.values()){
        //     console.log(valor);
        // }

        //otra forma para recorrer el form data con la clave y el valor
        // for (let [clave,valor] of datos.entries()){
        //     console.log(clave,valor);
        // }

        try{
            const url = `${location.origin}/api/actualizar`;
            const respuesta = await fetch(url,{ //objeto de configuracion
                method: 'POST',
                body: datos
            });
            
            const resultado = await respuesta.json();

            if(resultado.respuesta.tipo === 'exito'){
               mostrarAlerta(resultado.respuesta.mensaje,
                resultado.respuesta.tipo, document.querySelector('.contenedor-nueva-tarea'));
            }
            tareas = tareas.map(tareaMemoria => {
                if(tareaMemoria.id === id){
                    tareaMemoria.estado = estado;
                } 
                return tareaMemoria;
            });
            mostrarTareas();//refresca el html 
            console.log(tareas);
        }catch(error){

        }
        


    }

    function confirmarEliminarTarea(tarea){
    // const resultado = confirm('Eliminar');
    // console.log(resultado);
    Swal.fire({
      title: "Eliminar Tarea?",
      //showDenyButton: true,//ocultamos el boton del medio
      showCancelButton: true,
      confirmButtonText: "Si",
      //denyButtonText: `Don't save`
      cancelButtonText: "No"
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        //console.log('..Eliminando');
        eliminarTarea(tarea);
          }
        });
    }

    async function eliminarTarea(tarea){
        const {id,nombre,estado} = tarea;
        const datos = new FormData();
        datos.append('id', id);
        datos.append('nombre', nombre);
        datos.append('estado', estado);
        datos.append('proyectoId' , obtenerProyecto());
        
        try{
            const url = `${location.origin}/api/tareas/eliminar`;
            const respuesta = await fetch(url,{
                method: 'POST',
                body: datos
            });
            //console.log(respuesta);
            const resultado = await respuesta.json();
            console.log(resultado);
            if(resultado.resultado){
                //nuestra alerta
                // mostrarAlerta(
                //     resultado.mensaje,
                //     resultado.tipo,
                //     document.querySelector('.contenedor-nueva-tarea'))

                Swal.fire('Eliminado!', resultado.mensaje ,'success'  )
                    
                    //con estas lineas lo eliminamos de la memoria , de nuestro virtual dom y 
                    //regeneramos nuestro codigo html
                    tareas = tareas.filter(tareaMemoria => tareaMemoria.id !== tarea.id);
                    setTimeout(() => {
                        mostrarTareas();
                    }, 1000);
                    
            }

        } catch (error) {

        }
    }

    //reutilizamos el codigo para obtener la id del proyecto en esta funcion
    function obtenerProyecto(){
        const proyectoParam = new URLSearchParams(window.location.search);
        //Esto crea un objeto especial que permite trabajar con los parámetros de la URL.

        const proyecto = Object.fromEntries(proyectoParam.entries());
        //Acá estamos convirtiendo los parámetros de la URL en un objeto JavaScript.

        return proyecto.id;//devuelve la id del proyecto

    }

    function limpiarTareas(){
        const listadoTareas = document.querySelector('#listado-tareas');
        //listadoTareas.innerHTML='';//esto funciona pero es mas lento
        while(listadoTareas.firstChild){
            listadoTareas.removeChild(listadoTareas.firstChild);
        }
    }
        
})()
