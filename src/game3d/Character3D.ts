import * as THREE from 'three';
import { AnimationState } from '../types';

export class Character3D {
  public mesh: THREE.Group;
  public head: THREE.Group;
  public body: THREE.Group;
  public leftArm: THREE.Group;
  public rightArm: THREE.Group;
  public leftLeg: THREE.Group;
  public rightLeg: THREE.Group;
  public compassMesh: THREE.Mesh;
  public backpack: THREE.Mesh;

  private animTime: number = 0;
  public currentAnim: AnimationState = 'IDLE';

  constructor() {
    this.mesh = new THREE.Group();
    this.mesh.name = 'PlayerCharacter';

    // Stylized materials
    const skinMat = new THREE.MeshLambertMaterial({ color: 0xffd1a4 });
    const hairMat = new THREE.MeshLambertMaterial({ color: 0x3d2314 });
    const hatMat = new THREE.MeshLambertMaterial({ color: 0x8b5a2b });
    const hatBandMat = new THREE.MeshLambertMaterial({ color: 0xd4af37 });
    const jacketMat = new THREE.MeshLambertMaterial({ color: 0xb5835a });
    const pantsMat = new THREE.MeshLambertMaterial({ color: 0x2b3a4a });
    const bootsMat = new THREE.MeshLambertMaterial({ color: 0x3e2723 });
    const backpackMat = new THREE.MeshLambertMaterial({ color: 0x5c3a21 });
    const compassMat = new THREE.MeshStandardMaterial({ 
      color: 0xffd700, 
      metalness: 0.8, 
      roughness: 0.2, 
      emissive: 0x332200 
    });

    // Body (Torso)
    this.body = new THREE.Group();
    const torsoGeo = new THREE.BoxGeometry(0.55, 0.7, 0.35);
    const torsoMesh = new THREE.Mesh(torsoGeo, jacketMat);
    torsoMesh.castShadow = true;
    torsoMesh.position.y = 1.05;
    this.body.add(torsoMesh);

    // Collar detail
    const collarGeo = new THREE.BoxGeometry(0.3, 0.15, 0.36);
    const collarMesh = new THREE.Mesh(collarGeo, jacketMat);
    collarMesh.position.set(0, 1.4, 0);
    this.body.add(collarMesh);

    // Backpack
    const packGeo = new THREE.BoxGeometry(0.42, 0.5, 0.22);
    this.backpack = new THREE.Mesh(packGeo, backpackMat);
    this.backpack.castShadow = true;
    this.backpack.position.set(0, 1.05, -0.25);
    this.body.add(this.backpack);

    // Head Group
    this.head = new THREE.Group();
    this.head.position.set(0, 1.55, 0);

    const headGeo = new THREE.BoxGeometry(0.38, 0.38, 0.38);
    const headMesh = new THREE.Mesh(headGeo, skinMat);
    headMesh.castShadow = true;
    this.head.add(headMesh);

    // Hair
    const hairGeo = new THREE.BoxGeometry(0.4, 0.18, 0.4);
    const hairMesh = new THREE.Mesh(hairGeo, hairMat);
    hairMesh.position.set(0, 0.14, -0.02);
    this.head.add(hairMesh);

    // Stylized Adventurer Hat
    const hatBrimGeo = new THREE.CylinderGeometry(0.42, 0.44, 0.05, 12);
    const hatBrim = new THREE.Mesh(hatBrimGeo, hatMat);
    hatBrim.position.set(0, 0.22, 0);
    this.head.add(hatBrim);

    const hatCrownGeo = new THREE.CylinderGeometry(0.24, 0.28, 0.26, 12);
    const hatCrown = new THREE.Mesh(hatCrownGeo, hatMat);
    hatCrown.position.set(0, 0.36, 0);
    this.head.add(hatCrown);

    const hatBandGeo = new THREE.CylinderGeometry(0.285, 0.285, 0.06, 12);
    const hatBand = new THREE.Mesh(hatBandGeo, hatBandMat);
    hatBand.position.set(0, 0.27, 0);
    this.head.add(hatBand);

    // Eyes
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
    const eyeGeo = new THREE.BoxGeometry(0.06, 0.06, 0.02);
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.1, 0.02, 0.2);
    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.1, 0.02, 0.2);
    this.head.add(leftEye, rightEye);

    this.body.add(this.head);

    // Left Arm
    this.leftArm = new THREE.Group();
    this.leftArm.position.set(-0.38, 1.35, 0);
    const armGeo = new THREE.BoxGeometry(0.18, 0.6, 0.18);
    const leftArmMesh = new THREE.Mesh(armGeo, jacketMat);
    leftArmMesh.position.y = -0.25;
    leftArmMesh.castShadow = true;
    this.leftArm.add(leftArmMesh);

    // Left Hand holding Chronicle Compass
    const handGeo = new THREE.BoxGeometry(0.14, 0.14, 0.14);
    const leftHand = new THREE.Mesh(handGeo, skinMat);
    leftHand.position.y = -0.58;
    this.leftArm.add(leftHand);

    // The Chronicle Compass!
    const compassGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.04, 16);
    this.compassMesh = new THREE.Mesh(compassGeo, compassMat);
    this.compassMesh.rotation.x = Math.PI / 4;
    this.compassMesh.position.set(0, -0.06, 0.12);
    leftHand.add(this.compassMesh);

    // Compass glowing crystal center
    const crystalGeo = new THREE.SphereGeometry(0.05, 8, 8);
    const crystalMat = new THREE.MeshBasicMaterial({ color: 0x00f5d4 });
    const crystal = new THREE.Mesh(crystalGeo, crystalMat);
    crystal.position.y = 0.03;
    this.compassMesh.add(crystal);

    // Right Arm
    this.rightArm = new THREE.Group();
    this.rightArm.position.set(0.38, 1.35, 0);
    const rightArmMesh = new THREE.Mesh(armGeo, jacketMat);
    rightArmMesh.position.y = -0.25;
    rightArmMesh.castShadow = true;
    this.rightArm.add(rightArmMesh);

    const rightHand = new THREE.Mesh(handGeo, skinMat);
    rightHand.position.y = -0.58;
    this.rightArm.add(rightHand);

    this.body.add(this.leftArm, this.rightArm);

    // Left Leg
    this.leftLeg = new THREE.Group();
    this.leftLeg.position.set(-0.16, 0.7, 0);
    const legGeo = new THREE.BoxGeometry(0.2, 0.55, 0.2);
    const leftLegMesh = new THREE.Mesh(legGeo, pantsMat);
    leftLegMesh.position.y = -0.25;
    leftLegMesh.castShadow = true;
    this.leftLeg.add(leftLegMesh);

    const bootGeo = new THREE.BoxGeometry(0.22, 0.22, 0.28);
    const leftBoot = new THREE.Mesh(bootGeo, bootsMat);
    leftBoot.position.set(0, -0.52, 0.03);
    this.leftLeg.add(leftBoot);

    // Right Leg
    this.rightLeg = new THREE.Group();
    this.rightLeg.position.set(0.16, 0.7, 0);
    const rightLegMesh = new THREE.Mesh(legGeo, pantsMat);
    rightLegMesh.position.y = -0.25;
    rightLegMesh.castShadow = true;
    this.rightLeg.add(rightLegMesh);

    const rightBoot = new THREE.Mesh(bootGeo, bootsMat);
    rightBoot.position.set(0, -0.52, 0.03);
    this.rightLeg.add(rightBoot);

    this.mesh.add(this.body);
    this.mesh.add(this.leftLeg, this.rightLeg);
  }

  public updateAnimation(state: AnimationState, delta: number) {
    this.currentAnim = state;
    this.animTime += delta;

    // Reset base rotations
    if (state === 'IDLE') {
      const breath = Math.sin(this.animTime * 2.5) * 0.02;
      this.body.position.y = breath;
      this.head.rotation.y = Math.sin(this.animTime * 1.2) * 0.05;
      this.leftArm.rotation.x = Math.sin(this.animTime * 2.5) * 0.05 + 0.1;
      this.rightArm.rotation.x = -Math.sin(this.animTime * 2.5) * 0.05;
      this.leftLeg.rotation.x = 0;
      this.rightLeg.rotation.x = 0;
      this.compassMesh.rotation.y += delta * 1.5;
    } else if (state === 'WALK') {
      const speed = 8;
      const swing = Math.sin(this.animTime * speed);
      this.leftLeg.rotation.x = swing * 0.6;
      this.rightLeg.rotation.x = -swing * 0.6;
      this.leftArm.rotation.x = -swing * 0.5 + 0.2;
      this.rightArm.rotation.x = swing * 0.5;
      this.body.position.y = Math.abs(Math.sin(this.animTime * speed)) * 0.08;
      this.compassMesh.rotation.y += delta * 3;
    } else if (state === 'RUN') {
      const speed = 14;
      const swing = Math.sin(this.animTime * speed);
      this.leftLeg.rotation.x = swing * 0.95;
      this.rightLeg.rotation.x = -swing * 0.95;
      this.leftArm.rotation.x = -swing * 0.8 + 0.4;
      this.rightArm.rotation.x = swing * 0.8;
      this.body.position.y = Math.abs(Math.sin(this.animTime * speed)) * 0.14;
      this.body.rotation.x = 0.15; // Lean forward
      this.compassMesh.rotation.y += delta * 6;
    } else if (state === 'JUMP') {
      this.leftLeg.rotation.x = -0.4;
      this.rightLeg.rotation.x = 0.3;
      this.leftArm.rotation.x = -0.8;
      this.rightArm.rotation.x = -0.8;
      this.body.rotation.x = -0.05;
    }
  }
}
