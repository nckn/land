<template lang="pug">
    .main-view
</template>

<script>

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
// import Stats from 'three/examples/jsm/libs/stats.module.js'
// import { NormalMapShader } from "three/examples/jsm/shaders/NormalMapShader"
// import { TerrainShader } from "three/examples/jsm/shaders/TerrainShader"
// import { BufferGeometryUtils } from "three/examples/jsm/utils/BufferGeometryUtils"

const SCREEN_WIDTH = window.innerWidth;
const SCREEN_HEIGHT = window.innerHeight;

export default {
  name: 'SoundLand',
  data() {
    return {
      camera: null,
      scene: null,
      renderer: null,
      mesh: null,
      controls: null,
      plane: null,
      torusKnot: null,
      dirLight: null,
      spotLight: null,
      dirGroup: null,
      clock: null,
      // stats: null
    };
  },
  mounted() {
    this.init()
    // this.render()
    this.animate()
    // this.cameraControls()
  },
  methods: {
    init: function() {
      var self = this
      self.initScene()
      self.initMisc()
      document.body.appendChild( self.renderer.domElement )
      // Resizing
      window.addEventListener( 'resize', self.onWindowResize, false )
      
      // let container = this.$el
      // this.camera = new THREE.PerspectiveCamera(70, container.clientWidth / container.clientHeight, 0.01, 10)
      // this.camera.position.z = 1
      // self.scene = new THREE.Scene()
      // self.scene.background = new THREE.Color(0xcccccc)
      // self.scene.fog = new THREE.FogExp2(0xcccccc, 0.002)

      // this.makeObjects()
      // this.setupLights()

      // this.renderer = new THREE.WebGLRenderer({ antialias: true });
      // this.renderer.setSize(container.clientWidth, container.clientHeight);
      // container.appendChild(this.renderer.domElement);
    },
    onWindowResize() {
      var self = this
      self.camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
      self.camera.updateProjectionMatrix();
      self.renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
    },
    animate() {
      var self = this
      requestAnimationFrame( self.animate );
      self.render();
      // this.stats.update();
    },
    renderScene() {
      var self = this
      self.renderer.render( self.scene, self.camera );
    },
    render() {
      var self = this
      var delta = self.clock.getDelta();
      var time = self.clock.elapsedTime;
      self.renderScene();
      self.torusKnot.rotation.x += 0.25 * delta;
      self.torusKnot.rotation.y += 2 * delta;
      self.torusKnot.rotation.z += 1 * delta;
      self.dirGroup.rotation.y += 0.7 * delta;
      self.dirLight.position.z = 17 + Math.sin(time*0.001)*5;
    },
    initScene () {
      var self = this
      self.camera = new THREE.PerspectiveCamera( 45, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 1000 );
      self.camera.position.set( 0, 10, 30 );
      self.scene = new THREE.Scene();
      self.scene.fog = new THREE.Fog( 0xCCCCCC, 50, 100 )
      // Lights
      self.scene.add( new THREE.AmbientLight( 0x444444 ) );
      self.spotLight = new THREE.SpotLight( 0x888888 );
      self.spotLight.name = 'Spot Light';
      self.spotLight.angle = Math.PI / 5;
      self.spotLight.penumbra = 0.3;
      self.spotLight.position.set( 8, 10, 5 );
      self.spotLight.castShadow = true;
      self.spotLight.shadow.camera.near = 8;
      self.spotLight.shadow.camera.far = 200;
      self.spotLight.shadow.mapSize.width = 256;
      self.spotLight.shadow.mapSize.height = 256;
      self.spotLight.shadow.bias = -0.002;
      self.spotLight.shadow.radius = 4;
      self.scene.add( self.spotLight );
      self.dirLight = new THREE.DirectionalLight( 0xFFFFFF, 1 );
      self.dirLight.name = 'Dir. Light';
      self.dirLight.position.set( 3, 12, 17 );
      self.dirLight.castShadow = true;
      self.dirLight.shadow.camera.near = 0.1;
      self.dirLight.shadow.camera.far = 500;
      self.dirLight.shadow.camera.right = 17;
      self.dirLight.shadow.camera.left = - 17;
      self.dirLight.shadow.camera.top	= 17;
      self.dirLight.shadow.camera.bottom = - 17;
      self.dirLight.shadow.mapSize.width = 512;
      self.dirLight.shadow.mapSize.height = 512;
      self.dirLight.shadow.radius = 4;
      self.dirLight.shadow.bias = -0.0005;
      self.scene.add( self.dirLight );
      self.dirGroup = new THREE.Group();
      self.dirGroup.add( self.dirLight );
      self.scene.add( self.dirGroup );
      // Geometry
      var geometry = new THREE.TorusKnotBufferGeometry( 25, 8, 75, 20 );
      var material = new THREE.MeshPhongMaterial( {
        color: 0x999999,
        shininess: 0,
        specular: 0x222222
      } );
      self.torusKnot = new THREE.Mesh( geometry, material );
      self.torusKnot.scale.multiplyScalar( 1 / 18 );
      self.torusKnot.position.y = 3;
      self.torusKnot.castShadow = true;
      self.torusKnot.receiveShadow = true;
      self.scene.add( self.torusKnot );
      var geometryTwo = new THREE.CylinderBufferGeometry( 0.75, 0.75, 7, 32 );
      var pillar1 = new THREE.Mesh( geometryTwo, material );
      pillar1.position.set( 10, 3.5, 10 );
      pillar1.castShadow = true;
      pillar1.receiveShadow = true;
      var pillar2 = pillar1.clone();
      pillar2.position.set( 10, 3.5, -10 );
      var pillar3 = pillar1.clone();
      pillar3.position.set( -10, 3.5, 10 );
      var pillar4 = pillar1.clone();
      pillar4.position.set( -10, 3.5, -10 );
      self.scene.add( pillar1 );
      self.scene.add( pillar2 );
      self.scene.add( pillar3 );
      self.scene.add( pillar4 );
      var geometryThr = new THREE.PlaneBufferGeometry( 200, 200 );
      var matTwo = new THREE.MeshPhongMaterial( {
        color: 0x999999,
        shininess: 0,
        specular: 0x111111
      } );
      var ground = new THREE.Mesh( geometryThr, matTwo );
      ground.rotation.x = -Math.PI/2;
      ground.scale.multiplyScalar( 3 );
      ground.castShadow = true;
      ground.receiveShadow = true;
      self.scene.add( ground );
    },
    initMisc () {
      var self = this
      self.renderer = new THREE.WebGLRenderer( { antialias: true } );
      self.renderer.setPixelRatio( window.devicePixelRatio );
      self.renderer.setSize( window.innerWidth, window.innerHeight );
      self.renderer.shadowMap.enabled = true;
      self.renderer.shadowMap.type = THREE.VSMShadowMap;		
      self.renderer.setClearColor( 0xCCCCCC, 1 );
      // Mouse control
      var controls = new OrbitControls( self.camera, self.renderer.domElement );
      controls.target.set( 0, 2, 0 );
      controls.update();
      self.clock = new THREE.Clock();
      // self.stats = new Stats();
      // self.document.body.appendChild( self.stats.dom );
    },
    cameraControls () {
      // console.log(TerrainShader)
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
  }
}
</script>

<style scoped>
.main-view {
  width: 100%;
  height: 100%;
}
</style>
