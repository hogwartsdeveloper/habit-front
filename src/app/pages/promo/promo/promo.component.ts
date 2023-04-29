import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { ThreeSupportService } from '../services/three-support.service';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';
import {
  grassFragmentSource,
  grassVertexSource,
  groundVertex,
  groundVertexShaderReplace,
  skyFragmentShader2,
  skyVertexShader2,
} from '../services/another-code/promo';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { Subscription } from 'rxjs';
import { CharacterControls } from '../../../utils/characterControls';

@Component({
  selector: 'app-promo',
  templateUrl: './promo.component.html',
  styleUrls: ['./promo.component.scss'],
})
export class PromoComponent implements AfterViewInit, OnDestroy {
  @ViewChild('main') canvas: ElementRef<HTMLCanvasElement>;
  renderer: THREE.WebGLRenderer;
  scene = new THREE.Scene();
  orbitControl: OrbitControls;
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    5000
  );
  stats = Stats();
  hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
  dirLight = new THREE.DirectionalLight(0xffffff, 1);
  plane: THREE.Mesh;
  groundShader: THREE.Shader;
  grass: THREE.Mesh;
  fbxLoader = new FBXLoader();
  mixer: THREE.AnimationMixer;
  mountain: THREE.Group;
  model: THREE.Group;

  modelNumber = 1;
  subscription: Subscription;
  keysPressed: { [key: string]: boolean } = {};
  characterControls: CharacterControls;

  @HostListener('window:resize')
  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer?.setSize(window.innerWidth, window.innerHeight);
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    this.keysPressed[event.key?.toLowerCase()] = true;
  }

  @HostListener('document:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    this.keysPressed[event.key?.toLowerCase()] = false;
  }

  constructor(private threeSupportService: ThreeSupportService) {}

  ngAfterViewInit() {
    this.init();
    this.createLight();
    this.createSky(this.canvas.nativeElement);
    this.createLand();
    this.addMountain();
    this.addModel();
    this.animated();
    this.addStats();
  }

  init() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: this.canvas.nativeElement,
    });
    this.orbitControl = new OrbitControls(
      this.camera,
      this.canvas.nativeElement
    );

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.setClearColor(0xa3a3a3);

    this.camera.position.set(0, 4.5, -35);
    this.orbitControl.update();
  }
  createLight() {
    this.hemiLight.color.set(0xffffff);
    this.hemiLight.position.set(0, 20, 0);
    this.scene.add(this.hemiLight);

    this.dirLight.color.set(0xffffff);
    this.dirLight.position.set(2, 1, 1);
    this.dirLight.position.multiplyScalar(30);
    this.scene.add(this.dirLight);

    this.dirLight.castShadow = true;

    this.dirLight.shadow.mapSize.width = 2048;
    this.dirLight.shadow.mapSize.height = 2048;

    this.dirLight.shadow.camera.near = 0.1;
    this.dirLight.shadow.camera.far = 50;
    this.dirLight.shadow.camera.top = 10;
    this.dirLight.shadow.camera.bottom = -10;
    this.dirLight.shadow.camera.left = -10;
    this.dirLight.shadow.camera.right = 10;

    this.dirLight.shadow.camera.far = 100;
    this.dirLight.shadow.bias = -0.0001;
  }
  createSky(canvas: HTMLCanvasElement) {
    const elevation = 0.2;
    const azimuth = 0.4;
    const fogFade = 0.009;
    const FOV = 48;
    const uniforms = {
      sunDirection: {
        type: 'vec3',
        value: new THREE.Vector3(
          Math.sin(azimuth),
          Math.sin(elevation),
          Math.cos(azimuth)
        ),
      },
      resolution: {
        type: 'vec2',
        value: new THREE.Vector2(canvas.width, canvas.height),
      },
      fogFade: {
        type: 'float',
        value: fogFade,
      },
      fov: { type: 'float', value: FOV },
    };
    const backgroundMaterial = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: skyVertexShader2,
      fragmentShader: skyFragmentShader2,
    });

    backgroundMaterial.depthWrite = false;
    const geometry = new THREE.PlaneGeometry(2, 2, 1, 1);
    const sky = new THREE.Mesh(geometry, backgroundMaterial);

    this.scene.add(sky);
  }

  createLand() {
    const width = 450;
    const resolution = 64;
    const pos = new THREE.Vector2(0.01, 0.01);
    const loader = new THREE.TextureLoader();
    const noiseTexture = loader.load('assets/textures/perlinFbm.jpeg');
    const grassTexture = loader.load('assets/textures/blade_diffuse.jpeg');
    const alphaMap = loader.load('assets/textures/blade_alpha.jpeg');

    const groundBaseGeometry = new THREE.PlaneGeometry(
      width,
      width,
      resolution,
      resolution
    );
    groundBaseGeometry.lookAt(new THREE.Vector3(0, 1, 0));
    const attribute = groundBaseGeometry.attributes[
      'position'
    ] as THREE.BufferAttribute;
    attribute.needsUpdate = true;

    const groundGeometry = new THREE.PlaneGeometry(
      width,
      width,
      resolution,
      resolution
    );
    groundGeometry.setAttribute(
      'basePosition',
      groundBaseGeometry.getAttribute('position')
    );
    groundGeometry.lookAt(new THREE.Vector3(0, 1, 0));
    groundGeometry.getAttribute('position').needsUpdate = true;

    const groundMaterial = new THREE.MeshPhongMaterial();
    groundMaterial.color = new THREE.Color('rgb(10%, 25%, 2%)');

    groundMaterial.onBeforeCompile = (shader) => {
      shader.uniforms['delta'] = { value: width / resolution };
      shader.uniforms['posX'] = { value: pos.x };
      shader.uniforms['posZ'] = { value: pos.y };
      shader.uniforms['width'] = { value: width };
      shader.uniforms['noiseTexture'] = { value: noiseTexture };
      shader.vertexShader = groundVertex + shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace(
        '#include <beginnormal_vertex>',
        groundVertexShaderReplace
      );
      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `vec3 transformed = vec3(pos);`
      );
      this.groundShader = shader;
    };

    this.plane = new THREE.Mesh(groundGeometry, groundMaterial);
    this.plane.receiveShadow = true;
    this.scene.add(this.plane);

    const planeShape = new CANNON.Plane();
    const planeBody = new CANNON.Body({ mass: 0 });
    planeBody.addShape(planeShape);
    planeBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(1, 0, 0),
      -Math.PI / 2
    );

    this.createGrass(
      width,
      resolution,
      pos,
      noiseTexture,
      alphaMap,
      grassTexture
    );
  }

  createGrass(
    width: number,
    resolution: number,
    pos: THREE.Vector2,
    noiseTexture: THREE.Texture,
    alphaMap: THREE.Texture,
    grassTexture: THREE.Texture
  ) {
    const bladeWidth = 0.12;
    const bladeHeight = 1;
    const joints = 4;
    const instances = 400000;
    const elevation = 0.2;
    const azimuth = 0.4;

    const ambientStrength = 0.7;
    const translucencyStrength = 1.5;
    const specularStrength = 0.5;
    const diffuseStrength = 1.5;
    const shininess = 256;
    const sunColour = new THREE.Vector3(1.0, 1.0, 1.0);
    const specularColour = new THREE.Vector3(1.0, 1.0, 1.0);
    const grassBaseGeometry = new THREE.PlaneGeometry(
      bladeWidth,
      bladeHeight,
      1,
      joints
    );

    grassBaseGeometry.translate(0, bladeHeight / 2, 0);

    const vertex = new THREE.Vector3();
    const quaternion0 = new THREE.Quaternion();
    const quaternion1 = new THREE.Quaternion();
    let x, y, z;

    quaternion0.set(
      ...this.threeSupportService.getQuaternion(0.5, new THREE.Vector3(0, 1, 0))
    );
    quaternion1.set(
      ...this.threeSupportService.getQuaternion(0.3, new THREE.Vector3(1, 0, 0))
    );
    quaternion0.multiply(quaternion1);
    quaternion1.set(
      ...this.threeSupportService.getQuaternion(0.1, new THREE.Vector3(0, 0, 1))
    );
    quaternion0.multiply(quaternion1);

    const quaternion2 = new THREE.Quaternion();

    for (
      let v = 0;
      // @ts-ignore
      v < grassBaseGeometry.attributes['position'].array.length;
      v += 3
    ) {
      quaternion2.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);
      // @ts-ignore
      vertex.x = grassBaseGeometry.attributes['position'].array[v];
      // @ts-ignore
      vertex.y = grassBaseGeometry.attributes['position'].array[v + 1];
      // @ts-ignore
      vertex.z = grassBaseGeometry.attributes['position'].array[v + 2];
      let frac = vertex.y / bladeHeight;
      quaternion2.slerp(quaternion0, frac);
      vertex.applyQuaternion(quaternion2);
      // @ts-ignore
      grassBaseGeometry.attributes['position'].array[v] = vertex.x;
      // @ts-ignore
      grassBaseGeometry.attributes['position'].array[v + 1] = vertex.y;
      // @ts-ignore
      grassBaseGeometry.attributes['position'].array[v + 2] = vertex.z;
    }

    grassBaseGeometry.computeVertexNormals();

    const instancedGeometry = new THREE.InstancedBufferGeometry();

    instancedGeometry.index = grassBaseGeometry.index;
    instancedGeometry.attributes['position'] =
      grassBaseGeometry.attributes['position'];
    instancedGeometry.attributes['uv'] = grassBaseGeometry.attributes['uv'];
    instancedGeometry.attributes['normal'] =
      grassBaseGeometry.attributes['normal'];

    // Each instance has its own data for position, orientation and scale
    const indices: number[] = [];
    const offsets: number[] = [];
    const scales: number[] = [];
    const halfRootAngles: number[] = [];

    //For each instance of the grass blade
    for (let i = 0; i < instances; i++) {
      indices.push(i / instances);

      //Offset of the roots
      x = Math.random() * width - width / 2;
      z = Math.random() * width - width / 2;
      y = 0;
      offsets.push(x, y, z);

      //Random orientation
      let angle = Math.PI - Math.random() * (2 * Math.PI);
      halfRootAngles.push(Math.sin(0.5 * angle), Math.cos(0.5 * angle));

      //Define variety in height
      if (i % 3 != 0) {
        scales.push(2.0 + Math.random() * 1.25);
      } else {
        scales.push(2.0 + Math.random());
      }
    }

    const offsetAttribute = new THREE.InstancedBufferAttribute(
      new Float32Array(offsets),
      3
    );
    const scaleAttribute = new THREE.InstancedBufferAttribute(
      new Float32Array(scales),
      1
    );
    const halfRootAngleAttribute = new THREE.InstancedBufferAttribute(
      new Float32Array(halfRootAngles),
      2
    );
    const indexAttribute = new THREE.InstancedBufferAttribute(
      new Float32Array(indices),
      1
    );

    instancedGeometry.setAttribute('offset', offsetAttribute);
    instancedGeometry.setAttribute('scale', scaleAttribute);
    instancedGeometry.setAttribute('halfRootAngle', halfRootAngleAttribute);
    instancedGeometry.setAttribute('index', indexAttribute);
    const uniforms = {
      time: { type: 'float', value: 0 },
      delta: { type: 'float', value: width / resolution },
      posX: { type: 'float', value: pos.x },
      posZ: { type: 'float', value: pos.y },
      width: { type: 'float', value: width },
      map: { value: grassTexture },
      alphaMap: { value: alphaMap },
      noiseTexture: { value: noiseTexture },
      sunDirection: {
        type: 'vec3',
        value: new THREE.Vector3(
          Math.sin(azimuth),
          Math.sin(elevation),
          -Math.cos(azimuth)
        ),
      },
      cameraPosition: { type: 'vec3', value: this.camera.position },
      ambientStrength: { type: 'float', value: ambientStrength },
      translucencyStrength: { type: 'float', value: translucencyStrength },
      diffuseStrength: { type: 'float', value: diffuseStrength },
      specularStrength: { type: 'float', value: specularStrength },
      shininess: { type: 'float', value: shininess },
      lightColour: { type: 'vec3', value: sunColour },
      specularColour: { type: 'vec3', value: specularColour },
    };

    //Define the material, specifying attributes, uniforms, shaders etc.
    const grassMaterial = new THREE.RawShaderMaterial({
      uniforms,
      vertexShader: grassVertexSource(bladeHeight),
      fragmentShader: grassFragmentSource,
      side: THREE.DoubleSide,
    });

    this.grass = new THREE.Mesh(instancedGeometry, grassMaterial);
    this.grass.receiveShadow = true;
    this.scene.add(this.grass);
  }

  addMountain() {
    this.fbxLoader.load('assets/models/mountain.fbx', (object) => {
      this.mountain = object;
      this.mountain.position.set(0, -2, 320);
      this.scene.add(this.mountain);
    });
  }

  addModel() {
    this.fbxLoader.load('assets/models/Happy Walk.fbx', (object) => {
      this.model = object;
      this.model.scale.copy(new THREE.Vector3(5, 5, 5));
      this.model.position.set(0, 0, 0);

      const modelShape = new CANNON.Sphere(5);

      this.mixer = new THREE.AnimationMixer(this.model);
      const animationClip = this.model.animations[0]; // get the first animation clip
      const action = this.mixer.clipAction(animationClip);
      action.play();
      this.model.traverse((child) => {
        child.castShadow = true;
        child.receiveShadow = true;
      });
      this.scene.add(this.model);

      this.characterControls = new CharacterControls(
        this.model,
        this.orbitControl,
        this.camera
      );
    });
  }

  addStats() {
    document.body.appendChild(this.stats.dom);
  }

  updateCameraPosition() {
    const maxDistance = 60;
    const minDistance = 25;
    const maxPan = new THREE.Vector3(360, 365, 360);
    const minPan = new THREE.Vector3(-360, 3, -360);

    const distance = this.camera.position.distanceTo(this.orbitControl.target);
    if (distance > maxDistance) {
      this.camera.position
        .subVectors(this.camera.position, this.orbitControl.target)
        .normalize()
        .multiplyScalar(maxDistance)
        .add(this.orbitControl.target);
    } else if (distance < minDistance) {
      this.camera.position
        .subVectors(this.camera.position, this.orbitControl.target)
        .normalize()
        .multiplyScalar(minDistance)
        .add(this.orbitControl.target);
    }

    this.camera.position.clamp(minPan, maxPan);
  }

  animated() {
    const grassMaterial = this.grass.material as THREE.RawShaderMaterial;
    const clock = new THREE.Clock();
    let delta;
    let time = 0;
    let lastFrame = Date.now();
    let thisFrame;
    let dT = 0;
    const speed = 0.8;
    const animate = () => {
      this.stats.update();
      delta = Math.min(clock.getDelta(), 0.1);
      this.mixer?.update(delta);
      thisFrame = Date.now();
      dT = (thisFrame - lastFrame) / 350;
      time += dT;
      lastFrame = thisFrame;

      if (this.characterControls) {
        this.characterControls.update(
          delta,
          this.keysPressed,
          speed,
          grassMaterial,
          this.groundShader
        );
      }

      if (this.grass && this.groundShader) {
        grassMaterial.uniforms['time'].value = time;
      }

      if (this.orbitControl) {
        this.updateCameraPosition();
      }
      this.renderer.render(this.scene, this.camera);
    };
    this.renderer.setAnimationLoop(animate);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
