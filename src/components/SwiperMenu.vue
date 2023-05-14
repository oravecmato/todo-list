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

const { direction, isSwiping, lengthX, lengthY } = useSwipe(
    target, {
      passive: false,
      onSwipe(e: TouchEvent) {
        if (sidebarWidth.value) {
          if (lengthX.value < 0) {
            if (!menuShown.value) {
              const length = Math.min(Math.abs(lengthX.value), sidebarWidth.value);
              translateX.value = `-${sidebarWidth.value - length}px`;
              opacity.value = Math.min(0.1 + length / sidebarWidth.value, 1);
            }
          }
          else {
            if (menuShown.value) {
              const length = Math.min(lengthX.value, sidebarWidth.value);
              translateX.value = `-${length}px`;
              opacity.value = Math.min(1.1 - length / sidebarWidth.value, 1);
            }

          }
        }
      },
      onSwipeEnd(e: TouchEvent) {
        if (!menuShown.value) {
          if (lengthX.value < 0 && sidebarWidth.value && (Math.abs(lengthX.value) / sidebarWidth.value) >= 0.5) {
            resetSidebarStyles(true);
            menuShown.value = true;
          }
          else {
            resetSidebarStyles(false);
            menuShown.value = false;
          }
        } else {
          if (lengthX.value > 0 && sidebarWidth.value && (lengthX.value / sidebarWidth.value) >= 0.5) {
            resetSidebarStyles(false);
            menuShown.value = false;
          }
          else {
            resetSidebarStyles(true);
            menuShown.value = true;
          }
        }
      },
    })
</script>

<template>
  <div style="width: 100%; min-height: 100vh;" ref="target">
    <div class="container select-none">
      <button @click="reset">
        Reset
      </button>
      <div ref="sidebar" class="overlay" :class="{ animated: !isSwiping }" :style="{ transform: `translateX(${translateX})`, opacity }">
        <p>Swipe right</p>
      </div>
    </div>
    <p class="status">
      Direction: {{ direction ? direction : '-' }} <br>
      lengthX: {{ lengthX }} | lengthY: {{ lengthY }} <br>
      Menu is shown: {{ menuShown}}
    </p>
  </div>
</template>

<style scoped>
.container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #ccc;
  overflow: hidden;
}

.overlay {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  background: #3fb983;
}

.overlay.animated {
  transition: all 0.2s ease-in-out;
}

.overlay > p {
  color: #fff;
  font-weight: bold;
  text-align: center;
  overflow:hidden;
  white-space: nowrap;
}

.status {
  text-align: center;
}
</style>