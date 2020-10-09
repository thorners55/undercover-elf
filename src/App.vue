<template>
  <div id="app">
    <h1>Undercover Elf</h1>
    <amplify-authenticator v-if="authState !== 'signedin'">
      <amplify-sign-up
        header-text="Create Account"
        slot="sign-up"
        username-alias="email"
        :form-fields.prop="formFieldsSignUp"
      ></amplify-sign-up>
      <amplify-sign-in slot="sign-in" username-alias="email" :form-fields.prop="formFieldsSignIn"></amplify-sign-in>
      <div v-if="authState === 'signedin'">
        <amplify-sign-out></amplify-sign-out>
        <div>Hello, "curlybracketsx2 user.username"</div>
      </div>
    </amplify-authenticator>

    <Home v-bind:name="name" />
  </div>
</template>

<script>
import Home from "./components/Home.vue";

export default {
  name: "App",
  components: {
    Home
  },
  data() {
    return {
      authState: "",
      formFieldsSignUp: [
        {
          type: "name",
          label: "Full name *",
          placeholder: "e.g. Kris Kringle",
          required: true
        },
        {
          type: "email",
          label: "Email *",
          placeholder: "kris@northpole.com",
          required: true
        },
        { type: "password", label: "Password *", required: true }
      ],
      formFieldsSignIn: [
        {
          type: "email",
          label: "Email",
          placeholder: "kris@northpole.com",
          required: true
        },
        { type: "password", label: "Password", required: true }
      ],
      name: "Stephanie"
    };
  }
};
</script>

<style>
html {
  background-color: rgb(128, 228, 181);
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
