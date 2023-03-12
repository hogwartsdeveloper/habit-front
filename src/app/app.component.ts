import {Component, OnInit} from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  loader: GLTFLoader;
  man: THREE.Mesh;
  ngOnInit() {
    this.initThree();
    this.createMan();
    this.animateMan();
  }

  initThree() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 5;
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.loader = new GLTFLoader();
    document.body.appendChild(this.renderer.domElement);
  }

  createMan() {
    const manGeometry = new THREE.BoxGeometry(1, 2, 0.5);
    const manMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    this.man = new THREE.Mesh(manGeometry, manMaterial);
    this.man.position.set(0, -1, 0);
    this.scene.add(this.man);
  }

  animateMan() {
    const clock = new THREE.Clock();
    const speed = 0.1;
    const self = this;
    function animate() {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();
      self.man.position.z -= delta * speed;

      if (self.man.position.z < -10) {
        self.man.position.z = 10;
      }
      self.renderer.render(self.scene, self.camera);
    }
    animate();
  }
}
