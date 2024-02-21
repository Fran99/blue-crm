<script setup lang="ts">
import {ref} from 'vue';
import {API_URL} from "@/constants";

const profilesData = ref(null);

async function fetchProfiles() {
  profilesData.value = null;
  const res = await fetch(`${API_URL}/profiles`)
  profilesData.value = await res.json();
}

fetchProfiles();
</script>

<template>
  <div class="container-sm">
    <h1 class="display-3">Profiles</h1>
    <hr>
    <p v-if="!profilesData">Loading...</p>

    <table v-else class="table">
      <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Fullname</th>
        <th scope="col">Profession</th>
        <th scope="col">Balance</th>
        <th scope="col">Type</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="profile in profilesData" :key="profile.id">
        <th scope="row">{{ profile.id }}</th>
        <td>
          <router-link :to="{name: 'ProfilePage', params: {profileId: profile.id}}">
            {{ profile.firstName }} {{ profile.lastName }}
          </router-link>
        </td>
        <td>{{ profile.profession }}</td>
        <td>US${{ profile.balance }}</td>
        <td class="text-capitalize">{{ profile.type }}</td>
      </tr>

      </tbody>
    </table>
  </div>
</template>

<style scoped>

</style>
