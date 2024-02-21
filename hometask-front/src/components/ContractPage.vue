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
        <h2 class="display-6">Contract details:</h2>
        <ol class="list-group">
          <li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="ms-2 me-auto">
              <div class="fw-bold">Id</div>
              {{ contract.id }}
            </div>
          </li>
          <li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="ms-2 me-auto">
              <div class="fw-bold">Terms</div>
              {{ contract.terms }}
            </div>
          </li>
          <li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="ms-2 me-auto">
              <div class="fw-bold">Status</div>
              <span class="text-capitalize">{{ contract.status.replaceAll('_', ' ') }}</span>
            </div>
          </li>
          <li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="ms-2 me-auto">
              <div class="fw-bold">Client</div>
              <router-link :to="{ name: 'ProfilePage', params: { profileId: contract.ClientId } }">
                Client #{{ contract.ClientId }}
              </router-link>

            </div>
          </li>
          <li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="ms-2 me-auto">
              <div class="fw-bold">Contractor</div>
              <router-link :to="{name: 'ProfilePage', params: {profileId: contract.ContractorId}}">
                Contractor #{{ contract.ContractorId }}
              </router-link>
            </div>
          </li>
        </ol>
      </div>

  </div>
</template>

<style scoped>

</style>
