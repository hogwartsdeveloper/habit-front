import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { GUI } from 'dat.gui';
import { Euler, Vector3 } from 'three';

@Injectable()
export class ThreeSupportService {
  gui: GUI;
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

  createGUI() {
    this.gui = new GUI();
  }

  createGUIFolder(
    name: string,
    vector: Vector3 | Euler | (Vector3 | Euler)[],
    min = -100,
    max = 100
  ) {
    const folder = this.gui.addFolder(name);

    if (Array.isArray(vector)) {
      vector.forEach((item) => {
        addFolder(item);
      });
      return;
    }

    addFolder(vector);
    function addFolder(item: Vector3 | Euler | Vector3[] | Euler[]) {
      folder.add(item, 'x', min, max);
      folder.add(item, 'y', min, max);
      folder.add(item, 'z', min, max);
    }
  }
}
