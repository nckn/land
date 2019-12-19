<template>
  <div class="viewport"></div>
</template>

<script>

import { mapMutations, mapActions, mapGetters, mapState } from "vuex";
import { 
  MeshPhongMaterial,
  Mesh,
  PlaneGeometry
} from "three-full";

export default {
  data() {
    return {
      height: 0,
      scene: null,
      plane: null
    };
  },
  components: {
    // PlaneGeometry
  },
  computed: {
    ...mapGetters(["CAMERA_POSITION"]),
    ...mapState(['camera'])
  },
  methods: {
    ...mapMutations(["RESIZE"]),
    ...mapActions(["INIT", "ANIMATE"]),
    addSomething () {
      var self = this
      var material = new MeshPhongMaterial({
        color: 0xff00ff,
        flatShading: true
      });
      var pGeometry = new PlaneGeometry( 10000, 10000, 10000 );
      var plane = new Mesh( pGeometry, material );
      // plane.rotation.x = - Math.PI / 2
      self.plane = plane;
      // self.scene.add(plane);
      // setTimeout(() => {
      //   // alert(self.scene)

      // }, 2000)
    }
  },
  watch: {
    camera () {
      // console.log(`The cam pos: $(CAMERA_POSITION.x)`)
    }
  },
  mounted() {
    this.INIT({
      width: this.$el.offsetWidth,
      height: this.$el.offsetHeight,
      el: this.$el
    }).then(() => {
      this.ANIMATE();
      // var scene = this.FETCH_THE_SCENE()
      // this.scene = scene
      this.scene = this.$store.state.scene
      this.addSomething()
      window.addEventListener(
        "resize",
        () => {
          this.RESIZE({
            width: this.$el.offsetWidth,
            height: this.$el.offsetHeight
          });
        },
        true
      );
    });
  }
};
</script>

<style>
.viewport {
  height: 100%;
  width: 100%;
}
</style>
