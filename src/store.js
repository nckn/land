import Vue from "vue";
import Vuex from "vuex";
import {
  TrackballControls,
  PerspectiveCamera,
  WebGLRenderer,
  PCFShadowMap
} from "three-full";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    width: 0,
    height: 0,
    camera: null,
    controls: null,
    scene: null,
    renderer: null,
    axisLines: [],
    pyramids: [],
    plane: null
  },
  getters: {
    CAMERA_POSITION: state => {
      return state.camera ? state.camera.position : null;
    }
  },
  mutations: {
    FETCH_THE_SCENE(state) {
      return state.scene
    },
    SET_VIEWPORT_SIZE(state, { width, height }) {
      state.width = width;
      state.height = height;
    },
    INITIALIZE_RENDERER(state, el) {
      state.renderer = new WebGLRenderer({ antialias: true });
      state.renderer.setPixelRatio(window.devicePixelRatio);
      state.renderer.setSize(state.width, state.height);
      state.renderer.setClearColor(0x2a363b, 1);
      el.appendChild(state.renderer.domElement);
    },
    INITIALIZE_CAMERA(state) {
      state.camera = new PerspectiveCamera(
        // 1. Field of View (degrees) org 60
        20,
        // 2. Aspect ratio
        state.width / state.height,
        // 3. Near clipping plane
        1,
        // 4. Far clipping plane
        1000
      );
      // state.camera.position.z = 500;
      state.camera.position.set(30, 120, 350)
    },
    INITIALIZE_CONTROLS(state) {
      state.controls = new TrackballControls(
        state.camera,
        state.renderer.domElement
      );
      state.controls.rotateSpeed = 1.0;
      state.controls.zoomSpeed = 1.2;
      state.controls.panSpeed = 0.8;
      state.controls.noZoom = false;
      state.controls.noPan = false;
      state.controls.staticMoving = true;
      state.controls.dynamicDampingFactor = 0.3;
      state.controls.keys = [65, 83, 68];
    },
    UPDATE_CONTROLS(state) {
      state.controls.update();
    },
    RESIZE(state, { width, height }) {
      state.width = width;
      state.height = height;
      state.camera.aspect = width / height;
      // Set limits for camera
      // state.camera.minDistance = 2
      // state.camera.maxDistance = 10
      state.camera.updateProjectionMatrix();
      state.renderer.setSize(width, height);
      state.controls.handleResize();
      state.renderer.render(state.scene, state.camera);
      state.renderer.shadowMap.enabled = true;
			state.renderer.shadowMap.type = PCFShadowMap;
    },
    SET_CAMERA_POSITION(state, { x, y, z }) {
      if (state.camera) {
        state.camera.position.set(x, y, z);
      }
    },
    RESET_CAMERA_ROTATION(state) {
      if (state.camera) {
        state.camera.rotation.set(0, 0, 0);
        state.camera.quaternion.set(0, 0, 0, 1);
        state.camera.up.set(0, 1, 0);
        state.controls.target.set(0, 0, 0);
      }
    },
    HIDE_AXIS_LINES(state) {
      state.scene.remove(...state.axisLines);
      state.renderer.render(state.scene, state.camera);
    },
    SHOW_AXIS_LINES(state) {
      state.scene.add(...state.axisLines);
      state.renderer.render(state.scene, state.camera);
    },
    HIDE_PYRAMIDS(state) {
      state.scene.remove(...state.pyramids);
      state.renderer.render(state.scene, state.camera);
    },
    SHOW_PYRAMIDS(state) {
      state.scene.add(...state.pyramids);
      state.renderer.render(state.scene, state.camera);
    }
  },
  actions: {
    INIT({ state, commit }, { width, height, el }) {
      return new Promise(resolve => {
        commit("SET_VIEWPORT_SIZE", { width, height });
        commit("INITIALIZE_RENDERER", el);
        commit("INITIALIZE_CAMERA");
        commit("INITIALIZE_CONTROLS");
        // commit("INITIALIZE_SCENE");

        // Initial scene rendering
        state.renderer.render(state.scene, state.camera);

        // Add an event listener that will re-render
        // the scene when the controls are changed
        state.controls.addEventListener("change", () => {
          state.renderer.render(state.scene, state.camera);
        });

        resolve();
      });
    },
    ANIMATE({ state, dispatch }) {
      window.requestAnimationFrame(() => {
        dispatch("ANIMATE");
        state.controls.update();
      });
    }
  }
});
