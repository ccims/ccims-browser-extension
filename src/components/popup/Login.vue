<template>
  <body>
    <h2>Login to Gropius</h2>
    <form>
      <input
        type="email"
        name="email"
        id="email"
        placeholder="Email"
        v-model="email"
      />
      <input
        type="password"
        name="password"
        id="password"
        placeholder="Password"
        v-model="password"
      />
      <button @click="login()">Sign In</button>
    </form>
  </body>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Login extends Vue {
  private email = null;
  private password = null;

  login(): void {
    this.$emit("login");
  }
}
</script>

<style lang="scss" scoped>
form {
  align-items: center;
  display: flex;
  width: 100%;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  box-sizing: border-box;
  flex-wrap: wrap;
}

input {
  margin: 10px;
  font-size: 120%;
  width: 75%;
  height: 5%;
  padding: 10px;
  border: 1px solid black;
  border-radius: 10px;
  transition-duration: 0.3s;
}

input:focus {
  transform: scale(1.2);
  border: none;
}

button {
  font-size: 200%;
  background-color: #1480cf;
  border-radius: 5px;
  border: none;
  text-align: center;
  color: white;
  font-weight: bold;
  transition-duration: 0.3s;
  padding: 10px;
  margin-top: 1%;
}

.white_placeholder::placeholder {
  color: white;
}
</style>
        
