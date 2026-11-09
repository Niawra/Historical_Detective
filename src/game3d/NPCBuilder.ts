import * as THREE from 'three';
import { NPCEntity } from '../types';

export class NPCBuilder {
  public static createNPCMesh(npc: NPCEntity): THREE.Group {
    const group = new THREE.Group();
    group.name = `NPC_${npc.id}`;
    group.position.set(npc.position.x, npc.position.y, npc.position.z);
    group.rotation.y = npc.rotationY;

    // Palette
    const skinMat = new THREE.MeshLambertMaterial({ color: 0xe8be9b });
    const peciMat = new THREE.MeshLambertMaterial({ color: 0x111111 });
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x111111 });

    let suitColor = 0x3d5a45; // default PETA olive green
    let pantsColor = 0x2e4233;
    let hasPeci = true;

    if (npc.modelStyle === 'soekarno') {
      suitColor = 0xf5f5f5; // White safari suit
      pantsColor = 0xf0f0f0;
      hasPeci = true;
    } else if (npc.modelStyle === 'hatta') {
      suitColor = 0xded2b9; // Cream linen suit
      pantsColor = 0xd2c4a9;
      hasPeci = false;
    } else if (npc.modelStyle === 'farmer') {
      suitColor = 0x5c4033; // Brown traditional shirt
      pantsColor = 0x222222;
      hasPeci = false;
    } else if (npc.modelStyle === 'diplomat') {
      suitColor = 0x222831; // Charcoal formal suit
      pantsColor = 0x1a1a24;
      hasPeci = false;
    }

    const suitMat = new THREE.MeshLambertMaterial({ color: suitColor });
    const pantsMat = new THREE.MeshLambertMaterial({ color: pantsColor });
    const shoesMat = new THREE.MeshLambertMaterial({ color: 0x1b1b1b });

    // Torso
    const torsoGeo = new THREE.BoxGeometry(0.55, 0.72, 0.35);
    const torso = new THREE.Mesh(torsoGeo, suitMat);
    torso.position.y = 1.05;
    torso.castShadow = true;
    group.add(torso);

    // Head
    const headGeo = new THREE.BoxGeometry(0.36, 0.38, 0.36);
    const head = new THREE.Mesh(headGeo, skinMat);
    head.position.y = 1.55;
    head.castShadow = true;
    group.add(head);

    // Eyes
    const eyeGeo = new THREE.BoxGeometry(0.06, 0.06, 0.02);
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.09, 1.56, 0.19);
    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.09, 1.56, 0.19);
    group.add(leftEye, rightEye);

    // Headwear
    if (hasPeci) {
      // Iconic Indonesian Peci (Songkok)
      const peciGeo = new THREE.BoxGeometry(0.38, 0.22, 0.38);
      const peci = new THREE.Mesh(peciGeo, peciMat);
      peci.position.set(0, 1.76, 0);
      group.add(peci);
    } else if (npc.modelStyle === 'farmer') {
      // Conical Straw Hat (Caping)
      const capingGeo = new THREE.ConeGeometry(0.48, 0.22, 16);
      const capingMat = new THREE.MeshLambertMaterial({ color: 0xd4a373 });
      const caping = new THREE.Mesh(capingGeo, capingMat);
      caping.position.set(0, 1.82, 0);
      group.add(caping);
    } else if (npc.modelStyle === 'hatta') {
      // Hatta's round spectacles!
      const specMat = new THREE.MeshBasicMaterial({ color: 0x333333 });
      const specGeo = new THREE.RingGeometry(0.04, 0.06, 12);
      const leftSpec = new THREE.Mesh(specGeo, specMat);
      leftSpec.position.set(-0.09, 1.56, 0.195);
      const rightSpec = new THREE.Mesh(specGeo, specMat);
      rightSpec.position.set(0.09, 1.56, 0.195);
      group.add(leftSpec, rightSpec);
    } else if (npc.modelStyle === 'diplomat') {
      // Diplomat Fedora
      const fedoraGeo = new THREE.CylinderGeometry(0.24, 0.38, 0.16, 12);
      const fedoraMat = new THREE.MeshLambertMaterial({ color: 0x333333 });
      const fedora = new THREE.Mesh(fedoraGeo, fedoraMat);
      fedora.position.set(0, 1.78, 0);
      group.add(fedora);
    }

    // Arms
    const armGeo = new THREE.BoxGeometry(0.18, 0.6, 0.18);
    const leftArm = new THREE.Mesh(armGeo, suitMat);
    leftArm.position.set(-0.36, 1.1, 0);
    leftArm.castShadow = true;
    const rightArm = new THREE.Mesh(armGeo, suitMat);
    rightArm.position.set(0.36, 1.1, 0);
    rightArm.castShadow = true;
    group.add(leftArm, rightArm);

    // Legs
    const legGeo = new THREE.BoxGeometry(0.2, 0.65, 0.2);
    const leftLeg = new THREE.Mesh(legGeo, pantsMat);
    leftLeg.position.set(-0.15, 0.45, 0);
    leftLeg.castShadow = true;
    const rightLeg = new THREE.Mesh(legGeo, pantsMat);
    rightLeg.position.set(0.15, 0.45, 0);
    rightLeg.castShadow = true;
    group.add(leftLeg, rightLeg);

    // Shoes
    const shoeGeo = new THREE.BoxGeometry(0.22, 0.16, 0.28);
    const leftShoe = new THREE.Mesh(shoeGeo, shoesMat);
    leftShoe.position.set(-0.15, 0.08, 0.04);
    const rightShoe = new THREE.Mesh(shoeGeo, shoesMat);
    rightShoe.position.set(0.15, 0.08, 0.04);
    group.add(leftShoe, rightShoe);

    // Floating Interactive Indicator (`!`)
    const indicatorGroup = new THREE.Group();
    indicatorGroup.name = 'IndicatorGroup';
    indicatorGroup.position.set(0, 2.3, 0);

    const diamondGeo = new THREE.OctahedronGeometry(0.18);
    const diamondMat = new THREE.MeshBasicMaterial({ color: 0xffd166 });
    const diamond = new THREE.Mesh(diamondGeo, diamondMat);
    diamond.name = 'IndicatorDiamond';
    indicatorGroup.add(diamond);

    group.add(indicatorGroup);

    return group;
  }
}
