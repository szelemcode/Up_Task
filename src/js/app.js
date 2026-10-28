const mobilMenuBtn = document.querySelector('#mobil-menu');
const cerrarMenuBtn = document.querySelector('#cerrar-menu');
const sidebar = document.querySelector('.sidebar')

if(mobilMenuBtn) { //este menu no va a estar en todos lados , entonces para que no de error
    //le agregamos un addEventListener dentro del if
    mobilMenuBtn.addEventListener('click',function(){
        sidebar.classList.add('mostrar');

    })
}

if(cerrarMenuBtn) {
    cerrarMenuBtn.addEventListener('click', function(){
        //sidebar.classList.remove('mostrar'); // si removemos no tendra la animacion pero de todas maneras estara
        sidebar.classList.add('ocultar');

        setTimeout( () => {
            sidebar.classList.remove('mostrar');
            sidebar.classList.remove('ocultar');//si no se quita no se podra acceder a que vuelva a mostrar
        },1000);
    });
}

//Elimina la clas e de mostrar en un tama'o de tablet o mayores
const anchoPantalla = document.body.clientWidth;
window.addEventListener('resize', function () {
    const anchoPantalla = document.body.clientWidth;//la evaluamos cada vez que hagamos resize
    if(anchoPantalla >= 768) {
        sidebar.classList.remove('mostrar');
    }
})