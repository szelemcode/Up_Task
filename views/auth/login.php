<div class="contenedor login">
<?php include_once __DIR__ . '/../templates/nombre-sitio.php';?>

    <div class="contenedor-sm">
        <?php include_once __DIR__ . '/../templates/alertas.php' ;?>
        <p class="descripcion-pagina">Iniciar Secion</p>
        <form action="/"  class="formulario" method="POST">
            <div class="campo">
                <label for="email">Email</label>
                <input
                     type="email"
                     id="email"
                     placeholder="tu email"
                     name="email"
                     />
            </div>

            <div class="campo">
                <label for="password">Pasword</label>
                <input
                     type="password"
                     id="password"
                     placeholder="tu password"
                     name="password"
                     />
            </div>

            <input type="submit" class="button" value="Iniciar Sesion">
        </form>
        <div class="acciones">
            <a href="/crear">Aun no tienes una cuenta? Obtener una</a>
            <a href="/olvide">Olvidaste tu password?</a>
        </div>
    </div>  <!--fin contenedor s-m -->
</div>