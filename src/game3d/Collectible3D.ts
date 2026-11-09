import * as THREE from 'three';
import { CollectibleItem } from '../types';

export class Collectible3D {
  public static createCollectibleMesh(item: CollectibleItem): THREE.Group {
    const group = new THREE.Group();
    group.name = `Collectible_${item.id}`;
    group.position.set(item.position.x, item.position.y, item.position.z);

    // Glowing ground aura beacon
    const ringGeo = new THREE.RingGeometry(0.3, 0.45, 16);
    const ringMat = new THREE.MeshBasicMaterial({ 
      color: 0x06d6a0, 
      side: THREE.DoubleSide, 
      transparent: true, 
      opacity: 0.7 
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = -item.position.y + 0.05;
    group.add(ring);

    // Collectible Item Core
    const core = new THREE.Group();
    core.name = 'Core';

    if (item.category === 'ARTEFAK') {
      // Vintage Radio
      const boxGeo = new THREE.BoxGeometry(0.45, 0.3, 0.25);
      const boxMat = new THREE.MeshStandardMaterial({ color: 0x5c4033, roughness: 0.4 });
      const box = new THREE.Mesh(boxGeo, boxMat);
      box.castShadow = true;
      core.add(box);

      // Antenna
      const antGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.35, 6);
      const antMat = new THREE.MeshBasicMaterial({ color: 0xcccccc });
      const ant = new THREE.Mesh(antGeo, antMat);
      ant.position.set(0.15, 0.28, 0);
      ant.rotation.z = -0.2;
      core.add(ant);
    } else if (item.category === 'DOKUMEN') {
      // Rolled Parchment Scroll with Red Ribbon
      const scrollGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.5, 12);
      const scrollMat = new THREE.MeshStandardMaterial({ color: 0xf4ecd8 });
      const scroll = new THREE.Mesh(scrollGeo, scrollMat);
      scroll.rotation.z = Math.PI / 4;
      scroll.castShadow = true;
      core.add(scroll);

      // Ribbon
      const ribbonGeo = new THREE.CylinderGeometry(0.125, 0.125, 0.08, 12);
      const ribbonMat = new THREE.MeshBasicMaterial({ color: 0xd90429 });
      const ribbon = new THREE.Mesh(ribbonGeo, ribbonMat);
      ribbon.rotation.z = Math.PI / 4;
      core.add(ribbon);
    } else if (item.category === 'KOIN') {
      // Golden Relic Coin
      const coinGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.05, 16);
      const coinMat = new THREE.MeshStandardMaterial({ 
        color: 0xffd700, 
        metalness: 0.9, 
        roughness: 0.2, 
        emissive: 0x443300 
      });
      const coin = new THREE.Mesh(coinGeo, coinMat);
      coin.rotation.x = Math.PI / 3;
      coin.castShadow = true;
      core.add(coin);
    } else if (item.category === 'FOTO') {
      // Framed Photo
      const frameGeo = new THREE.BoxGeometry(0.42, 0.32, 0.04);
      const frameMat = new THREE.MeshStandardMaterial({ color: 0x8b5a2b });
      const frame = new THREE.Mesh(frameGeo, frameMat);
      frame.castShadow = true;

      const photoGeo = new THREE.PlaneGeometry(0.36, 0.26);
      const photoMat = new THREE.MeshBasicMaterial({ color: 0xdcd0b8 });
      const photo = new THREE.Mesh(photoGeo, photoMat);
      photo.position.z = 0.025;
      frame.add(photo);
      core.add(frame);
    } else {
      // Leather Pouch / Secret message
      const pouchGeo = new THREE.DodecahedronGeometry(0.22);
      const pouchMat = new THREE.MeshStandardMaterial({ color: 0x7b3f00 });
      const pouch = new THREE.Mesh(pouchGeo, pouchMat);
      pouch.castShadow = true;
      core.add(pouch);
    }

    // Sparkle diamond on top
    const gemGeo = new THREE.OctahedronGeometry(0.12);
    const gemMat = new THREE.MeshBasicMaterial({ color: 0x06d6a0 });
    const gem = new THREE.Mesh(gemGeo, gemMat);
    gem.position.y = 0.38;
    core.add(gem);

    group.add(core);
    return group;
  }
}
