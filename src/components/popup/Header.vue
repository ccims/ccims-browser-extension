<template>
  <div>
    <p><img src="@/assets/Gropius.png" width="30%" /></p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Header extends Vue {}
</script>

<style scoped>
p {
  font-size: 20px;
}
</style>
