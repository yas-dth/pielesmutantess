<template>
  <div v-if="modelValue" class="modal-overlay" @click.self="close" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <header class="modal-header">
          <h5 id="modalTitle" class="modal-title">{{ info?.nombre }}</h5>
          <button class="close-btn" @click="close" aria-label="Cerrar">&times;</button>
        </header>

        <div class="modal-body">
          <img v-if="info?.rutaImg" :src="info.rutaImg" :alt="info.nombre" class="modal-img" />
          <p class="modal-desc">{{ info?.descripcion || "Descripción no disponible" }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ModalPersonaje",
  props: {
    modelValue: { type: Boolean, default: false },
    info: { type: Object, default: null }
  },
  emits: ["update:modelValue", "close"],
  methods: {
    close() {
      this.$emit("update:modelValue", false)
      this.$emit("close")
    },
    onKey(e) {
      if (e.key === "Escape" && this.modelValue) this.close()
    }
  },
  mounted() {
    window.addEventListener("keydown", this.onKey)
  },
  beforeUnmount() {
    window.removeEventListener("keydown", this.onKey)
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.6);
  z-index: 999999;
}

.modal-dialog {
  width: min(720px, 95%);
  margin: 1rem;
}

.modal-content {
  background: #290353;
  border-radius: 6px;
  overflow: hidden;
}

.modal-content,
.modal-content * {
  opacity: 1 !important;
  color: white !important;
  pointer-events: auto;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: #290353;
  position: relative;
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
  color: white;
  text-align: center;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 1.75rem;
  line-height: 1;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  color: white;
  position: absolute;
  right: 1rem;
}

.modal-body {
  padding: 1rem;
  padding-bottom: 1.25rem;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.modal-img {
  width: 160px;
  height: auto;
  border-radius: 6px;
  object-fit: contain;
  flex-shrink: 0;
  margin-left: 20px;
  border: #eaeaea 1px solid;
  background-color: #eaeaea;
}

.modal-desc {
  color: white;
  margin-left: 20px;
  font-size: 1rem;
}



</style>