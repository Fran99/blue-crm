<script setup lang="ts">
import TheHeader from "@/components/TheHeader.vue";
import TheFooter from "@/components/TheFooter.vue";
</script>

<template>
  <TheHeader />
  <div>
    <router-view></router-view>
  </div>
  <TheFooter />
</template>

<style>
a {
  color: #1C4396;
  text-decoration: none!important;
}

.container-sm {
  padding-bottom: 100px;
}
</style>
