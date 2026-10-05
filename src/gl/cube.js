import * as THREE from 'three';
import gl from './renderer.js';
import { trackProgress } from './util.js';
import { PRODUCTS } from '../brand.js';

/**
 * Minimalist Premium Spice Representation
 * Replaces the old chaotic isometric factory with a sleek, 
 * elegant floating geometric scene representing the purity and 
 * quality of the spices.
 */
export class Cube {
  constructor(el, track) {
    this.el = el;
    this.track = track || el;
    this._current = -1;

    this.scene = new THREE.Scene();
    
    const aspect = window.innerWidth / window.innerHeight;
    const d = 4;
    this.camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 0.1, 100);
    this.camera.position.set(10, 8, 10);
    this.camera.lookAt(0, 0, 0);

    this.rig = new THREE.Group();
    this.scene.add(this.rig);

    this._buildLighting();
    this._buildCore();
    this._buildParticles();
    this._bindResize();
  }

  _bindResize() {
    this._onResize = () => {
      const aspect = window.innerWidth / window.innerHeight;
      const d = 4;
      this.camera.left = -d * aspect;
      this.camera.right = d * aspect;
      this.camera.top = d;
      this.camera.bottom = -d;
      this.camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', this._onResize);
  }

  dispose() {
    if (this._onResize) {
      window.removeEventListener('resize', this._onResize);
    }
  }

  _buildLighting() {
    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    
    this.mainLight = new THREE.DirectionalLight(0xffffff, 2.5);
    this.mainLight.position.set(5, 10, 7);
    
    const fillLight = new THREE.DirectionalLight(0x445588, 1.2);
    fillLight.position.set(-5, -2, -5);
    
    this.pointLight = new THREE.PointLight(0xf0a81e, 2, 10);
    this.pointLight.position.set(0, 0, 0);

    this.scene.add(ambient, this.mainLight, fillLight, this.pointLight);
  }

  _buildCore() {
    // Elegant floating gem
    const geo = new THREE.IcosahedronGeometry(1.5, 0);
    this.coreMat = new THREE.MeshPhysicalMaterial({
      color: 0xf0a81e,
      metalness: 0.2,
      roughness: 0.1,
      transmission: 0.9,
      ior: 1.5,
      thickness: 1.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1
    });
    
    this.core = new THREE.Mesh(geo, this.coreMat);
    
    // Wireframe cage around it for a constructed/precise feel
    const wireGeo = new THREE.IcosahedronGeometry(1.7, 0);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xf0a81e,
      wireframe: true,
      transparent: true,
      opacity: 0.15
    });
    this.cage = new THREE.Mesh(wireGeo, wireMat);

    this.rig.add(this.core, this.cage);
  }

  _buildParticles() {
    const count = 2000;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    const radii = new Float32Array(count);
    const basey = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const radius = 2.0 + Math.random() * 3.5;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 6;

      pos[i * 3] = Math.cos(theta) * radius;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = Math.sin(theta) * radius;

      phases[i] = Math.random() * Math.PI * 2;
      radii[i] = radius;
      basey[i] = y;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('phase', new THREE.BufferAttribute(phases, 1));
    geo.setAttribute('radius', new THREE.BufferAttribute(radii, 1));
    geo.setAttribute('basey', new THREE.BufferAttribute(basey, 1));

    this.particleMat = new THREE.PointsMaterial({
      color: 0xf0a81e,
      size: 0.04,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.particles = new THREE.Points(geo, this.particleMat);
    this.rig.add(this.particles);
  }

  update(dt, t) {
    const p = trackProgress ? trackProgress(this.track) : 0;
    const n = PRODUCTS.length;
    const scaled = THREE.MathUtils.clamp(p, 0, 0.9999) * n;
    const idx = Math.min(n - 1, Math.floor(scaled));

    // Handle color transitions
    if (idx !== this._current && PRODUCTS[idx]) {
      this._current = idx;
    }

    const targetColor = new THREE.Color(PRODUCTS[this._current]?.accent || 0xf0a81e);
    
    // Smooth lerp colors
    this.coreMat.color.lerp(targetColor, dt * 2);
    this.cage.material.color.lerp(targetColor, dt * 2);
    this.particleMat.color.lerp(targetColor, dt * 2);
    this.pointLight.color.lerp(targetColor, dt * 2);

    // Floating and rotating animation
    this.core.rotation.y = t * 0.3;
    this.core.rotation.x = t * 0.15;
    
    this.cage.rotation.y = -t * 0.1;
    this.cage.rotation.z = t * 0.05;

    const floatY = Math.sin(t * 1.5) * 0.2;
    this.core.position.y = floatY;
    this.cage.position.y = floatY;

    // Particle swirl
    this.particles.rotation.y = t * 0.2;
    
    const positions = this.particles.geometry.attributes.position.array;
    const phases = this.particles.geometry.attributes.phase.array;
    const radii = this.particles.geometry.attributes.radius.array;
    const basey = this.particles.geometry.attributes.basey.array;

    for (let i = 0; i < positions.length / 3; i++) {
      const phase = phases[i];
      // Gentle wavy motion around the base Y
      positions[i * 3 + 1] = basey[i] + Math.sin(t * 1.5 + phase) * 0.8;
    }
    this.particles.geometry.attributes.position.needsUpdate = true;

    // Subtle rig movement based on mouse
    const pointerX = (gl && gl.pointer) ? gl.pointer.x : 0;
    const pointerY = (gl && gl.pointer) ? gl.pointer.y : 0;
    
    this.rig.rotation.y = THREE.MathUtils.lerp(this.rig.rotation.y, pointerX * 0.15, dt * 3);
    this.rig.rotation.x = THREE.MathUtils.lerp(this.rig.rotation.x, pointerY * 0.15, dt * 3);
  }
}

export function createCube(el, track) {
  return gl.add(new Cube(el, track));
}
