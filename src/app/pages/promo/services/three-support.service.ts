import { Injectable } from '@angular/core';
import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";

@Injectable()
export class ThreeSupportService {
  private renderer = new THREE.WebGLRenderer();
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 5000);
  private hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
  private dirLight = new THREE.DirectionalLight(0xffffff, 1);
  private mixer: THREE.AnimationMixer;
  private model: THREE.Group;
  private plane: THREE.Mesh;

  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  init() {
    this.threeInit();
    this.addLight();
    this.createSky();
    this.createLand();
    this.addModel();
    this.animated();
  }

  threeInit() {
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    document.body.appendChild(this.renderer.domElement);

    this.renderer.setClearColor(0xA3A3A3);

    const orbit = new OrbitControls(this.camera, this.renderer.domElement);
    this.camera.position.set(0, 1.5, -6);

    orbit.update();
  }

  createSky() {
    const vertexShader = `
    varying vec3 vWorldPosition;
    void main() {
      vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
      vWorldPosition = worldPosition.xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }`

    const fragmentShader = `
    uniform vec3 topColor;
    uniform vec3 bottomColor;
    uniform float offset;
    uniform float exponent;
    varying vec3 vWorldPosition;
    void main() {
      float h = normalize( vWorldPosition + offset ).y;
      gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( max( h , 0.0), exponent ), 0.0 ) ), 1.0 );
    }`

    const uniforms = {
      'topColor': { value: new THREE.Color( 0x0077ff ) },
      'bottomColor': { value: new THREE.Color( 0xffffff ) },
      'offset': { value: 33 },
      'exponent': { value: 0.6 }
    }

    uniforms[ 'topColor' ].value.copy( this.hemiLight.color );
    this.scene.background = new THREE.Color().setHSL(0.6, 0, 1);
    this.scene.fog = new THREE.Fog(this.scene.background, 1, 5000);
    this.scene.fog.color.copy( uniforms[ 'bottomColor' ].value );
    const skyGeo = new THREE.SphereGeometry( 4000, 32, 15 );
    const skyMat = new THREE.ShaderMaterial( {
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      side: THREE.BackSide
    } );

    const sky = new THREE.Mesh( skyGeo, skyMat );
    this.scene.add( sky );
  }

  createLand() {
    const geometry = new THREE.PlaneGeometry(10000, 10000);
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
    });
    material.color.setHSL(0.095, 1, 0.75);
    this.plane = new THREE.Mesh(geometry, material);
    this.plane.rotation.x = -Math.PI / 2;
    this.plane.receiveShadow = true;

    this.scene.add(this.plane);
  }

  addModel() {
    const fbxLoader = new FBXLoader();
    fbxLoader.load('assets/models/me.fbx', (object) => {
      this.model = object;
      this.mixer = new THREE.AnimationMixer(this.model);
      const animationClip = this.model.animations[0]; // get the first animation clip
      const action = this.mixer.clipAction(animationClip);
      action.play();
      this.model.traverse((child) => {
        child.castShadow = true;
        child.receiveShadow = true;
      });
      this.scene.add(this.model);
    })
  }

  addLight() {
    this.hemiLight.color.setHSL(0.6, 1, 0.6);
    this.hemiLight.groundColor.setHSL(0.095, 1, 0.75);
    this.hemiLight.position.set(0, 20, 0);
    this.scene.add(this.hemiLight);

    this.dirLight.color.setHSL(0.1, 1, 0.95);
    this.dirLight.position.set( -2, 0.8, 0 );
    this.dirLight.position.multiplyScalar( 30 );
    this.scene.add(this.dirLight);

    this.dirLight.castShadow = true;

    this.dirLight.shadow.mapSize.width = 2048;
    this.dirLight.shadow.mapSize.height = 2048;

    this.dirLight.shadow.camera.near = 0.1;
    this.dirLight.shadow.camera.far = 50;
    this.dirLight.shadow.camera.top = 1.75;
    this.dirLight.shadow.camera.bottom = -1.75;
    this.dirLight.shadow.camera.left = -1.75;
    this.dirLight.shadow.camera.right = 1.75;

    this.dirLight.shadow.camera.far = 100;
    this.dirLight.shadow.bias = - 0.0001;
  }

  animated() {
    const clock = new THREE.Clock();
    const animate = () => {
      const delta = clock.getDelta();
      this.mixer?.update(delta);
      this.renderer.render(this.scene, this.camera);
    }
    this.renderer.setAnimationLoop(animate);
  }
}
