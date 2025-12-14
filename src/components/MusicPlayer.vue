<template>
  <div class="music-player" role="region" aria-label="Reproductor de música">
    <button class="play-btn" @click="toggle" :aria-pressed="isPlaying.toString()" :title="isPlaying ? 'Pausar' : 'Reproducir'">
      {{ isPlaying ? '❚❚' : '►' }}
    </button>

    <div class="track-info">
      <div class="track-title">{{ title }}</div>
      <input class="progress" type="range" min="0" :max="duration" step="0.1" v-model.number="pos" @input="seek" aria-label="Progreso" />
    </div>

    <input class="volume" type="range" min="0" max="1" step="0.01" v-model.number="volume" @input="onVolume" aria-label="Volumen" />
    <audio ref="audio" :src="src" preload="metadata"></audio>
  </div>
</template>

<script>
export default {
  name: "MusicPlayer",
  props: {
    src: { type: String, default: '../assets/estudio/MúsicaE.mp3' },
    title: { type: String, default: 'Música' }
  },
  data() {
    return {
      isPlaying: false,
      duration: 0,
      pos: 0,
      volume: 0.8
    }
  },
  mounted() {
    const a = this.$refs.audio;
    a.volume = this.volume;
    a.addEventListener('loadedmetadata', () => { this.duration = a.duration || 0 });
    a.addEventListener('timeupdate', () => { this.pos = a.currentTime });
    a.addEventListener('ended', () => { this.isPlaying = false });
  },
  methods: {
    toggle() {
      const a = this.$refs.audio;
      if (this.isPlaying) { a.pause(); this.isPlaying = false }
      else { a.play().catch(()=>{}); this.isPlaying = true }
    },
    seek() {
      const a = this.$refs.audio;
      a.currentTime = this.pos;
    },
    onVolume() {
      this.$refs.audio.volume = this.volume;
    }
  },
  beforeUnmount() {
    const a = this.$refs.audio;
    a.pause();
  }
}
</script>

<style scoped>
.music-player {
  display: flex;
  gap: .5rem;
  align-items: center;
  background: rgba(0,0,0,0.45);
  padding: .4rem .6rem;
  border-radius: 8px;
  color: white;
  font-size: .95rem;
  backdrop-filter: blur(6px);
}
.play-btn {
  background: transparent;
  border: none;
  color: white;
  font-size: 1.05rem;
  cursor: pointer;
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
}
.track-info { display: flex; flex-direction: column; min-width: 140px; }
.track-title { font-size: .85rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.progress { width: 140px; }
.volume { width: 80px; }
</style>