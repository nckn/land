<template lang="pug">
    .main-view
</template>

<script>

import * as Three from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"

export default {
  name: 'SoundLand',
  data() {
    return {
      camera: null,
      scene: null,
      renderer: null,
      mesh: null,
      controls: null,
      plane: null
    };
  },
  methods: {
    init: function() {
      var self = this
      let container = this.$el
      this.camera = new Three.PerspectiveCamera(70, container.clientWidth / container.clientHeight, 0.01, 10)
      this.camera.position.z = 1
      self.scene = new Three.Scene()
      self.scene.background = new Three.Color(0xcccccc)
      self.scene.fog = new Three.FogExp2(0xcccccc, 0.002)

      this.makeObjects()
      // this.setupLights()

      this.renderer = new Three.WebGLRenderer({ antialias: true });
      this.renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(this.renderer.domElement);
    },
    render () {

    },
    animate: function() {
      requestAnimationFrame(this.animate)
      // this.mesh.rotation.x += 0.01
      // this.mesh.rotation.y += 0.02
      this.renderer.render(this.scene, this.camera)
    },
    makeObjects () {
      var self = this
      // Make plane
      let planeMat = new Three.MeshPhongMaterial({
        color: 0xf00fff,
        flatShading: true
      });
      var pGeometry = new Three.PlaneGeometry(10000, 10000, 10000);
      var plane = new Three.Mesh(pGeometry, planeMat);
      plane.rotation.x = -Math.PI / 2;
      self.plane = plane;
      plane.receiveShadow = true;
      self.scene.add(self.plane);

      let geometry = new Three.BoxGeometry(0.2, 0.2, 0.2)
      // let material = new Three.MeshNormalMaterial()
      self.mesh = new Three.Mesh(geometry, planeMat)
      self.mesh.updateMatrix();
      self.mesh.matrixAutoUpdate = false;
      self.scene.add(self.mesh);
      // for (var i = 0; i < 50; i++) {
      //   var material = new Three.MeshPhongMaterial({
      //     color: 0xffffff,
      //     flatShading: true
      //   });
      //   var geometry = new Three.BoxGeometry(1, (Math.random() - 0.5) * 4, 1);
      //   var mesh = new Three.Mesh(geometry, material);
      //   mesh.position.x = (Math.random() - 0.5) * 10;
      //   mesh.position.y = 0;
      //   // mesh.position.y = (Math.random() - 0.5) * 1000;
      //   mesh.position.z = (Math.random() - 0.5) * 10;
      //   mesh.updateMatrix();
      //   mesh.matrixAutoUpdate = false;
      //   mesh.castShadow = true;
      //   mesh.receiveShadow = true;
      //   // self.pyramids.push(mesh);
      // }
    },
    setupLights () {
      var self = this
      // lights
      var lightA = new Three.DirectionalLight(0xffffff);
      lightA.position.set(1, 1, 1).normalize();
      self.scene.add(lightA);
      var lightB = new Three.DirectionalLight(0x002288);
      lightB.position.set(-1, -1, -1);
      lightB.rotation.x = -Math.PI / 2;
      self.scene.add(lightB);
      var lightC = new Three.AmbientLight(0x222222);
      self.scene.add(lightC);
    },
    cameraControls () {
      // console.log(OrbitControls)
      var self = this
      self.controls = new OrbitControls( self.camera, self.renderer.domElement );
      // self.controls.target.set( self.mesh );
      self.controls.target.set( 0, 0, 0 );
      self.controls.update()
      // self.controls = new Three.trackballControls(
      //   self.camera,
      //   self.renderer.domElement
      // )
      // self.controls.rotateSpeed = 1.0
      // self.controls.zoomSpeed = 1.2
      // self.controls.panSpeed = 0.8
      // self.controls.noZoom = false
      // self.controls.noPan = false
      // self.controls.staticMoving = true
      // self.controls.dynamicDampingFactor = 0.3
      // self.controls.keys = [65, 83, 68]
    }
  },
  mounted() {
    this.init()
    this.render()
    this.animate()
    this.cameraControls()
  }
};
</script>

<style scoped>
.main-view {
  width: 100%;
  height: 100%;
}
</style>
