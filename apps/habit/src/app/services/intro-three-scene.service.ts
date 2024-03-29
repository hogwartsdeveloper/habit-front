import { Injectable } from '@angular/core';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { TessellateModifier } from 'three/examples/jsm/modifiers/TessellateModifier';
import { Font } from 'three/examples/jsm/loaders/FontLoader';
import * as THREE from 'three';

import { ThreeSupportService } from './three-support.service';
import vertexShader from '../utils/shaders/intro-text-vertex.glsl';
import fragmentShader from '../utils/shaders/intro-text-fragment.glsl';

@Injectable()
export class IntroThreeSceneService {
  constructor(private threeSupportService: ThreeSupportService) {}

  createIntroText(font: Font) {
    function createGeometry(text: string) {
      let geometry = new TextGeometry(text, {
        font,
        size: 9,
        height: 0,
        curveSegments: 3,
        bevelThickness: 2,
        bevelSize: 1,
        bevelEnabled: true,
      });

      const tessellateModifier = new TessellateModifier(8, 6);
      geometry = tessellateModifier.modify(geometry);

      return geometry;
    }
    let geometry = createGeometry('Мотивация первый шаг');

    const numFaces = geometry.attributes['position'].count / 3;

    const colors = new Float32Array(numFaces * 3 * 3);
    const displacement = new Float32Array(numFaces * 3 * 3);

    const color = new THREE.Color(0xffffff);

    for (let f = 0; f < numFaces; f++) {
      const index = 9 * f;

      const d = 10 * (0.5 - Math.random());

      for (let i = 0; i < 3; i++) {
        colors[index + 3 * i] = color.r;
        colors[index + 3 * i + 1] = color.g;
        colors[index + 3 * i + 2] = color.b;

        displacement[index + 3 * i] = d;
        displacement[index + 3 * i + 1] = d;
        displacement[index + 3 * i + 2] = d;
      }
    }

    geometry.setAttribute('customColor', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute(
      'displacement',
      new THREE.BufferAttribute(displacement, 3)
    );

    const material = new THREE.ShaderMaterial({
      uniforms: { amplitude: { value: 0.0 } },
      vertexShader,
      fragmentShader,
    });

    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(120, 5, 140);
    mesh.rotation.set(0, -3.15, 0);

    return {
      mesh,
      changeAmplitude: (value: number) => {
        material.uniforms['amplitude'].value = value;
      },
      changeText: (text: string) => {
        let newGeometry = createGeometry(text);

        newGeometry.setAttribute(
          'customColor',
          new THREE.BufferAttribute(colors, 3)
        );
        newGeometry.setAttribute(
          'displacement',
          new THREE.BufferAttribute(displacement, 3)
        );

        mesh.geometry = newGeometry;
      },
    };
  }
}
