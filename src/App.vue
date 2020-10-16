<template>
  <div id="app">
    <h1>Undercover Elf</h1>
    <SignIn />
    <NavBar />
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>


  
<script>
import SignIn from "./components/SignIn.vue";
import NavBar from "./components/NavBar.vue";

export default {
  name: "App",
  components: {
    SignIn,
    NavBar
  },
  data() {
    return {
      authState: "",
      formFieldsSignUp: [
        {
          type: "name",
          label: "Full name *",
          placeholder: "e.g. Nicholas Claus",
          required: true
        },
        {
          type: "email",
          label: "Email *",
          placeholder: "nick@northpole.com",
          required: true
        },
        { type: "password", label: "Password *", required: true }
      ],
      formFieldsSignIn: [
        {
          type: "email",
          label: "Email",
          placeholder: "nick@northpole.com",
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
