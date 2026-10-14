(function(){
    //BOTON PARA MOSTRAR EL MODAL DE AGREGAR TAREA
    const nuevaTareaBtn=document.querySelector('#agregar-tarea');
    nuevaTareaBtn.addEventListener('click',mostrarFormulario);


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
             console.log(resultado);

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
        
})()
