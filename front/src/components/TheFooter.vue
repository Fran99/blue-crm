<script setup lang="ts">
const year = (new Date()).getFullYear();
</script>

<template>
  <footer class="align-bottom">
    <div class="container">

    </div>
  </footer>

  <nav id="footer" class="navbar fixed-bottom">
    <div class="container-sm">
      <p>&copy; {{ year }} HomeTaskFront</p>
    </div>
  </nav>
</template>

<style scoped>
#footer {
  padding: 10px 0;
  background-color: #1c4396;
  color: white;
}

#footer p {
  margin-bottom: 0;
  text-align: center;
}
</style>
