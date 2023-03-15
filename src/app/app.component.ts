import {Component, HostListener, OnInit} from '@angular/core';
import * as THREE from 'three';
import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  renderer = new THREE.WebGLRenderer();
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 5000
  );
  hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
  dirLight = new THREE.DirectionalLight(0xffffff, 1);
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
    this.addLight();
    this.createLand();
    this.addModel();
    this.animated();
  }

  theeInit() {
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    document.body.appendChild(this.renderer.domElement);

    this.renderer.setClearColor(0xA3A3A3);

    const orbit = new OrbitControls(this.camera, this.renderer.domElement);
    this.camera.position.set(0, 1.5, -6);
    // this.camera.position.set( 0, 0, 250 );

    this.scene.background = new THREE.Color().setHSL(0.6, 0, 1);
    this.scene.fog = new THREE.Fog(this.scene.background, 1, 5000);
    orbit.update();
  }

  createLand() {
    const geometry = new THREE.PlaneGeometry(10000, 10000);
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
    });
    material.color.setHSL(0.095, 1, 0.75);
    this.plane = new THREE.Mesh(geometry, material);
    this.plane.position.y = -33;
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

    const hemiHelper = new THREE.HemisphereLightHelper(this.hemiLight, 5);
    this.scene.add(hemiHelper);

    this.dirLight.color.setHSL(0.1, 1, 0.95);
    this.dirLight.position.set( 0, 1.75, 1.5 );
    this.dirLight.position.multiplyScalar( 30 );
    this.scene.add(this.dirLight);

    this.dirLight.castShadow = true;

    this.dirLight.shadow.mapSize.width = 2048;
    this.dirLight.shadow.mapSize.height = 2048;

    const d = 20;

    this.dirLight.shadow.camera.left = - d;
    this.dirLight.shadow.camera.right = d;
    this.dirLight.shadow.camera.top = d;
    this.dirLight.shadow.camera.bottom = - d;

    this.dirLight.shadow.camera.far = 3500;
    this.dirLight.shadow.bias = - 0.0001;

    const dirLightHelper = new THREE.DirectionalLightHelper( this.dirLight, 10 );
    this.scene.add( dirLightHelper );
  }

  animated() {
    const clock = new THREE.Clock();
    const speed = 1;
    const animate = () => {
      const delta = clock.getDelta();
      this.mixer?.update(delta);
      if (this.model && this.plane && this.camera) {
        this.model.position.z += delta * speed;
        this.plane.position.z += delta * speed;
        this.camera.position.z += delta * speed;
        this.hemiLight.position.z += delta * speed;
        this.dirLight.position.z += delta * speed;
      }
      this.renderer.render(this.scene, this.camera);
    }
    this.renderer.setAnimationLoop(animate);
  }
}
