<script setup lang="ts">
import {ref} from 'vue';
import {API_URL} from "@/constants";

const bestProfession = ref({
  profession: 'Programmer',
  totalEarned: 50
});

const bestClients = ref([])

async function getBestProfession() {
  const response = await fetch(`${API_URL}/admin/best-profession`);
  bestProfession.value = await response.json();
}

async function getBestClients() {
  const response = await fetch(`${API_URL}/admin/best-clients?limit=2`);
  bestClients.value = await response.json()
}

getBestProfession();
getBestClients();
</script>

<template>

  <div class="container-sm">
    <br><br>
    <h1 class="display-1">Hello guest!</h1>
    <br>
    <h1 class="display-4">Do you know what the best profession is?</h1>
    <p class="lead">
      With profits of <b>US${{ bestProfession.totalEarned }}</b>, <b>{{ bestProfession.profession }}</b> is in first
      place!
    </p>

    <br>
    <hr>
    <br>

    <div v-if="bestClients.length === 2">
      <h1 class="display-4">And who are our best clients?</h1>
      <p class="lead">
        Our top 2 goes to <b>{{ bestClients[0].fullname }}</b> and <b>{{ bestClients[1].fullname }}</b>, congratulations
        to them.
      </p>
    </div>

  </div>
</template>

