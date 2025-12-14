<template>
        <div class="about-fondo">
                <div class="about-contenido">
                        <h1 class="display-5 fw-bold">About</h1>
                        <div class="about-texto">
                                <p>Pieles Mutantes es una experiencia digital inspirada en el net art que transforma la pasarela de moda en un espacio surrealista y experimental. Un universo lleno de criaturas híbridas, colores intensos e interacciones inesperadas donde la perfección deja de ser norma y la diversidad se convierte en protagonista.</p>
                                <p>El proyecto cuestiona los estándares tradicionales de belleza y propone una visión alternativa del cuerpo y la identidad. A través del humor, la fantasía y una estética psicodélica, cada criatura desfila con orgullo, celebrando lo diferente, lo raro y lo mutante como formas legítimas y creativas de expresión.</p>
                                <p>La experiencia invita al usuario a explorar libremente: activar luces y sonidos, descubrir elementos ocultos y modificar el entorno. Esta interacción refuerza la idea de que la identidad no es fija, sino cambiante, y que depende de cómo miramos, tocamos e interpretamos lo que nos rodea.</p>
                                <p>En Pieles Mutantes, lo digital se convierte en un espacio sin reglas rígidas, donde la creatividad fluye y la diversidad no solo existe, sino que brilla.</p>
                        </div>
                                
                </div>
        </div>
</template>

<script>

</script>


<style scoped>
/* Contenedor de fondo */
.about-fondo {
        min-height: 100vh;
        width: 100vw;
        background-image: url('../assets/about/Fondoab.jpg');
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        display: flex;
        flex-direction: column;
        padding: 0;
        position: relative;
}

/* Contenido - Contenedor relativo para posicionamiento absoluto */
.about-contenido {
        padding: 2rem;
        color: white;
        position: relative;
        width: 100%;
}

.about-contenido h1 {
        padding-bottom: 2rem;
}

.about-contenido p {
        margin-left: 5rem;
        margin-right: 4rem;
        padding-bottom: 2rem;

}

.about-texto {
        background-color: black;
        padding-top: 2rem;
        opacity: 0.8;
        margin-left: 10rem;
        margin-right: 10rem;
        border-radius: 20px;
}

</style>