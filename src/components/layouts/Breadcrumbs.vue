<script setup lang="ts">
import {RouteLocationNormalized, useRoute} from 'vue-router';
import {ref} from "vue";


interface BreadcrumbsItem {
  title: string
  disabled?: boolean
  to: Partial<RouteLocationNormalized>
}

const siteMap: BreadcrumbsItem[] =[
  {
    title: 'Home',
    disabled: false,
    to: {name: 'home'}
  },
  {
    title: 'Single List',
    disabled: true,
    to: {name: 'list'}
  }
]

let path = ref<BreadcrumbsItem[]>(siteMap)

</script>
<template>
  <v-breadcrumbs
      :items="path"
      divider="/"
  ></v-breadcrumbs>
</template>