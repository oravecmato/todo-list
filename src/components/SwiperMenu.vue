<script setup lang="ts">
import {computed, onMounted, ref} from 'vue'
import { useSwipe } from '@vueuse/core'

const target = ref<HTMLElement | null>(null)
const sidebar = ref<HTMLElement | null>(null)
const sidebarWidth = computed(() => sidebar.value?.offsetWidth)
const translateX = ref('-100%')
const opacity = ref(0)

const menuShown = ref(false);

function resetSidebarStyles(expanded: boolean) {
  if (expanded) {
    translateX.value = '0'
    opacity.value = 1
  } else {
    translateX.value = `-${sidebarWidth.value}px`
    opacity.value = 0
  }
}

onMounted(() => {
  resetSidebarStyles(false);
})

const dynamicStyles = computed(() => menuShown.value ? { transform: `translateX(${translateX.value})`, opacity: opacity.value } : {});

const { direction, isSwiping, lengthX, lengthY } = useSwipe(
    target, {
      passive: false,
      onSwipe(e: TouchEvent) {
        e.preventDefault(); // Order of sidebars render matters

        if (sidebarWidth.value) {
          if (lengthX.value < 0) {
            // if (!menuShown.value) {
            menuShown.value = true;
            const length = Math.min(Math.abs(lengthX.value), sidebarWidth.value);
            translateX.value = `-${sidebarWidth.value - length}px`;
            opacity.value = Math.min(0.1 + length / sidebarWidth.value, 1);
            // }
          }
          else {
            const length = Math.min(lengthX.value, sidebarWidth.value);
            translateX.value = `-${length}px`;
            opacity.value = Math.min(1.1 - length / sidebarWidth.value, 1);
          }
        }
      },
      onSwipeEnd(e: TouchEvent) {
        e.preventDefault(); // Order of sidebars render matters

          if (lengthX.value < 0 && sidebarWidth.value && (Math.abs(lengthX.value) / sidebarWidth.value) >= 0.42) {
            resetSidebarStyles(true);
            menuShown.value = true;
          }
          else {
            resetSidebarStyles(false);
            menuShown.value = false;
          }
      },
    });
</script>

<template>

  <Transition
      enter-active-class="animated"
      leave-active-class="animated"
      enter-from-class="itxnfull"
      leave-to-class="itxnfull"
      enter-to-class="itx-"
      leave-from-class="itx0"
  >
    <div
        :class="['overlay animated v2']"
        v-show="menuShown"
    >
      Menu goes here!
      <br><br>
      <button @click="menuShown = !menuShown">
        {{ menuShown ? 'Hide ' : 'Show '}} sidebar
      </button>
    </div>
  </Transition>


  <Transition
      enter-active-class="animated"
      leave-active-class="animated"
      enter-from-class="itxnfull"
      leave-to-class="itxnfull"
      enter-to-class="itx-"
      leave-from-class="itx0"
  >
    <div
        ref="sidebar"
        :class="['overlay animated', !isSwiping ? 'noAnimation' : '']" :style="dynamicStyles"
        v-show="menuShown"
    >
      Menu goes here!
      <br><br>
      <button @click="menuShown = !menuShown">
        {{ menuShown ? 'Hide ' : 'Show '}} sidebar
      </button>
    </div>
  </Transition>

      <button @click="menuShown = !menuShown">
        {{ menuShown ? 'Hide ' : 'Show '}} sidebar
      </button>

<!--      <div ref="sidebar" class="overlay" :class="['animated', !isSwiping ? 'noAnimation' : '']" :style="{ transform: `translateX(${translateX})`, opacity }">-->
<!--        <p>Swipe right</p>-->
<!--      </div>-->
    <p class="status">
      Direction: {{ direction ? direction : '-' }} <br>
      lengthX: {{ lengthX }} | lengthY: {{ lengthY }} <br>
      Menu is shown: {{ menuShown}}
    </p>
</template>

<style scoped>
.overlay {
  top: 0;
  left: 0;
  width: 90vw;
  height: 100%;
  position: fixed;
  background: #3fb983;
  z-index: 50;
}
/*.itx0 {*/
/*  transform: translateX(0) !important;*/
/*  opacity: 1 !important;*/
/*}*/
/*.itxnfull {*/
/*  transform: translateX(-90vw) !important;*/
/*  opacity: 0 !important;*/
/*}*/
.itx0 {
  transform: translateX(0);
  opacity: 1;
}
.itxnfull {
  transform: translateX(-90vw);
  opacity: 0;
}
.animated {
  transition: all 0.5s ease-out;
}
.noAnimation {
  transition: none !important;
}

.overlay > p {
  color: #fff;
  font-weight: bold;
  text-align: center;
  overflow:hidden;
  white-space: nowrap;
}
.overlay.v2 {
  background: blue;
  z-index: 40;
}
.status {
  text-align: center;
}
</style>