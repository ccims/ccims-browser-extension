<template>
  <div>
    <Header></Header>
    <Login @login="loggedIn"></Login>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Login from "@/components/popup/Login.vue";
import Header from "@/components/popup/Header.vue";

@Component({
  components: {
    Login,
    Header,
  },
})
export default class App extends Vue {
  /**
   * Called when user clicks on login in the component Login
   */
  public loggedIn(): void {
    console.log("user logged in");
  }
}
</script>

<style>
html {
  width: 400px;
  height: 400px;
}
</style>
