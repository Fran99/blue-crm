<script setup lang="ts">
import { useRoute } from "vue-router";
import {ref} from "vue";
import {API_URL} from "@/constants";

const route = useRoute();
const contractId = route.params.contractId;
const profileId = route.params.profileId;
const contract = ref(null);

async function getContract() {
  contract.value = null;
  const response = await fetch(`${API_URL}/contracts/${contractId}`, {
    headers: {
      'profile_id': profileId
    }
  });
  contract.value = await response.json();
}

getContract()
</script>

<template>
  <div class="container-sm">

    <p v-if="!contract">Loading contract...</p>

      <div v-else>
        <h1 class="display-3">Contract #{{ contractId }}</h1>
        <hr>
      </div>

  </div>
</template>

<style scoped>

</style>
