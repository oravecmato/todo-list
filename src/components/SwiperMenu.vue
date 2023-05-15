<script setup lang="ts">
import {computed, onMounted, reactive, Ref, ref, watch} from 'vue'
import { usePointerSwipe as useSwipe } from '@vueuse/core'

const target = ref<HTMLElement | null>(null)
const sidebar = ref<HTMLElement | null>(null)
const sidebarWidth = ref<number | null>(null);
const translateX = ref('-100%')
const opacity = ref(0)

const sidebarShown = ref(false);

function resetSidebarStyles(expanded: boolean) {
  if (expanded) {
    translateX.value = '0'
    opacity.value = 1
  } else {
    translateX.value = sidebarWidth.value ? `-${sidebarWidth.value}px` : '-100%'
    opacity.value = 0
  }
}

const assignSidebarWidthValue = () => {
  if (!sidebar.value) return;
  sidebarWidth.value = sidebar.value.offsetWidth;
}

onMounted(() => {
  resetSidebarStyles(false);
  alert('Version 2.6')
})

const dynamicStyles = computed(() => sidebarShown.value && isSwiping.value ? { transform: `translateX(${translateX.value})`, opacity: opacity.value } : {});

const toggleSidebar = () => {
  sidebarShown.value = !sidebarShown.value;
}

const handle = () => {
  alert('Aspon som tu')
}

// const { direction, isSwiping, distanceX } = useSwipe(
//     target, {
//       onSwipe(e: PointerEvent) {
//
//         if (sidebarWidth.value || distanceX.value < 0) {
//           if (distanceX.value < 0) {
//
//             if (!sidebarShown.value) {
//               sidebarShown.value = true;
//               resetSidebarStyles(false);
//             }
//
//             const length = Math.min(Math.abs(distanceX.value), (sidebarWidth as Ref<number>).value);
//             translateX.value = `-${(sidebarWidth as Ref<number>).value - length}px`;
//             opacity.value = Math.min(0.1 + length / (sidebarWidth as Ref<number>).value, 1);
//           }
//           else {
//             const length = Math.min(distanceX.value, (sidebarWidth as Ref<number>).value);
//             translateX.value = `-${length}px`;
//             opacity.value = Math.min(1.1 - length / (sidebarWidth as Ref<number>).value, 1);
//           }
//         }
//       },
//       onSwipeEnd(e: PointerEvent) {
//
//           if (distanceX.value < 0 && sidebarWidth.value &&  (Math.abs(distanceX.value) / sidebarWidth.value) >= 0.42) {
//             resetSidebarStyles(true);
//             sidebarShown.value = true;
//           }
//           else {
//             resetSidebarStyles(false);
//             sidebarShown.value = false;
//           }
//       },
//     });


const touchData = reactive<{
  identifier: number | null,
  startXPos: number | null,
  startYPos: number | null,
  distanceX: number
}>({
  identifier: null,
  startXPos: null,
  startYPos: null,
  distanceX: 0
});

const onTouchStart = (e: TouchEvent) => {
  if (e.touches.length === 1) {
    const touch = e.touches[0];

    touchData.startXPos = touch.clientX;
    touchData.startYPos = touch.clientY;
    touchData.identifier = touch.identifier;
    touchData.distanceX = 0;
  }
}

const isSwiping = computed<boolean>(() => !!touchData.distanceX);

const onTouchMove = (e: TouchEvent) => {
  if (e.touches.length === 1) {
    const touch = e.touches[0];
    touchData.distanceX = touch.clientX - (touchData.startXPos as number);
    handleSwipe();
  }
}


const onTouchEnd = (e: TouchEvent) => {
  if (e.touches.length === 1) {

    if (touchData.distanceX > 0 && sidebarWidth.value &&  (touchData.distanceX / sidebarWidth.value) >= 0.42) {
      resetSidebarStyles(true);
      sidebarShown.value = true;
      alert('cond 1')
    }
    else {
      resetSidebarStyles(false);
      sidebarShown.value = false;
      alert('cond 2')
    }

  } else {
    alert (`${e.touches.length}, ${e.touches[0].identifier}, ${touchData.identifier}`)
  }

  touchData.identifier = null;
  touchData.startXPos = null;
  touchData.startYPos = null;
  touchData.distanceX = 0;
}

const handleSwipe = () => {
  if (isSwiping.value) {
    if (sidebarWidth.value || touchData.distanceX > 0) {
      if (touchData.distanceX > 0) {

        if (!sidebarShown.value) {
          sidebarShown.value = true;
          resetSidebarStyles(false);
        }

        const length = Math.min(touchData.distanceX, (sidebarWidth as Ref<number>).value);
        translateX.value = `-${(sidebarWidth as Ref<number>).value - length}px`;
        opacity.value = Math.min(0.1 + length / (sidebarWidth as Ref<number>).value, 1);
      } else {
        const length = Math.min(Math.abs(touchData.distanceX), (sidebarWidth as Ref<number>).value);
        translateX.value = `-${length}px`;
        opacity.value = Math.min(1.1 - length / (sidebarWidth as Ref<number>).value, 1);
      }
    }
  }
}
</script>

<template>
  <div class="wind" ref="target"
       @touchstart="onTouchStart"
       @touchend="onTouchEnd"
       @touchmove="onTouchMove"
  >

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
        v-show="sidebarShown"
    >
      Menu goes here!
      <br>
      <hr><br>

      <p class="status">
        Touch data: {{ touchData }} <br>
        translateX: {{ translateX }} <br>
        Opacity: {{ opacity }} <br>
        Sidebar is shown: {{ sidebarShown}} <br>
        Sidebar width: {{ sidebarWidth }} <br>
        <br>
        <br>
        <button @click="sidebarShown = !sidebarShown">
          {{ sidebarShown ? 'Hide ' : 'Show '}} sidebar
        </button>
      </p>
    </div>
  </Transition>


    <p class="status">
      Touch data: {{ touchData }} <br>
      translateX: {{ translateX }} <br>
      Opacity: {{ opacity }} <br>
      Sidebar is shown: {{ sidebarShown}} br
      Sidebar width: {{ sidebarWidth }} <br>
      <br>
      <br>
      <button @click="toggleSidebar" class="v-btn v-btn--flat">
        {{ sidebarShown ? 'Hide ' : 'Show '}} sidebar
      </button>
      &nbsp;
      <button @click="handle">
        just anything
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