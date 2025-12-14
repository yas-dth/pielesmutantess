<template>
  <div>
    <Popup />

    <nav>
      <router-link to="/">Pasarela</router-link> |
      <router-link to="/estudio">Estudio</router-link> |
      <router-link to="/backstage">Backstage</router-link> |
      <router-link to="/about">About</router-link>
    </nav>

    <router-view />
  </div>
</template>

<script>
import Popup from "./components/Popup.vue";

export default {
  components: { Popup }
};
</script>

<style>
nav {
  background: #290353;
  padding: 2rem;
}
nav a {
  color: white;
  margin: 0 10px;
  text-decoration: none;
}
nav a.router-link-exact-active {
  font-weight: bold;
  text-decoration: underline;
}

/* Focus visible accesible para toda la app */
:where(a, button, input, textarea, select, summary, [tabindex]) {
  outline: none;
}

/* Mostrar contorno visible solamente cuando el usuario usa teclado */
:where(a, button, input, textarea, select, summary, [tabindex]):focus-visible {
  outline: 3px solid #f7f7f5;
  outline-offset: 3px;
  box-shadow: 0 0 0 4px rgba(255, 212, 42, 0.12);
  border-radius: 6px;
}

/* Mejor contraste para enlaces y botones */
a:focus-visible,
button:focus-visible {
  background-color: rgba(255,255,255,0.04);
}

/* Estilos específicos para elementos custom que recibirán tabindex */
.personaje-item:focus-visible,
.dropped-image:focus-visible,
.draggable-image:focus-visible,
.close-btn:focus-visible {
  outline: 3px solid #ffd42a;
  outline-offset: 3px;
  border-radius: 6px;
}

/* Inputs y controles nativos mantienen su foco normal si lo prefieres */
input:focus-visible,
textarea:focus-visible,
select:focus-visible {
  box-shadow: 0 0 0 4px rgba(0,123,255,0.15);
  outline: none;
}
</style>
