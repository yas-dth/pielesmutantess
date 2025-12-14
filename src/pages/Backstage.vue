<template>
  <div class="backstage-fondo">
    <h1 class="display-5 fw-bold">Backstage</h1>
    <div class="backstage-contenido">
      <p v-if="error" class="text-danger fw-bold">
        Error cargando JSON: {{ error }}
      </p>

      <p v-if="fotos.length === 0 && !error">Cargando personajes...</p>

      <!-- GALERÍA CON POSICIONAMIENTO ABSOLUTO -->
      <div class="galeria-container" v-if="fotos.length > 0">
        <div 
          class="personaje-item"
          v-for="p in fotos"
          :key="p.id"
          :style="{ left: p.x + '%', top: p.y + '%' }"
        >
          <CardPersonajes
            :img="p.rutaImg"
            :alt="p.alt"
            @click="onPersonajeClick(p)"
          />
        </div>
      </div>
    </div>
  </div>

    <!-- usar componente de modal -->
    <ModalPersonaje v-model="showModal" :info="selectedInfo" @close="closeModal" />
</template>

<script>
import CardPersonajes from "../components/Cardpersonajes.vue";
import ModalPersonaje from "../components/ModalPersonaje.vue";

export default {
  components: { CardPersonajes, ModalPersonaje },

  data() {
    return {
      fotos: [],
      jsonPath: "/pielesmutantess/listapersonajes.json",
      infoPath: "/pielesmutantess//infopersonajes.json",
      infopersonajes: [],
      selectedInfo: null,
      showModal: false,
      error: null
    };
  },

  mounted() {
    fetch(this.jsonPath)
      .then(res => {
        if (!res.ok) throw new Error("No se pudo cargar el JSON");
        return res.json();
      })
      .then(data => {
        this.fotos = data.map(item => ({
          ...item,
          rutaImg: new URL(`../assets/personajes/${item.imagen}`, import.meta.url).href,
          rutaAudio: new URL(`../assets/backstage/${item.audio}`, import.meta.url).href,
          x: item.x || 0,
          y: item.y || 0
        }));
      })
      .catch(err => this.error = err.message);

    // cargar info de modales
    fetch(this.infoPath)
      .then(res => {
        if (!res.ok) throw new Error("No se pudo cargar infopersonajes.json");
        return res.json();
      })
      .then(data => {
        this.infopersonajes = data.map(i => ({
          ...i,
          rutaImg: i.imagen ? new URL(`../assets/personajes/${i.imagen}`, import.meta.url).href : null
        }));
      })
      .catch(err => {
        console.warn("No se pudo cargar infopersonajes.json:", err);
      });
  },

  methods: {
    reproducirAudio(ruta) {
      if (!ruta) return;
      const audio = new Audio(ruta);
      audio.play().catch(e => console.log("Error al reproducir audio:", e));
    },

    onPersonajeClick(p) {
      this.reproducirAudio(p.rutaAudio);
      const info = this.infopersonajes.find(i => Number(i.id) === Number(p.id)) || null;

      this.selectedInfo = info || {
        id: p.id,
        nombre: p.alt || `Personaje ${p.id}`,
        descripcion: "",
        rutaImg: p.rutaImg
      };

      this.showModal = true;
    },

    closeModal() {
      this.showModal = false;
      this.selectedInfo = null;
    }
  }
};
</script>

<style scoped>
h1 {
  color: white;
  padding-left: 2rem;
  padding-top: 2rem;
  padding-bottom: 0%;
  position: relative;
  z-index: 10;
}

/* Contenedor de fondo */
.backstage-fondo {
  min-height: 100vh;
  width: 100vw;
  background-image: url('../assets/backstage/Fondob.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  padding: 0;
  position: relative;
}

/* Contenido - Contenedor relativo para posicionamiento absoluto */
.backstage-contenido {
  color: white;
  position: absolute;
  top: 120px;
  left: 0;
  width: 100%;
  height: calc(100vh - 120px);
}

/* Contenedor de galería - ABSOLUTO */
.galeria-container {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

/* Posicionamiento absoluto para cada personaje */
.personaje-item {
  cursor: pointer;
  position: absolute;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
}

/* Asegurar que el botón interno sea transparente pero focusable */
.personaje-item :deep(.card-personaje) {
  background: transparent;
  border: none;
  padding: 0;
}

/* Ocultar solo la imagen siempre (no se mostrará en hover ni focus) */
.personaje-item :deep(.card-personaje) .card-img
{
  opacity: 0 !important;
  transition: opacity .15s ease;
  pointer-events: none;
}

/* Foco visible en el botón */
.personaje-item :deep(.card-personaje:focus-visible) {
  outline: 3px solid #ffffff;
  border-radius: 6px;
}
</style>
