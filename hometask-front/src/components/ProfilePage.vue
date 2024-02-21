<script setup lang="ts">
import {computed, type Ref, ref} from 'vue'
import {useRoute} from "vue-router";
import {API_URL} from "@/constants";

const route = useRoute();
const profileId = route.params.profileId;

interface Profile {
  firstName: string;
  lastName: string;
}

const profileData: Ref<Profile | null> = ref(null);
const contractsData = ref(null);
const unpaidJobs = ref(null);
const isMakingDeposit = ref(false);
const depositFeedback = ref('');
const depositAmount = defineModel();

async function getProfile() {
  profileData.value = null;
  const res = await fetch(`${API_URL}/profiles/${profileId}`);
  profileData.value = await res.json();
}

const isClient = computed(() => {
  return profileData.value.type === 'client'
})

async function getContracts() {
  contractsData.value = null;
  const res = await fetch(`${API_URL}/contracts`, {
    headers: {
      profile_id: profileId
    }
  })
  contractsData.value = await res.json();
}

async function getUnpaidJobs() {
  unpaidJobs.value = null;
  const response = await fetch(`${API_URL}/jobs/unpaid`, {
    headers: {
      profile_id: profileId
    }
  });
  unpaidJobs.value = await response.json();
}

async function makeDeposit() {

  const res = await fetch(`${API_URL}/balances/deposit/${profileData.value.id}`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({amount: depositAmount.value})
  });
  if (!res.ok) {
    depositFeedback.value = (await res.json()).error;
  } else {
    profileData.value.balance += depositAmount.value;
    isMakingDeposit.value = false;
    depositAmount.value = 0;
  }
}

async function payJob(jobId) {
  const response = await fetch(`${API_URL}/jobs/${jobId}/pay`, {
    method: 'POST',
    headers: {
      profile_id: profileId
    }
  });
  if(response.ok) {
    await Promise.all([
      getProfile(),
      getUnpaidJobs()
    ]);
  }

}

getProfile();
getContracts();
getUnpaidJobs();
</script>

<template>
  <div class="container-sm">

    <p v-if="!profileData">Loading profile data...</p>

    <div v-else>
      <h1 class="display-3">{{ profileData.firstName }} {{ profileData.lastName }}</h1>
      <hr>
      <h4 class="text-capitalize">{{ profileData.type }}</h4>
      <h6>Balance: US${{ profileData.balance }}</h6>
      <div v-if="isClient">
      <h6>
        <a @click="isMakingDeposit = !isMakingDeposit"
           class="btn btn-link">{{ isMakingDeposit ? 'Cancel' : 'Make a deposit' }}</a>
      </h6>

      <div class="row">
        <div class="col-sm-4">
          <div class="form-floating mb-3" v-if="isMakingDeposit">
            <input type="number" min="1" class="form-control" id="amount" placeholder="50" v-model="depositAmount"/>
            <label for="floatingInput">Deposit amount:</label>
            <div id="depositFeedback" class="form-text">{{ depositFeedback }}</div>
            <br>
            <button class="btn btn-secondary btn-sm" @click.prevent="makeDeposit">Send</button>
          </div>
        </div>
      </div>
      </div>

      <hr>
    </div>

    <p v-if="!contractsData">Loading...</p>

    <div v-else>
      <h4 class="display-6">
        <span class="text-capitalize">
          {{ profileData.type }}
        </span> contracts:
      </h4>
      <table class="table">
        <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Terms</th>
          <th scope="col">Status</th>
          <th scope="col">Jobs</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="contract in contractsData" :key="contract.id">
          <th scope="row">{{ contract.id }}</th>
          <td>
            <router-link :to="{name: 'ContractPage', params: {contractId: contract.id, profileId: 4 }}">
              Contract #{{ contract.id }}
            </router-link>

          </td>
          <td class="text-capitalize">{{ contract.status.replaceAll('_', ' ') }}</td>
          <td>{{ contract.Jobs.length }}</td>
        </tr>

        </tbody>
      </table>
    </div>

    <br>
    <p v-if="!unpaidJobs">Loading...</p>
    <h4 class="display-6" v-else-if="unpaidJobs.length === 0">No unpaid jobs</h4>
    <div v-else>
      <h4 class="display-6">
         <span class="text-capitalize">
          {{ profileData.type }}
        </span> unpaid jobs:
      </h4>

      <table class="table">
        <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Description</th>
          <th scope="col">Price</th>
          <th scope="col">Contract</th>
          <th v-if="isClient" scope="col">Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="job in unpaidJobs" :key="job.id">
          <th scope="row">{{ job.id }}</th>
          <td>
            {{ job.description }}
          </td>
          <td>US${{ job.price }}</td>
          <td>#{{ job.ContractId }}</td>
          <td v-if="isClient">
            <button class="btn btn-link" @click="payJob(job.id)" :disabled="profileData.balance < job.price">Pay</button>
          </td>
        </tr>

        </tbody>
      </table>
    </div>

  </div>
</template>

<style scoped>
h6 a {
  padding-left: 0;
}

button.btn-link {
  padding: 0;
  text-decoration: none;
}
</style>
