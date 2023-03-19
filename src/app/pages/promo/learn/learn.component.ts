import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-learn',
  templateUrl: './learn.component.html',
  styleUrls: ['./learn.component.scss']
})
export class LearnComponent implements OnInit, AfterViewInit {
  @ViewChild('main') canvas: ElementRef<HTMLCanvasElement>
  ngOnInit() {}

  ngAfterViewInit() {
    const renderer = new THREE.WebGLRenderer({antialias: true, canvas: this.canvas.nativeElement});
    const camera = new THREE.PerspectiveCamera(75, 2, 0.1, 5);
    camera.position.z = 2;

    const scene = new THREE.Scene();
    const geometry = new THREE.BoxGeometry(1, 1, 1);

    const cubes = [
        this.makeInstance(geometry, 0x44aa88, 0, scene),
        this.makeInstance(geometry, 0x8844aa, -2, scene),
        this.makeInstance(geometry, 0xaa8844, 2, scene),
    ];

    const light = new THREE.DirectionalLight(0xFFFFFF, 1);
    light.position.set(-1, 2, 4);
    scene.add(light);


    function render(time: number) {
      time *= 0.001;
      cubes.forEach((cube, ndx) => {
        const speed = 1 + ndx * .1;
        const rot = time * speed;
        cube.rotation.x = rot;
        cube.rotation.y = rot;
      });

      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  }

  makeInstance(geometry: THREE.BoxGeometry, color: number, x: number, scene: THREE.Scene) {
    const material = new THREE.MeshPhongMaterial({ color });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    cube.position.x = x;

    return cube;
  }
}
