<div class="contenedor olvide">
<?php include_once __DIR__ . '/../templates/nombre-sitio.php' ; ?>

    <div class="contenedor-sm">
        <p class="descripcion-pagina">Recupera tu Acceso UpTask</p>
        <?php include_once __DIR__ . '/../templates/alertas.php'; ?>
        
        <form action="/olvide" class="formulario" method="POST">

           
            <div class="campo">
                <label nombre="email">Email</label>
                <input
                     type="email"
                     id="email"
                     placeholder="tu email"
                     name="email"
                     />
            </div>


            <input type="submit" class="button" value="Enviar Instrucciones">
        </form>
        <div class="acciones">
            <a href="/">Ya tienes cuenta? Iniciar Sesion</a>
            <a href="/crear">Aun no tienes una cuenta? Obtener una</a>
        </div>
    </div>  <!--fin contenedor s-m -->
</div>