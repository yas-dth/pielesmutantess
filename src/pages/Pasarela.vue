<template>
  <div
    class="pasarela-fondo"
    :style="{ backgroundImage: `url('${fondoActual}')` }"
    @mousemove="handleMouseMove"
  >

    <!-- ===========================
         REPRODUCTOR MUSICA PASARELA
         =========================== -->
    <div class="header-right">
      <MusicPlayer :src="musicaPasarela" title="MusicaP" />
    </div>

    <!-- ===========================
         FOCOS SUPERIOR
         =========================== -->
    <div class="focos-container">
      <div
        v-for="(foco, index) in focos"
        :key="index"
        class="foco-item"
      >
        <!-- Haz de luz -->
        <div
          v-if="foco.isOn"
          class="foco-luz"
          :style="getBeamStyle(index)"
        ></div>

        <!-- Imagen del foco -->
        <img
          :src="focoImg"
          alt="Foco"
          :class="['foco-img', { 'foco-invertido': isMouseOnLeftHalf }]"
          @click.stop="toggleFoco(index)"
          @dblclick.stop="randomizeColor(index)"
          :ref="el => setFocoRef(el, index)"
        />
      </div>
    </div>

    <!-- CONTENIDO SUPERIOR -->
    <div class="pasarela-contenido">
      <h1 class="display-5 fw-bold">Pasarela</h1>
      <p class="text-danger" v-if="error">{{ error }}</p>
    </div>

    <!-- PERSONAJE ANIMADO -->
    <!-- GIFs de la pasarela (movidos dentro de pasarela-fondo) -->
    <div class="pasarela-gifs">
      <img
        v-for="(gif, idx) in gifs"
        :key="idx"
        :src="gif.src"
        :alt="gif.alt || 'gif'"
        class="pasarela-gif"
        :style="gif.style"
      />
    </div>

    <img
      ref="characterEl"
      class="personaje"
      :src="currentCharacter"
      alt="personaje animado"
      aria-hidden="true"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { gsap } from 'gsap'

/* ======================================================
   IMPORTAR REPRODUCTOR + MÚSICA PASARELA
   ====================================================== */
import MusicPlayer from '../components/MusicPlayer.vue'
import MusicaP from '../assets/pasarela/MusicaP.mp3'

const musicaPasarela = ref(MusicaP)

/* ======================================================
   FONDO / API HORA
   ====================================================== */

const fondoActual = ref('')
const error = ref(null)
const zonaHoraria = ref('UTC')

async function obtenerZonaHoraria() {
  try {
    zonaHoraria.value = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  } catch {
    zonaHoraria.value = 'UTC'
  }
}

async function obtenerHoraDelAPI() {
  try {
    const response = await fetch(`https://timeapi.io/api/Time/current/zone?timeZone=${zonaHoraria.value}`)
    if (!response.ok) throw new Error('Error al obtener la hora')
    const data = await response.json()
    const hora = data.hour

    fondoActual.value = (hora >= 6 && hora < 18)
      ? new URL('../assets/pasarela/Fondopd.png', import.meta.url).href
      : new URL('../assets/pasarela/Fondopn.png', import.meta.url).href

    error.value = null
  } catch (err) {
    console.error('API hora falló:', err)
    error.value = 'No se pudo obtener la hora: ' + (err.message || err)
    const ahora = new Date()
    const hora = ahora.getHours()
    fondoActual.value = (hora >= 6 && hora < 18)
      ? new URL('../assets/pasarela/Fondopd.png', import.meta.url).href
      : new URL('../assets/pasarela/Fondopn.png', import.meta.url).href
  }
}

let apiInterval = null

/* ======================================================
   FOCOS
   ====================================================== */

const focoImg = new URL('../assets/pasarela/foco.png', import.meta.url).href

const focos = ref(
  Array.from({ length: 4 }, () => ({
    isOn: false,
    color: getRandomColor(),
    angle: 0,
    length: 0
  }))
)

const focoRefs = ref([])
const mouseX = ref(0)
const mouseY = ref(0)
const isMouseOnLeftHalf = ref(false)

function setFocoRef(el, index) {
  if (el) focoRefs.value[index] = el
}

function getRandomColor() {
  const hue = Math.floor(Math.random() * 360)
  return `hsla(${hue}, 100%, 70%, 0.4)`
}

function handleMouseMove(event) {
  mouseX.value = event.clientX
  mouseY.value = event.clientY
  isMouseOnLeftHalf.value = event.clientX < window.innerWidth / 2
  updateBeams()
}

function updateBeams() {
  focos.value.forEach((foco, index) => {
    const el = focoRefs.value[index]
    if (!el) return

    const rect = el.getBoundingClientRect()
    const focoX = rect.left + rect.width / 2
    const focoY = rect.top + rect.height / 2

    const dx = mouseX.value - focoX
    const dy = mouseY.value - focoY

    const distancia = Math.sqrt(dx * dx + dy * dy) || 0
    const angRad = Math.atan2(dy, dx)
    const angDeg = (angRad * 180) / Math.PI - 90

    foco.angle = angDeg
    foco.length = distancia
  })
}

function toggleFoco(index) {
  focos.value[index].isOn = !focos.value[index].isOn
}

function randomizeColor(index) {
  focos.value[index].color = getRandomColor()
}

function getBeamStyle(index) {
  const foco = focos.value[index]
  if (!foco.isOn) return {}

  const length = Math.max(foco.length || 0, 24)

  return {
    transform: `translateX(-50%) rotate(${foco.angle}deg)`,
    height: `${length}px`,
    background: `linear-gradient(to bottom, ${foco.color} 0%, rgba(0,0,0,0) 75%)`
  }
}



