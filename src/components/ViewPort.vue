<template>
  <div class="viewport"></div>
</template>

<script>
import { mapMutations, mapActions, mapGetters } from "vuex";
import {
  Scene,
  Color,
  FogExp2,
  // CylinderBufferGeometry,
  // BoxGeometry,
  MeshPhongMaterial,
  Mesh,
  DirectionalLight,
  AmbientLight,
  LineBasicMaterial,
  Geometry,
  Vector3,
  Line,
  PlaneGeometry,
  BoxGeometry
} from "three-full";

export default {
  data() {
    return {
      camera: null,
      controls: null,
      scene: null,
      renderer: null,
      axisLines: [],
      pyramids: [],
      plane: null
    };
  },
  components: {
    // PlaneGeometry
  },
  computed: {
    ...mapGetters(["CAMERA_POSITION"])
  },
  methods: {
    ...mapMutations(["RESIZE"]),
    ...mapActions(["INIT", "ANIMATE"]),
    initializeScene() {
      var self = this;
      self.scene = new Scene();
      self.scene.background = new Color(0xcccccc);
      self.scene.fog = new FogExp2(0xcccccc, 0.002);
      // Pine trees
      // var geometry = new CylinderBufferGeometry(0, 10, 30, 4, 1);
      var material = new MeshPhongMaterial({
        color: 0xffffff,
        flatShading: true
      });
      for (var i = 0; i < 50; i++) {
        // var geometry = new BoxGeometry(2, 2, 2)
        // Boxes
        var geometry = new BoxGeometry(1, (Math.random() - 0.5) * 4, 1);
        var mesh = new Mesh(geometry, material);
        mesh.position.x = (Math.random() - 0.5) * 10;
        mesh.position.y = 0;
        // mesh.position.y = (Math.random() - 0.5) * 1000;
        mesh.position.z = (Math.random() - 0.5) * 10;
        mesh.updateMatrix();
        mesh.matrixAutoUpdate = false;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        self.pyramids.push(mesh);
      }
      var pGeometry = new PlaneGeometry(10000, 10000, 10000);
      var plane = new Mesh(pGeometry, material);
      plane.rotation.x = -Math.PI / 2;
      self.plane = plane;
      plane.receiveShadow = true;

      self.scene.add(plane);
      self.scene.add(self.pyramids);

      // lights
      var lightA = new DirectionalLight(0xffffff);
      lightA.position.set(1, 1, 1);
      self.scene.add(lightA);
      var lightB = new DirectionalLight(0x002288);
      lightB.position.set(-1, -1, -1);
      lightB.rotation.x = -Math.PI / 2;
      self.scene.add(lightB);
      var lightC = new AmbientLight(0x222222);
      self.scene.add(lightC);

      lightB.castShadow = true;
      lightB.shadow.camera.near = 0.1;
      lightB.shadow.camera.far = 500;
      lightB.shadow.camera.right = 17;
      lightB.shadow.camera.left = -17;
      lightB.shadow.camera.top = 17;
      lightB.shadow.camera.bottom = -17;
      lightB.shadow.mapSize.width = 512;
      lightB.shadow.mapSize.height = 512;
      lightB.shadow.radius = 4;
      lightB.shadow.bias = -0.0005;

      // Axis Line 1
      var materialB = new LineBasicMaterial({ color: 0x0000ff });
      var geometryB = new Geometry();
      geometryB.vertices.push(new Vector3(0, 0, 0));
      geometryB.vertices.push(new Vector3(0, 1000, 0));
      var lineA = new Line(geometryB, materialB);
      self.axisLines.push(lineA);

      // Axis Line 2
      var materialC = new LineBasicMaterial({ color: 0x00ff00 });
      var geometryC = new Geometry();
      geometryC.vertices.push(new Vector3(0, 0, 0));
      geometryC.vertices.push(new Vector3(1000, 0, 0));
      var lineB = new Line(geometryC, materialC);
      self.axisLines.push(lineB);

      // Axis 3
      var materialD = new LineBasicMaterial({ color: 0xff0000 });
      var geometryD = new Geometry();
      geometryD.vertices.push(new Vector3(0, 0, 0));
      geometryD.vertices.push(new Vector3(0, 0, 1000));
      var lineC = new Line(geometryD, materialD);
      self.axisLines.push(lineC);

      self.scene.add(self.axisLines);
      // self.assignShadow()
    },
    assignShadow() {
      var self = this;
      var dirLight = new DirectionalLight(0x002288);
      dirLight.position.set(-1, -1, -1);
      self.scene.add(dirLight);
      dirLight.castShadow = true;
      dirLight.shadow.camera.near = 0.1;
      dirLight.shadow.camera.far = 500;
      dirLight.shadow.camera.right = 17;
      dirLight.shadow.camera.left = -17;
      dirLight.shadow.camera.top = 17;
      dirLight.shadow.camera.bottom = -17;
      dirLight.shadow.mapSize.width = 512;
      dirLight.shadow.mapSize.height = 512;
      dirLight.shadow.radius = 4;
      dirLight.shadow.bias = -0.0005;
    }
  },
  watch: {
    camera() {
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
      this.initializeScene();
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
