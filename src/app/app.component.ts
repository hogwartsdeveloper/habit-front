import {Component, OnInit} from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  ngOnInit() {
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    renderer.setClearColor(0xA3A3A3);

    const orbit = new OrbitControls(camera, renderer.domElement);
    camera.position.set(10, 10, 10);
    orbit.update();

    const grid = new THREE.GridHelper(30, 30);
    scene.add(grid);

    const assetsLoader = new GLTFLoader();
    assetsLoader.load('assets/models/me.glb', (gltf) => {
      const model = gltf.scene;
      scene.add(model);

      const ambientLight = new THREE.AmbientLight(0xFFFFFF);
      scene.add(ambientLight);
    }, undefined, (error) => console.log(error));

    function animate() {
      renderer.render(scene, camera);
    }
    renderer.setAnimationLoop(animate);

    window.addEventListener('resize', function () {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    })
  }
}
