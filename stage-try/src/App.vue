<template>
  <div id="container" style="width: 100vw; height: 100vh">
  </div>
</template>

<script>

import {initializeTorchly, torchly} from "torch-ly-js-api";
import {initializeStage} from "../../dist/index";

export default {
  name: 'App',
  mounted() {

    initializeTorchly({backendUrl: "ws://localhost:5000/graphql", authID: "gm"});

    initializeStage(torchly, "container");

  }
}
</script>

<style>
body {
  margin: 0px;
}
</style>
