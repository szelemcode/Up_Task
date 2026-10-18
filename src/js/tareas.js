(function(){
    obtenerTareas();
    let tareas =[];
    
    //BOTON PARA MOSTRAR EL MODAL DE AGREGAR TAREA
    const nuevaTareaBtn=document.querySelector('#agregar-tarea');
    nuevaTareaBtn.addEventListener('click',mostrarFormulario);

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

        const opcionesDiv = document.createElement('DIV');
        opcionesDiv.classList.add('opciones');

        //botones
        const btnEstadoTarea = document.createElement('BUTTON');
        btnEstadoTarea.classList.add('estado-tarea');
        btnEstadoTarea.classList.add(`${estados[tarea.estado].toLowerCase()}`)
        btnEstadoTarea.textContent= estados[tarea.estado];//hacemos uso del ojeto 
        btnEstadoTarea.dataset.estadoTarea=tarea.estado;

        const btnEliminarTarea = document.createElement('BUTTON');
        btnEliminarTarea.classList.add('eliminar-tarea');
        btnEliminarTarea.dataset.idTarea = tarea.id;
        btnEliminarTarea.textContent = 'Eliminar Tarea';
        
        opcionesDiv.appendChild(btnEstadoTarea);
        opcionesDiv.appendChild(btnEliminarTarea);

        contenedorTarea.appendChild(nombreTarea);
        contenedorTarea.appendChild(opcionesDiv);

        const listadoTareas = document.querySelector('#listado-tareas');
        listadoTareas.appendChild(contenedorTarea);

    });
    

}    


function mostrarFormulario(){
    const modal= document.createElement('DIV');
    modal.classList.add('modal');
    modal.innerHTML=`
    <form class="formulario nueva-tarea">
         <legend>Añade una nueva tarea</legend>
         <div class="campo">
         <label>Tarea</label>
         <input
            type="text"
            name="tarea"
            placeholder="Agregar tarea al proyecto actual"
            id="tarea"
         />
         </div>
         <div class="opciones">
            <input type="submit" class="submit-nueva-tarea" value="Añadir Tarea"></input>
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