/* ======================================================
   PERSONAJES ANIMADOS (GSAP)
   ====================================================== */

const characters = [
  new URL('../assets/Personajes/Personaje1.png', import.meta.url).href,
  new URL('../assets/Personajes/Personaje2.png', import.meta.url).href,
  new URL('../assets/Personajes/Personaje3.png', import.meta.url).href,
  new URL('../assets/Personajes/Personaje4.png', import.meta.url).href,
  new URL('../assets/Personajes/Personaje5.png', import.meta.url).href,
  new URL('../assets/Personajes/Personaje6.png', import.meta.url).href
]

/* GIFs en pasarela */
const gifs = [
  { src: new URL('../assets/pasarela/bolo rosa.gif', import.meta.url).href, alt: 'Bolo Rosa', style: { bottom: '16%', right: '65%', width: '160px' }},
  { src: new URL('../assets/pasarela/saltarines.gif', import.meta.url).href, alt: 'Saltarines', style: { bottom: '18%', left: '45%', width: '110px' } },
  { src: new URL('../assets/pasarela/Seta.gif', import.meta.url).href, alt: 'Seta', style: { bottom: '16%', right: '35%', width: '80px' } }
]

const currentIndex = ref(0)
const currentCharacter = computed(() => characters[currentIndex.value])
const characterEl = ref(null)
let currentTimeline = null

function getInitialYOffset() {
  return (currentIndex.value === 0 || currentIndex.value === 1) ? '-20vh' : '0vh'
}

function animateCharacter() {
  const el = characterEl.value
  if (!el) return

  if (currentTimeline) {
    currentTimeline.kill()
    currentTimeline = null
  }

  gsap.set(el, { autoAlpha: 1, x: 0, y: getInitialYOffset(), rotation: 0 })

  currentTimeline = gsap.timeline({
    onComplete() {
      gsap.set(el, { autoAlpha: 0 })
      currentIndex.value = (currentIndex.value + 1) % characters.length
      gsap.delayedCall(0.3, animateCharacter)
    }
  })

  const walkDuration = 5

  currentTimeline.to(el, {
    duration: walkDuration,
    x: '-120vw',
    y: '50vh',
    ease: 'none'
  }, 0)

  currentTimeline.to(el, {
    duration: 0.25,
    rotation: 5,
    yoyo: true,
    repeat: Math.ceil(walkDuration / 0.25),
    transformOrigin: '50% 100%',
    ease: 'sine.inOut'
  }, 0)
}

/* ======================================================
   CICLO DE VIDA
   ====================================================== */

onMounted(() => {
  obtenerZonaHoraria().then(obtenerHoraDelAPI)
  apiInterval = setInterval(obtenerHoraDelAPI, 60000)

  animateCharacter()
  updateBeams()
})

onBeforeUnmount(() => {
  if (currentTimeline) currentTimeline.kill()
  if (apiInterval) clearInterval(apiInterval)
})
</script>

<style scoped>
.pasarela-fondo {
  min-height: 110vh;
  width: 99vw;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  padding: 2rem;
  position: relative;
  transition: background-image 0.5s ease-in-out;
  overflow: hidden;
}

.pasarela-contenido {
  color: white;
  z-index: 5;
}

/* POSICIÓN DEL REPRODUCTOR */
.header-right {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 9999;
}

/* =============
   FOCOS
   ============= */
.focos-container {
  position: absolute;
  top: 0rem;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 4rem;
  z-index: 20;
}

.foco-item {
  position: relative;
}

.foco-img {
  width: 200px;
  cursor: pointer;
  user-select: none;
  transition: transform 0.2s ease;
}

.foco-invertido {
  transform: scaleX(-1);
}

.foco-luz {
  position: absolute;
  top: 70%;
  left: 50%;
  width: 150px;
  border-radius: 60% 60% 80% 80%;
  opacity: 0.7;
  pointer-events: none;
  filter: blur(3px);
  mix-blend-mode: screen;
  transform-origin: 50% 0;
  z-index: 10;
}

/* PERSONAJE */
.personaje {
  position: absolute;
  top: 50%;
  left: 100%;
  transform: translate(-50%, -50%);
  max-width: 35vw;
  width: 340px;
  pointer-events: auto;
  z-index: 12;
}

.personaje:hover {
  filter: drop-shadow(-6px 0 0 red) drop-shadow(6px 0 0 cyan) drop-shadow(0 -6px 0 magenta);
  animation: glitch-jitter 0.25s steps(2, end) infinite;
}

@keyframes glitch-jitter {
  0% { transform: translate(-50%, -50%) translate(0, 0) skewX(0deg); }
  20% { transform: translate(-50%, -50%) translate(-4px, 2px) skewX(-4deg); }
  40% { transform: translate(-50%, -50%) translate(4px, -3px) skewX(3deg); }
  60% { transform: translate(-50%, -50%) translate(-3px, -1px) skewX(-2deg); }
  80% { transform: translate(-50%, -50%) translate(2px, 3px) skewX(2deg); }
  100% { transform: translate(-50%, -50%) translate(0, 0) skewX(0deg); }
}

.pasarela-gifs {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 11; /* detrás de .personaje que tiene z-index:12 */
}

.pasarela-gif {
  position: absolute;
  will-change: transform, opacity;
  filter: drop-shadow(0 6px 8px rgba(0,0,0,0.45));
  --tx: 0; /* desplazamiento X aplicable por GIF */
  transform: translateX(var(--tx)) translateY(0);
  animation: floaty 6s ease-in-out infinite;
}

@keyframes floaty {
  0% { transform: translateX(var(--tx)) translateY(0); }
  50% { transform: translateX(var(--tx)) translateY(-8px); }
  100% { transform: translateX(var(--tx)) translateY(0); }
}
</style>
