<template>
  <div id="local-scope">
    <header>
      <img src="../assets/elf.svg" id="logo" width="100rem" />
      <h1>Undercover Elf</h1>
    </header>
    <nav>
      <ul>
        <li>
          <router-link to="/">Home</router-link>
        </li>
        <li>
          <router-link to="/profile">My account</router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  name: "NavBar"
};
</script>

<style scoped>
#local-scope {
  font-size: 1.3rem;
}

ul {
  list-style-type: none;
  padding: 0;
  margin-top: 0;
}

li {
  display: inline-block;
  margin: 0 3%;
}
</style>
