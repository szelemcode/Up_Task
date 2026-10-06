<div class="contenedor crear">
<?php include_once __DIR__ . '/../templates/nombre-sitio.php' ; ?>
<?php include_once __DIR__ . '/../templates/alertas.php' ?>

    <div class="contenedor-sm">
        <p class="descripcion-pagina">Crear ru cuenta en UpTask</p>
        <form action="/crear" class="formulario" method="POST">

            <div class="campo">
                <label nombre="nombre">Nombre</label>
                <input
                     type="text"
                     id="nombre"
                     placeholder="tu nombre"
                     name="nombre"
                     value="<?php echo $usuario->nombre; ?>"
                     />
            </div>

            <div class="campo">
                <label nombre="email">Email</label>
                <input
                     type="email"
                     id="email"
                     placeholder="tu email"
                     name="email"
                     value="<?php echo $usuario->email ; ?>"
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
            
            <div class="campo">
                <label for="password2">Repetir Pasword</label>
                <input
                     type="password"
                     id="password2"
                     placeholder="Repite tu password"
                     name="password2"
                     />
            </div>

            <input type="submit" class="button" value="Crear Cuenta">
        </form>
        <div class="acciones">
            <a href="/">Ya tienes cuenta? Iniciar Sesion</a>
            <a href="/olvide">Olvidaste tu password?</a>
        </div>
    </div>  <!--fin contenedor s-m -->
</div>