<script setup lang="ts">
const year = (new Date()).getFullYear();
</script>

<template>
  <footer>
    <div class="container">
      <p>&copy; {{ year }} HomeTaskFront</p>
    </div>
  </footer>
</template>

<style scoped>
footer {
  padding: 10px 0;
  text-align: center;
  position: absolute;
  width: 100%;
  bottom: 0;
  background-color: #1c4396;
  color: white;
}

footer p {
  margin-bottom: 0;
}
</style>
