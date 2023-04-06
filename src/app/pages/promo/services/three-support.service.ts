import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable()
export class ThreeSupportService {
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
}
