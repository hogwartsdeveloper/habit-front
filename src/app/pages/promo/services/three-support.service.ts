import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

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
    const vertexShader = `
    varying vec3 vWorldPosition;
    void main() {
      vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
      vWorldPosition = worldPosition.xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }`;

    const fragmentShader = `
    uniform vec3 topColor;
    uniform vec3 bottomColor;
    uniform float offset;
    uniform float exponent;
    varying vec3 vWorldPosition;
    void main() {
      float h = normalize( vWorldPosition + offset ).y;
      gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( max( h , 0.0), exponent ), 0.0 ) ), 1.0 );
    }`;

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
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      side: THREE.BackSide,
    });

    const sky = new THREE.Mesh(skyGeo, skyMat);
    this.scene.add(sky);
  }

  createLand() {
    const width = 100;
    const height = 100;
    const resolution = 64;
    const pos = new THREE.Vector2(0.01, 0.01);
    const radius = 240;
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
      height,
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

    const sharedPrefix = `
      uniform sampler2D noiseTexture;
      float getYPosition(vec2 p){
          return 8.0*(2.0*texture2D(noiseTexture, p/800.0).r - 1.0);
      }
    `;

    const groundVertexPrefix =
      sharedPrefix +
      ` 
      attribute vec3 basePosition;
      uniform float delta;
      uniform float posX;
      uniform float posZ;
      uniform float radius;
      uniform float width;
      
      float placeOnSphere(vec3 v){
        float theta = acos(v.z/radius);
        float phi = acos(v.x/(radius * sin(theta)));
        float sV = radius * sin(theta) * sin(phi);
        //If undefined, set to default value
        if(sV != sV){
          sV = v.y;
        }
        return sV;
      }
      
      //Get the position of the ground from the [x,z] coordinates, the sphere and the noise height field
      vec3 getPosition(vec3 pos, float epsX, float epsZ){
        vec3 temp;
        temp.x = pos.x + epsX;
        temp.z = pos.z + epsZ;
        temp.y = max(0.0, placeOnSphere(temp)) - radius;
        temp.y += getYPosition(vec2(basePosition.x+epsX+delta*floor(posX), basePosition.z+epsZ+delta*floor(posZ)));
        return temp;
      }
      
      //Find the normal at pos as the cross product of the central-differences in x and z directions
      vec3 getNormal(vec3 pos){
        float eps = 1e-1;
      
        vec3 tempP = getPosition(pos, eps, 0.0);
        vec3 tempN = getPosition(pos, -eps, 0.0);
        
        vec3 slopeX = tempP - tempN;
      
        tempP = getPosition(pos, 0.0, eps);
        tempN = getPosition(pos, 0.0, -eps);
      
        vec3 slopeZ = tempP - tempN;
      
        vec3 norm = normalize(cross(slopeZ, slopeX));
        return norm;
      }
      `;

    let groundShader;
    groundMaterial.onBeforeCompile = (shader) => {
      shader.uniforms['delta'] = { value: width / resolution };
      shader.uniforms['posX'] = { value: pos.x };
      shader.uniforms['posZ'] = { value: pos.y };
      shader.uniforms['radius'] = { value: radius };
      shader.uniforms['width'] = { value: width };
      shader.uniforms['noiseTexture'] = { value: noiseTexture };
      shader.vertexShader = groundVertexPrefix + shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace(
        '#include <beginnormal_vertex>',
        `//https://dev.to/maurobringolf/a-neat-trick-to-compute-modulo-of-negative-numbers-111e
			vec3 pos = vec3(0);
      pos.x = basePosition.x - mod(mod((delta*posX),delta) + delta, delta);
      pos.z = basePosition.z - mod(mod((delta*posZ),delta) + delta, delta);
      pos.y = max(0.0, placeOnSphere(pos)) - radius;
      pos.y += getYPosition(vec2(basePosition.x+delta*floor(posX), basePosition.z+delta*floor(posZ)));
      vec3 objectNormal = getNormal(pos);
#ifdef USE_TANGENT
      vec3 objectTangent = vec3( tangent.xyz );
#endif`
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

    const grassVertexSource =
      sharedPrefix +
      `
    precision mediump float;
    attribute vec3 position;
    attribute vec3 normal;
    attribute vec3 offset;
    attribute vec2 uv;
    attribute vec2 halfRootAngle;
    attribute float scale;
    attribute float index;
    uniform float time;

    uniform float delta;
    uniform float posX;
    uniform float posZ;
    uniform float radius;
    uniform float width;

    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying float frc;
    varying float idx;

    const float PI = 3.1415;
    const float TWO_PI = 2.0 * PI;


    //https://www.geeks3d.com/20141201/how-to-rotate-a-vertex-by-a-quaternion-in-glsl/
    vec3 rotateVectorByQuaternion(vec3 v, vec4 q){
      return 2.0 * cross(q.xyz, v * q.w + cross(q.xyz, v)) + v;
    }

    float placeOnSphere(vec3 v){
      float theta = acos(v.z/radius);
      float phi = acos(v.x/(radius * sin(theta)));
      float sV = radius * sin(theta) * sin(phi);
      //If undefined, set to default value
      if(sV != sV){
        sV = v.y;
      }
      return sV;
    }

    void main() {

    	//Vertex height in blade geometry
    	frc = position.y / float(` +
      bladeHeight +
      `);

    	//Scale vertices
      vec3 vPosition = position;
    	vPosition.y *= scale;

    	//Invert scaling for normals
    	vNormal = normal;
    	vNormal.y /= scale;

    	//Rotate blade around Y axis
      vec4 direction = vec4(0.0, halfRootAngle.x, 0.0, halfRootAngle.y);
    	vPosition = rotateVectorByQuaternion(vPosition, direction);
    	vNormal = rotateVectorByQuaternion(vNormal, direction);

      //UV for texture
      vUv = uv;

    	vec3 pos;
    	vec3 globalPos;
    	vec3 tile;

    	globalPos.x = offset.x-posX*delta;
    	globalPos.z = offset.z-posZ*delta;

    	tile.x = floor((globalPos.x + 0.5 * width) / width);
    	tile.z = floor((globalPos.z + 0.5 * width) / width);

    	pos.x = globalPos.x - tile.x * width;
    	pos.z = globalPos.z - tile.z * width;

    	pos.y = max(0.0, placeOnSphere(pos)) - radius;
    	pos.y += getYPosition(vec2(pos.x+delta*posX, pos.z+delta*posZ));

    	//Position of the blade in the visible patch [0->1]
      vec2 fractionalPos = 0.5 + offset.xz / width;
      //To make it seamless, make it a multiple of 2*PI
      fractionalPos *= TWO_PI;

      //Wind is sine waves in time.
      float noise = 0.5 + 0.5 * sin(fractionalPos.x + time);
      float halfAngle = -noise * 0.1;
      noise = 0.5 + 0.5 * cos(fractionalPos.y + time);
      halfAngle -= noise * 0.05;

    	direction = normalize(vec4(sin(halfAngle), 0.0, -sin(halfAngle), cos(halfAngle)));

    	//Rotate blade and normals according to the wind
      vPosition = rotateVectorByQuaternion(vPosition, direction);
    	vNormal = rotateVectorByQuaternion(vNormal, direction);

    	//Move vertex to global location
    	vPosition += pos;

    	//Index of instance for varying colour in fragment shader
    	idx = index;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition, 1.0);

    }`;

    const grassFragmentSource = `
    precision mediump float;

    uniform vec3 cameraPosition;

    //Light uniforms
    uniform float ambientStrength;
    uniform float diffuseStrength;
    uniform float specularStrength;
    uniform float translucencyStrength;
    uniform float shininess;
    uniform vec3 lightColour;
    uniform vec3 sunDirection;


    //Surface uniforms
    uniform sampler2D map;
    uniform sampler2D alphaMap;
    uniform vec3 specularColour;

    varying float frc;
    varying float idx;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;

    vec3 ACESFilm(vec3 x){
    	float a = 2.51;
    	float b = 0.03;
    	float c = 2.43;
    	float d = 0.59;
    	float e = 0.14;
    	return clamp((x*(a*x+b))/(x*(c*x+d)+e), 0.0, 1.0);
    }

    void main() {

      //If transparent, don't draw
      if(texture2D(alphaMap, vUv).r < 0.15){
        discard;
      }

    	vec3 normal;

    	//Flip normals when viewing reverse of the blade
    	if(gl_FrontFacing){
    		normal = normalize(vNormal);
    	}else{
    		normal = normalize(-vNormal);
    	}

      //Get colour data from texture
    	vec3 textureColour = pow(texture2D(map, vUv).rgb, vec3(2.2));

      //Add different green tones towards root
    	vec3 mixColour = idx > 0.75 ? vec3(0.2, 0.8, 0.06) : vec3(0.5, 0.8, 0.08);
      textureColour = mix(0.1 * mixColour, textureColour, 0.75);

    	vec3 lightTimesTexture = lightColour * textureColour;
      vec3 ambient = textureColour;
    	vec3 lightDir = normalize(sunDirection);

      //How much a fragment faces the light
    	float dotNormalLight = dot(normal, lightDir);
      float diff = max(dotNormalLight, 0.0);

      //Colour when lit by light
      vec3 diffuse = diff * lightTimesTexture;

      float sky = max(dot(normal, vec3(0, 1, 0)), 0.0);
    	vec3 skyLight = sky * vec3(0.12, 0.29, 0.55);

      vec3 viewDirection = normalize(cameraPosition - vPosition);
      vec3 halfwayDir = normalize(lightDir + viewDirection);
      //How much a fragment directly reflects the light to the camera
      float spec = pow(max(dot(normal, halfwayDir), 0.0), shininess);

      //Colour of light sharply reflected into the camera
      vec3 specular = spec * specularColour * lightColour;

    	//https://en.wikibooks.org/wiki/GLSL_Programming/Unity/Translucent_Surfaces
    	vec3 diffuseTranslucency = vec3(0);
    	vec3 forwardTranslucency = vec3(0);
    	float dotViewLight = dot(-lightDir, viewDirection);
    	if(dotNormalLight <= 0.0){
    		diffuseTranslucency = lightTimesTexture * translucencyStrength * -dotNormalLight;
    		if(dotViewLight > 0.0){
    			forwardTranslucency = lightTimesTexture * translucencyStrength * pow(dotViewLight, 16.0);
    		}
    	}

      vec3 col = 0.3 * skyLight * textureColour + ambientStrength * ambient + diffuseStrength * diffuse + specularStrength * specular + diffuseTranslucency + forwardTranslucency;

    	//Add a shadow towards root
    	col = mix(0.35*vec3(0.1, 0.25, 0.02), col, frc);

      //Tonemapping
      col = ACESFilm(col);

      //Gamma correction 1.0/2.2 = 0.4545...
    	col = pow(col, vec3(0.4545));

      gl_FragColor = vec4(col, 1.0);
    }`;

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
    let x, y, z, w, angle, sinAngle, rotationAxis;

    angle = 0.5;
    sinAngle = Math.sin(angle / 2.0);
    rotationAxis = new THREE.Vector3(0, 1, 0);
    x = rotationAxis.x * sinAngle;
    y = rotationAxis.y * sinAngle;
    z = rotationAxis.z * sinAngle;
    w = Math.cos(angle / 2.0);
    quaternion0.set(x, y, z, w);

    //Rotate around X
    angle = 0.3;
    sinAngle = Math.sin(angle / 2.0);
    rotationAxis.set(1, 0, 0);
    x = rotationAxis.x * sinAngle;
    y = rotationAxis.y * sinAngle;
    z = rotationAxis.z * sinAngle;
    w = Math.cos(angle / 2.0);
    quaternion1.set(x, y, z, w);

    quaternion0.multiply(quaternion1);

    // Rotate around Z
    angle = 0.1;
    sinAngle = Math.sin(angle / 2.0);
    rotationAxis.set(0, 0, 1);
    x = rotationAxis.x * sinAngle;
    y = rotationAxis.y * sinAngle;
    z = rotationAxis.z * sinAngle;
    w = Math.cos(angle / 2.0);
    quaternion1.set(x, y, z, w);

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
      radius: { type: 'float', value: radius },
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
      vertexShader: grassVertexSource,
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
    this.hemiLight.color.setHSL(0.6, 1, 0.6);
    this.hemiLight.groundColor.setHSL(0.095, 1, 0.75);
    this.hemiLight.position.set(0, 20, 0);
    this.scene.add(this.hemiLight);

    this.dirLight.color.setHSL(0.1, 1, 0.95);
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
