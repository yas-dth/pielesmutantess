<template>
  <div class="estudio-fondo">
    <div class="header-row">
      <div class="header-left">
        <h1 class="display-5 fw-bold">Estudio</h1>
        <p>
          Entra al estudio donde las criaturas nacen del suspiro de una luna distraída.
          Mezcla pelajes imposibles y deja que las energías raras hagan el resto.
        </p>
      </div>

      <!-- reproductor en esquina superior derecha -->
      <div class="header-right">
        <MusicPlayer :src="musicaEstudio" title="MúsicaE" />
      </div>
    </div>

    <div class="estudio-contenido">

      <div class="imagenes-contenedor">
       
        <div class="imagenes-lado">
          <img :src="imagen1" alt="Alas etéreas que flotan con la brisa lunar" draggable="true" @dragstart="onDragStart(imagen1)" />
          <img :src="imagen2" alt="Búho sabio con ojos brillantes que observa el estudio" draggable="true" @dragstart="onDragStart(imagen2)" />
          <img :src="imagen3" alt="Cola de criatura imaginaria, con mechones que cambian de color" draggable="true" @dragstart="onDragStart(imagen3)" />
        </div>

       
        <div class="personaje-principal">
          <img :src="personajeImg" alt="Personaje principal rodeado de elementos mágicos" />

          <div 
            class="drop-layer"
            @dragover.prevent
            @drop="onDrop"
          ></div>

          <div
            v-for="(img, index) in droppedImages"
            :key="index"
            class="dropped-image"
            :style="{ top: img.y + 'px', left: img.x + 'px', zIndex: img.z }"
            @mousedown="onMouseDown($event, index)"
          >
            <img :src="img.src" alt="Elemento arrastrado que se fusiona con el personaje" />
          </div>
        </div>

        <div class="imagenes-lado">
          <img :src="imagen4" alt="Personaje alternativo con aura misteriosa" draggable="true" @dragstart="onDragStart(imagen4)" />
          <img :src="imagen5" alt="Personaje alternativo con mirada curiosa y mágica" draggable="true" @dragstart="onDragStart(imagen5)" />
          <img :src="imagen6" alt="Personaje alternativo que parece surgir de un sueño" draggable="true" @dragstart="onDragStart(imagen6)" />
        </div>
      </div>

      <div class="botones-personaje">
        <button @click="cambiarPersonaje(1)">1</button>
        <button @click="cambiarPersonaje(3)">2</button>
        <button @click="cambiarPersonaje(4)">3</button>
      </div>

      <button class="btn-reset" @click="resetDroppedImages">Reset</button>

    </div>
  </div>
</template>

<script>
import MusicPlayer from '../components/MusicPlayer.vue'

import MusicaE from '../assets/estudio/MusicaE.mp3'  //

import Personaje1 from '../assets/personajes/Personaje1.png';
import Personaje3 from '../assets/personajes/Personaje3.png';
import Personaje4 from '../assets/personajes/Personaje4.png';

import Imagen1 from '../assets/estudio/Alas.png';
import Imagen2 from '../assets/estudio/Buho.png';
import Imagen3 from '../assets/estudio/Cola.png';
import Imagen4 from '../assets/estudio/Gorro.png';
import Imagen5 from '../assets/estudio/Bolso.png';
import Imagen6 from '../assets/estudio/Monoculo.png';

export default {
  name: "Estudio",
  components: { MusicPlayer },

  data() {
    return {
      musicaEstudio: MusicaE, // <-- VARIABLE DISPONIBLE PARA EL PLAYER

      personajeImg: Personaje4,
      personajes: {
        1: Personaje1,
        3: Personaje3,
        4: Personaje4
      },

      imagen1: Imagen1,
      imagen2: Imagen2,
      imagen3: Imagen3,
      imagen4: Imagen4,
      imagen5: Imagen5,
      imagen6: Imagen6,

      draggedImage: null,
      droppedImages: []
    };
  },
  methods: {
    cambiarPersonaje(numero) {
      this.personajeImg = this.personajes[numero];
    },
    onDragStart(image) {
      this.draggedImage = image;
    },
    onDrop(event) {
      event.preventDefault();
      if (this.draggedImage) {
        const container = document.querySelector('.personaje-principal');
        const rect = container.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        this.droppedImages.push({
          src: this.draggedImage,
          x,
          y,
          z: this.droppedImages.length + 1
        });

        this.draggedImage = null;
      }
    },
    onMouseDown(event, index) {
      event.preventDefault();
      const selectedImage = this.droppedImages[index];
      const container = document.querySelector('.personaje-principal');
      const rect = container.getBoundingClientRect();

      const offsetX = event.clientX - rect.left - selectedImage.x;
      const offsetY = event.clientY - rect.top - selectedImage.y;

      selectedImage.z = Math.max(...this.droppedImages.map(img => img.z)) + 1;

      const onMouseMove = (moveEvent) => {
        selectedImage.x = moveEvent.clientX - rect.left - offsetX;
        selectedImage.y = moveEvent.clientY - rect.top - offsetY;
      };

      const onMouseUp = () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    },
    resetDroppedImages() {
      this.droppedImages = [];
    }
  }
};
</script>


<style scoped>
.estudio-fondo {
  min-height: 100vh;
  width: 100vw;
  background-image: url('../assets/estudio/Fondoe.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  padding: 2rem;
}

h1 {
  color: white;
  margin-bottom: 1rem;
}

p {
  color: white;
  max-width: 700px;
  padding-bottom: 3rem;
}

.estudio-contenido {
  color: white;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.imagenes-contenedor {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  width: 100%;
}

.imagenes-lado {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.imagenes-lado img {
  width: 120px;
  cursor: grab;
  transition: transform 0.2s ease;
}

.imagenes-lado img:hover {
  transform: scale(1.1);
}

.personaje-principal {
  position: relative;
  display: flex;
  justify-content: center;
}

.personaje-principal > img {
  width: 400px;
  border-radius: 10px;
  pointer-events: none;
}

.drop-layer {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: auto;
}

.dropped-image {
  position: absolute;
  cursor: move;
  z-index: 10;
}

.dropped-image img {
  width: 200px;
  height: auto;
  pointer-events: none;
}

.btn-reset {
  background-color: #290353;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-bottom: 20px;
  margin-top: 15px;
  transition: background-color 0.3s ease, transform 0.1s ease;
}

.btn-reset:hover {
  background-color: #5b03ba;
}

.btn-reset:active {
  transform: scale(0.95);
}

.botones-personaje button {
  background-color: #5b03ba;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  margin: 10px;
  transition: transform 0.1s ease, background-color 0.3s ease;
}

.botones-personaje button:hover {
  background-color: #9735ff;
}

.botones-personaje button:active {
  transform: scale(0.95);
}

/* Header layout: titulo/ texto a la izquierda, player a la derecha */
.header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  width: 100%;
  margin-bottom: 0.75rem;
}
.header-left { max-width: 75%; }
.header-right { display: flex; align-items: center; justify-content: flex-end; }

/* Ajustes responsivos */
@media (max-width: 800px) {
  .header-row { flex-direction: column; align-items: flex-start; }
  .header-right { margin-top: .5rem; }
}
</style>