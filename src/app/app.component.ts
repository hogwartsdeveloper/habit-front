import {Component, HostListener, OnInit} from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  renderer = new THREE.WebGLRenderer();
  camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
  );
  @HostListener('window:resize')
  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  ngOnInit() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    const scene = new THREE.Scene();
    this.renderer.setClearColor(0xA3A3A3);

    const orbit = new OrbitControls(this.camera, this.renderer.domElement);
    this.camera.position.set(0, 1.5, -6);
    orbit.update();

    const grid = new THREE.GridHelper(30, 30);
    scene.add(grid);

    const assetsLoader = new GLTFLoader();
    assetsLoader.load('assets/models/me.glb', (gltf) => {
      const model = gltf.scene;
      scene.add(model);

      const ambientLight = new THREE.AmbientLight(0xFFFFFF);
      scene.add(ambientLight);

      const directionLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
      scene.add(directionLight);
      directionLight.position.set(-30, 35, -30);

    }, undefined, (error) => console.log(error));
    const animate = () => {
      this.renderer.render(scene, this.camera);
    }
    this.renderer.setAnimationLoop(animate);
  }
}
