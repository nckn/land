<template lang="pug">
  <div id="app">
    //- panel
    //- viewport
    SpinningLightBalls
  </div>
</template>

<script>

// import ViewPort from "@/components/ViewPort.vue";
import ControlPanel from "@/components/ControlPanel.vue";
import SpinningLightBalls from "@/components/SpinningLightBalls.vue";

export default {
  components: {
    // viewport: ViewPort,
    panel: ControlPanel,
    SpinningLightBalls
  }
};
</script>

<style>
html,
body {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
body {
  margin: 0px;
}
canvas {
  position: relative;
}
#app {
  height: 100%;
}
</style>
