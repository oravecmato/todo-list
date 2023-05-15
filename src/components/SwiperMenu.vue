<script setup lang="ts">
import {computed, onMounted, Ref, ref} from 'vue'
import { useSwipe } from '@vueuse/core'

const target = ref<HTMLElement | null>(null)
const sidebar = ref<HTMLElement | null>(null)
const sidebarWidth = ref<number | null>(null);
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

const assignSidebarWidthValue = () => {
  if (!sidebar.value) return;
  sidebarWidth.value = sidebar.value.offsetWidth;
}

onMounted(() => {
  resetSidebarStyles(false);
  alert('Version 135')
})

const dynamicStyles = computed(() => menuShown.value && isSwiping.value ? { transform: `translateX(${translateX.value})`, opacity: opacity.value } : {});

const { direction, isSwiping, lengthX, lengthY } = useSwipe(
    target, {
      passive: false,
      onSwipe(e: TouchEvent) {
        // e.preventDefault(); // Order of sidebars render matters

        if (sidebarWidth.value || lengthX.value < 0) {
          if (lengthX.value < 0) {

            if (!menuShown.value) {
              menuShown.value = true;
              resetSidebarStyles(false);
            }

            const length = Math.min(Math.abs(lengthX.value), (sidebarWidth as Ref<number>).value);
            translateX.value = `-${(sidebarWidth as Ref<number>).value - length}px`;
            opacity.value = Math.min(0.1 + length / (sidebarWidth as Ref<number>).value, 1);
          }
          else {
            const length = Math.min(lengthX.value, (sidebarWidth as Ref<number>).value);
            translateX.value = `-${length}px`;
            opacity.value = Math.min(1.1 - length / (sidebarWidth as Ref<number>).value, 1);
          }
        }
      },
      onSwipeEnd(e: TouchEvent) {
        // e.preventDefault(); // Order of sidebars render matters

          if (lengthX.value < 0 && sidebarWidth.value &&  (Math.abs(lengthX.value) / sidebarWidth.value) >= 0.42) {
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
  <div class="wind" ref="target">

  <Transition
      enter-active-class="animated"
      leave-active-class="animated"
      enter-from-class="itxnfull"
      leave-to-class="itxnfull"
      enter-to-class="itx0"
      leave-from-class="itx0"
      @enter="assignSidebarWidthValue"
      :css="!isSwiping"
  >
    <div
        ref="sidebar"
        :class="['overlay', !isSwiping ? 'animated' : '']" :style="dynamicStyles"
        v-show="menuShown"
    >
      Menu goes here!
      <br>
      <hr><br>

      <p class="status">
        Direction: {{ direction ? direction : '-' }} <br>
        lengthX: {{ lengthX }} | lengthY: {{ lengthY }} <br>
        translateX: {{ translateX }} <br>
        Opacity: {{ opacity }} <br>
        Sidebar is shown: {{ menuShown}} br
        Sidebar width: {{ sidebarWidth }} <br>
        <br>
        <br>
        <button @click="menuShown = !menuShown">
          {{ menuShown ? 'Hide ' : 'Show '}} sidebar
        </button>
      </p>
    </div>
  </Transition>


<!--      <div ref="sidebar" class="overlay" :class="['animated', !isSwiping ? 'noAnimation' : '']" :style="{ transform: `translateX(${translateX})`, opacity }">-->
<!--        <p>Swipe right</p>-->
<!--      </div>-->
    <p class="status">
      Direction: {{ direction ? direction : '-' }} <br>
      lengthX: {{ lengthX }} | lengthY: {{ lengthY }} <br>
      translateX: {{ translateX }} <br>
      Opacity: {{ opacity }} <br>
      Sidebar is shown: {{ menuShown}} br
      Sidebar width: {{ sidebarWidth }} <br>
      <br>
      <br>
      <button @click="menuShown = !menuShown">
        {{ menuShown ? 'Hide ' : 'Show '}} sidebar
      </button>
    </p>
  </div>
</template>

<style scoped>
.wind {
  position: fixed;
  background: #1a1a1a;
  z-index: 39;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
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