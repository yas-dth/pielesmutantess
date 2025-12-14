<template>
  <div
    class="modal fade"
    tabindex="-1"
    ref="popup"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content custom-popup">

        <div class="modal-header">
          <h5 class="modal-title">Cómo interactuar</h5>
          <button type="button" class="btn-close" @click="closePopup"></button>
        </div>

       <div class="modal-body">
        <p><strong>Pieles Mutantes</strong> es una experiencia interactiva donde puedes:</p>
  
        <ul>
            <li>
            <strong>Pasarela</strong>
                <ul>
                    <li>Focos interactivos:</li>
                        <ul>
                            <li>Clic: encender o apagar</li>
                            <li>Doble clic: cambiar color</li>
                            <li>Los focos siguen el ratón</li>
                        </ul>
                    <li>Animales:</li>
                        <ul>
                            <li>Hover: efecto glitch</li>
                        </ul>
                </ul>
            </li>

            <li>
            <strong>Estudio</strong>
                <ul>
                    <li>Drag & Drop</li>
                    <li>Cambiar de personaje</li>
                </ul>
            </li>

            <li>
            <strong>Backstage</strong>
                <ul>
                    <li>Persaonajes</li>
                    <ul>
                        <li>Clic: ver información</li>
                    </ul>
                </ul>
            </li>
        </ul>
    </div>
        

      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from "bootstrap";

export default {
  name: "Popup",

  mounted() {
    const hasSeen = localStorage.getItem("hasSeenPopup");

    if (!hasSeen) {
      this.$nextTick(() => {
        // Inicializa y abre el modal
        const modal = new Modal(this.$refs.popup);
        modal.show();
      });

      localStorage.setItem("hasSeenPopup", "true");
    }
  },

  methods: {
    closePopup() {
      const modal = Modal.getInstance(this.$refs.popup);
      if (modal) modal.hide();
    }
  }
};
</script>

<style scoped>
.custom-popup {
  background-color: #290353; 
  color: white;            
}

/* Opcional: cambia el botón de cerrar a blanco */
.custom-popup .btn-close {
  filter: invert(3); /* invierte el color para que se vea blanco */
}


</style>

