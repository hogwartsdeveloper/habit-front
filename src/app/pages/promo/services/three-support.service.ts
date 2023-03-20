import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import {
  grassFragmentSource,
  grassVertexSource,
  groundVertex,
  groundVertexShaderReplace,
  skyFragmentShader,
  skyVertexShader,
} from './another-code/promo';

@Injectable()
export class ThreeSupportService {
  private renderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    5000
  );
  private hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
  private dirLight = new THREE.DirectionalLight(0xffffff, 1);
  private mixer: THREE.AnimationMixer;
  private model: THREE.Group;
  private plane: any;

  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer?.setSize(window.innerWidth, window.innerHeight);
  }

  init(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
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

    this.renderer.setClearColor(0xa3a3a3);

    const orbit = new OrbitControls(this.camera, this.renderer.domElement);
    this.camera.position.set(0, 10, -40);

    orbit.update();
  }

  createSky() {
    const uniforms = {
      topColor: { value: new THREE.Color(0x0077ff) },
      bottomColor: { value: new THREE.Color(0xffffff) },
      offset: { value: 33 },
      exponent: { value: 0.6 },
    };

    uniforms['topColor'].value.copy(this.hemiLight.color);
    this.scene.background = new THREE.Color().setHSL(0.6, 0, 1);
    this.scene.fog = new THREE.Fog(this.scene.background, 1, 5000);
    this.scene.fog.color.copy(uniforms['bottomColor'].value);
    const skyGeo = new THREE.SphereGeometry(4000, 32, 15);
    const skyMat = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: skyVertexShader,
      fragmentShader: skyFragmentShader,
      side: THREE.BackSide,
    });

    const sky = new THREE.Mesh(skyGeo, skyMat);
    this.scene.add(sky);
  }

  createLand() {
    const width = 500;
    const resolution = 64;
    const pos = new THREE.Vector2(0.01, 0.01);
    const bladeWidth = 0.12;
    const bladeHeight = 1;
    const joints = 4;
    const instances = 40000;
    const elevation = 0.2;
    const azimuth = 0.4;

    const ambientStrength = 0.7;
    const translucencyStrength = 1.5;
    const specularStrength = 0.5;
    const diffuseStrength = 1.5;
    const shininess = 256;
    const sunColour = new THREE.Vector3(1.0, 1.0, 1.0);
    const specularColour = new THREE.Vector3(1.0, 1.0, 1.0);

    const loader = new THREE.TextureLoader();
    const grassTexture = loader.load('assets/textures/blade_diffuse.jpeg');
    const alphaMap = loader.load('assets/textures/blade_alpha.jpeg');
    const noiseTexture = loader.load('assets/textures/perlinFbm.jpeg');

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

    let groundShader;
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
      groundShader = shader;
    };

    this.plane = new THREE.Mesh(groundGeometry, groundMaterial);
    this.plane.receiveShadow = true;
    this.scene.add(this.plane);

    // grass

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

    quaternion0.set(...this.getQuaternion(0.5, new THREE.Vector3(0, 1, 0)));
    quaternion1.set(...this.getQuaternion(0.3, new THREE.Vector3(1, 0, 0)));
    quaternion0.multiply(quaternion1);
    quaternion1.set(...this.getQuaternion(0.1, new THREE.Vector3(0, 0, 1)));
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
    const instancedAttribute = instancedGeometry.attributes[
      'position'
    ] as THREE.BufferAttribute;
    instancedAttribute;

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

    const grass = new THREE.Mesh(instancedGeometry, grassMaterial);
    this.scene.add(grass);

    let time = 0;
    let lastFrame = Date.now();
    let thisFrame;
    let dT = 0;

    function draw() {
      //Update time
      thisFrame = Date.now();
      dT = (thisFrame - lastFrame) / 200.0;
      time += dT;
      lastFrame = thisFrame;

      grassMaterial.uniforms['time'].value = time;

      requestAnimationFrame(draw);
    }

    draw();
  }

  getQuaternion(
    angle: number,
    rotationAxis: THREE.Vector3
  ): [number, number, number, number] {
    const sinAngle = Math.sin(angle / 2.0);
    const x = rotationAxis.x * sinAngle;
    const y = rotationAxis.y * sinAngle;
    const z = rotationAxis.z * sinAngle;
    const w = Math.cos(angle / 2.0);

    return [x, y, z, w];
  }

  addModel() {
    const fbxLoader = new FBXLoader();
    fbxLoader.load('assets/models/me.fbx', (object) => {
      this.model = object;
      this.model.scale.copy(new THREE.Vector3(8, 8, 8));
      this.mixer = new THREE.AnimationMixer(this.model);
      const animationClip = this.model.animations[0]; // get the first animation clip
      const action = this.mixer.clipAction(animationClip);
      action.play();
      this.model.traverse((child) => {
        child.castShadow = true;
        child.receiveShadow = true;
      });
      this.scene.add(this.model);
    });
  }

  addLight() {
    this.hemiLight.color.set(0xffffff);
    this.hemiLight.position.set(0, 20, 0);
    this.scene.add(this.hemiLight);

    this.dirLight.color.set(0xffffff);
    this.dirLight.position.set(-2, 0.8, 0);
    this.dirLight.position.multiplyScalar(30);
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
    this.dirLight.shadow.bias = -0.0001;
  }

  animated() {
    const clock = new THREE.Clock();
    const animate = () => {
      const delta = clock.getDelta();
      this.mixer?.update(delta);
      this.renderer.render(this.scene, this.camera);
    };
    this.renderer.setAnimationLoop(animate);
  }
}
