<div class="contenedor reestablecer">
<?php include_once __DIR__ . '/../templates/nombre-sitio.php';?>

    <div class="contenedor-sm">
        <p class="descripcion-pagina">Coloca tu nuevo Password</p>
         <?php include_once __DIR__ . '/../templates/alertas.php'; ?>
         <?php if($mostrar){ ?>
        <form  class="formulario" method="POST">

            <div class="campo">
                <label for="password">Pasword</label>
                <input
                     type="password"
                     id="password"
                     placeholder="tu password"
                     name="password"
                     />
            </div>

            <input type="submit" class="button" value="Guardar Password">
        </form>

         <?php } ?> <!--cierre if -->
        <div class="acciones">
            <a href="/crear">Aun no tienes una cuenta? Obtener una</a>
            <a href="/olvide">Olvidaste tu password?</a>
        </div>
    </div>  <!--fin contenedor s-m -->
</div>