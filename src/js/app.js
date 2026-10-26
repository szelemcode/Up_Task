const mobilMenuBtn = document.querySelector('#mobil-menu');
const sidebar = document.querySelector('.sidebar')
if(mobilMenuBtn) { //este menu no va a estar en todos lados , entonces para que no de error
    //le agregamos un addEventListener dentro del if
    mobilMenuBtn.addEventListener('click',function(){
        sidebar.classList.add('mostrar');

    })

}