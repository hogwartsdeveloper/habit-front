import {Component, HostListener, OnInit} from '@angular/core';
import * as THREE from 'three';
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  renderer = new THREE.WebGLRenderer();
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
  );
  mixer: THREE.AnimationMixer;
  model: THREE.Group;
  plane: THREE.Mesh;
  @HostListener('window:resize')
  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  ngOnInit() {
    this.theeInit();
    this.createLand();
    this.addLight();
    this.addModel();
    this.animated();
  }

  theeInit() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    this.renderer.setClearColor(0xA3A3A3);

    const orbit = new OrbitControls(this.camera, this.renderer.domElement);
    this.camera.position.set(0, 1.5, -6);
    orbit.update();
  }

  createLand() {
    const geometry = new THREE.PlaneGeometry(30, 30, 64, 64);
    const material = new THREE.MeshStandardMaterial({
      color: 'gray',
    });
    this.plane = new THREE.Mesh(geometry, material);

    this.plane.rotation.x = -Math.PI / 2;

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
        if (child.isObject3D) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      this.scene.add(this.model);
    })
  }

  addLight() {
    const ambientLight = new THREE.AmbientLight(0xFFFFFF);
    this.scene.add(ambientLight);

    const directionLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
    this.scene.add(directionLight);
    directionLight.position.set(-30, 35, -30);
  }

  animated() {
    const clock = new THREE.Clock();
    const speed = 1;
    const animate = () => {
      const delta = clock.getDelta();
      this.mixer?.update(delta);
      if (this.model && this.plane) {
        this.model.position.z += delta * speed;
        this.plane.position.z += delta * speed;

      }
      this.renderer.render(this.scene, this.camera);
    }
    this.renderer.setAnimationLoop(animate);
  }
}
