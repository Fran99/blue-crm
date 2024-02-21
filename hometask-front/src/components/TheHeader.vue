<script setup lang="ts">

</script>

<template>
  <nav class="navbar navbar-expand-lg">
    <div class="container-sm">
      <router-link class="navbar-brand" to="/">HTF</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
              aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">

          <li class="nav-item">
            <router-link class="nav-link active" aria-current="page" to="/">Home</router-link>
          </li>

          <li class="nav-item">
            <router-link class="nav-link" to="/profiles">Profiles</router-link>
          </li>

        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>

nav {
  background-color: #1C4396;
  color: white;
}

.navbar-brand, .navbar-nav a, .navbar-nav a.active {
  color: white;
}

</style>
