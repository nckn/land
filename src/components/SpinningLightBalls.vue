<template>
  <div class="mainview"></div>
</template>

<script>

// import { mapMutations, mapActions, mapGetters, mapState } from "vuex";

import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  Color,
  FogExp2,
  MeshPhongMaterial,
  PlaneGeometry,
  Mesh
} from 'three'

export default {
  data() {
    return {
      width: 0,
      height: 0,
      scene: null,
      camera: null,
      plane: null,
      renderer: null
    };
  },
  components: {
    // PlaneGeometry
  },
  methods: {
    setupScene () {
      var self = this
      self.scene = new Scene()
      self.scene.background = new Color(0x000000)
      self.scene.background = new Color(0xcccccc)
      self.scene.fog = new FogExp2(0xcccccc, 0.002)
      self.makePlane()
    },
    setupCamera () {
      var self = this
      self.camera = new PerspectiveCamera(
        // 1. Field of View (degrees) org 60
        20,
        // 2. Aspect ratio
        self.width / self.height,
        // 3. Near clipping plane
        1,
        // 4. Far clipping plane
        1000
      );
      // state.camera.position.z = 500;
      self.camera.position.set(30, 120, 350)
    },
    makePlane () {
      var self = this
      var material = new MeshPhongMaterial({
        color: 0xffffff,
        flatShading: true
      })
      var pGeometry = new PlaneGeometry( 10000, 10000, 10000 );
      var plane = new Mesh( pGeometry, material )
      self.scene.add(plane)
    }
  },
  watch: {
    camera () {
      // console.log(`The cam pos: $(CAMERA_POSITION.x)`)
    }
  },
  mounted() {
    var self = this
    this.setupScene()
    this.setupCamera()
    // Listen for resize
    window.addEventListener(
      'resize',
      () => {
        this.RESIZE({
          width: this.$el.offsetWidth,
          height: this.$el.offsetHeight
        });
      },
      true
    )
    // Initial scene rendering
    setTimeout(() => {
      self.renderer.render(self.scene, self.camera)
      self.renderer = new WebGLRenderer({ antialias: true });
      self.renderer.setPixelRatio(window.devicePixelRatio);
      self.renderer.setSize(self.width, self.height);
      self.renderer.setClearColor(0x2a363b, 1);
      self.$el.appendChild(self.renderer.domElement);
    }, 1000);
  }
};
</script>

<style lang="scss" scoped>

.mainview {
  height: 100%;
  width: 100%;
}

</style>
