import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { A, W, D, S } from './control.model';

export class CharacterControls {
  walkDirection = new THREE.Vector3();
  rotateAngle = new THREE.Vector3(0, 1, 0);
  rotateQuaternion: THREE.Quaternion = new THREE.Quaternion();

  constructor(
    private model: THREE.Group,
    private orbitControl: OrbitControls,
    private camera: THREE.Camera
  ) {}

  update(
    delta: number,
    keysPressed: { [key: string]: boolean },
    speed: number,
    grassMaterial: THREE.RawShaderMaterial,
    groundShader: THREE.Shader
  ) {
    const angleYCameraDirection = Math.atan2(
      this.camera.position.x - this.model.position.x,
      this.camera.position.z - this.model.position.z
    );

    const directionOffset = this.directionOffset(keysPressed);

    this.rotateQuaternion.setFromAxisAngle(
      this.rotateAngle,
      angleYCameraDirection + directionOffset
    );
    this.model.quaternion.rotateTowards(this.rotateQuaternion, 0.2);

    this.camera.getWorldDirection(this.walkDirection);
    this.walkDirection.y = 0;
    this.walkDirection.normalize();
    this.walkDirection.applyAxisAngle(this.rotateAngle, directionOffset);

    const moveX = -(this.walkDirection.x * speed * delta);
    const moveZ = -(this.walkDirection.z * speed * delta);

    groundShader.uniforms['posZ'].value += moveZ;
    grassMaterial.uniforms['posZ'].value += moveZ;

    groundShader.uniforms['posX'].value += moveX;
    grassMaterial.uniforms['posX'].value += moveX;
  }

  private directionOffset(keysPressed: { [key: string]: boolean }) {
    let directionOffset = Math.PI;

    if (keysPressed[W]) {
      if (keysPressed[A]) {
        directionOffset = -Math.PI / 4 - Math.PI / 2;
      } else if (keysPressed[D]) {
        directionOffset = Math.PI / 4 + Math.PI / 2;
      }
    } else if (keysPressed[S]) {
      if (keysPressed[A]) {
        directionOffset = -Math.PI / 4;
      } else if (keysPressed[D]) {
        directionOffset = Math.PI / 4;
      } else {
        directionOffset = 0;
      }
    } else if (keysPressed[A]) {
      directionOffset = -Math.PI / 2;
    } else if (keysPressed[D]) {
      directionOffset = Math.PI / 2;
    }

    return directionOffset;
  }
}
