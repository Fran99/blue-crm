<script setup lang="ts">
import {type Ref, ref} from 'vue'
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
const isMakingDeposit = ref(false);
const depositFeedback = ref('');
const depositAmount = defineModel();

async function getProfile() {
  profileData.value = null;
  const res = await fetch(`${API_URL}/profiles/${profileId}`);
  profileData.value = await res.json();
}

async function getContracts() {
  contractsData.value = null;
  const res = await fetch(`${API_URL}/contracts`, {
    headers: {
      profile_id: profileId
    }
  })
  contractsData.value = await res.json();
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

getProfile();
getContracts();
</script>

<template>
  <div class="container-sm">

    <p v-if="!profileData">Loading profile data...</p>

    <div v-else>
      <h1 class="display-3">{{ profileData.firstName }} {{ profileData.lastName }}</h1>
      <h4 class="text-capitalize">{{ profileData.type }}</h4>
      <h6>Balance: US${{ profileData.balance }}</h6>
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

      <hr>
    </div>

    <p v-if="!contractsData">Loading...</p>

    <table v-else class="table">
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
          {{ contract.terms }}
        </td>
        <td class="text-capitalize">{{ contract.status.replaceAll('_', ' ') }}</td>
        <td>
          <span v-for="job in contract.Jobs" :key="job.id">
            <router-link to="/">{{ job.description }}</router-link>
          </span>
        </td>
      </tr>

      </tbody>
    </table>

  </div>
</template>

<style scoped>
h6 a {
  padding-left: 0;
}
</style>
