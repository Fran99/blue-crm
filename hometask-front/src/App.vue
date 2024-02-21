<script setup lang="ts">
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";

</script>

<template>

  <Header />
  <div>
    <router-view></router-view>
  </div>
  <Footer />

</template>

<style>
a {
  color: #1C4396;
  text-decoration: none!important;
}
</style>
