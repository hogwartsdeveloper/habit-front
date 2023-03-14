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
  @HostListener('window:resize')
  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  ngOnInit() {
    this.theeInit();
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

    const grid = new THREE.GridHelper(30, 30);
    this.scene.add(grid);
  }

  addModel() {
    const fbxLoader = new FBXLoader();
    fbxLoader.load('assets/models/me.fbx', (object) => {
      this.mixer = new THREE.AnimationMixer(object);
      const animationClip = object.animations[0]; // get the first animation clip
      const action = this.mixer.clipAction(animationClip);
      action.play();
      object.traverse((child) => {
        if (child.isObject3D) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      })
      this.scene.add(object);
      const ambientLight = new THREE.AmbientLight(0xFFFFFF);
      this.scene.add(ambientLight);

      const directionLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
      this.scene.add(directionLight);
      directionLight.position.set(-30, 35, -30);
    })
  }

  animated() {
    const animate = (currentTime: number) => {
      this.mixer?.update((currentTime / performance.now()) / 150)
      this.renderer.render(this.scene, this.camera);
    }
    this.renderer.setAnimationLoop(animate);
  }
}
