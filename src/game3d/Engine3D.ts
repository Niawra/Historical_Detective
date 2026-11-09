import * as THREE from 'three';
import { Character3D } from './Character3D';
import { WorldBuilder } from './WorldBuilder';
import { NPCBuilder } from './NPCBuilder';
import { Collectible3D } from './Collectible3D';
import { 
  CharacterControlState, 
  AnimationState, 
  NPCEntity, 
  CollectibleItem 
} from '../types';
import { WORLD_01_NPCS, WORLD_01_COLLECTIBLES } from '../data/worldData';
import { sound } from '../utils/audio';

export interface NearbyTarget {
  id: string;
  type: 'NPC' | 'COLLECTIBLE' | 'CHEST';
  name: string;
  prompt: string;
  entityData?: unknown;
}

export class Engine3D {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  public player: Character3D;

  // Camera Orbit & Follow
  public cameraYaw: number = 0;
  public cameraPitch: number = 0.35; // Initial downward angle
  public cameraDistance: number = 6.5;
  private isMouseDown: boolean = false;
  private prevMouseX: number = 0;
  private prevMouseY: number = 0;

  // Player Physics & Movement
  public playerVelocity: THREE.Vector3 = new THREE.Vector3();
  public isGrounded: boolean = true;
  private gravity: number = -22;
  private jumpForce: number = 9.5;
  private walkSpeed: number = 5.5;
  private runSpeed: number = 9.8;
  public currentAnim: AnimationState = 'IDLE';

  // Controls state
  public controls: CharacterControlState = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
    sprint: false,
    interact: false
  };

  // World objects
  private npcMeshes: Map<string, THREE.Group> = new Map();
  private collectibleMeshes: Map<string, THREE.Group> = new Map();
  private particleSystem: THREE.Points | null = null;
  private waterMesh: THREE.Mesh | null = null;

  // Interactive targets
  public nearbyTarget: NearbyTarget | null = null;
  public onInteractCallback?: (target: NearbyTarget) => void;
  public onCollectCallback?: (item: CollectibleItem) => void;

  // Animation frame
  private reqId: number | null = null;
  private clock: THREE.Clock;
  private stepCooldown: number = 0;

  constructor(container: HTMLDivElement) {
    this.clock = new THREE.Clock();

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xa7c5eb); // Warm morning sky
    this.scene.fog = new THREE.FogExp2(0xa7c5eb, 0.012);

    // 2. Camera
    const aspect = container.clientWidth / container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(55, aspect, 0.1, 300);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    container.appendChild(this.renderer.domElement);

    // 4. Lights
    this.setupLighting();

    // 5. Build Environment
    WorldBuilder.buildWorld(this.scene);
    this.waterMesh = this.scene.getObjectByName('CitarumRiver') as THREE.Mesh;

    // 6. Spawn Player
    this.player = new Character3D();
    this.player.mesh.position.set(0, 0, 24); // Start on the southern path
    this.scene.add(this.player.mesh);

    // 7. Spawn NPCs
    this.spawnNPCs();

    // 8. Spawn Collectibles
    this.spawnCollectibles();

    // 9. Floating Leaf/Dust Particle System
    this.setupParticles();

    // 10. Bind Input & Listeners
    this.bindInputs(container);

    // 11. Start Loop
    this.animate = this.animate.bind(this);
    this.animate();
  }

  private setupLighting(): void {
    // Ambient light
    const ambientLight = new THREE.HemisphereLight(0xfffaed, 0x556b2f, 0.7);
    this.scene.add(ambientLight);

    // Warm Morning Sun (DirectionalLight)
    const sun = new THREE.DirectionalLight(0xfff3d6, 1.3);
    sun.position.set(40, 55, 30);
    sun.castShadow = true;
    sun.shadow.mapSize.width = 2048;
    sun.shadow.mapSize.height = 2048;
    sun.shadow.camera.near = 10;
    sun.shadow.camera.far = 130;
    const d = 45;
    sun.shadow.camera.left = -d;
    sun.shadow.camera.right = d;
    sun.shadow.camera.top = d;
    sun.shadow.camera.bottom = -d;
    sun.shadow.bias = -0.0005;
    this.scene.add(sun);
  }

  private spawnNPCs(): void {
    WORLD_01_NPCS.forEach(npc => {
      const mesh = NPCBuilder.createNPCMesh(npc);
      this.scene.add(mesh);
      this.npcMeshes.set(npc.id, mesh);
    });
  }

  private spawnCollectibles(): void {
    WORLD_01_COLLECTIBLES.forEach(item => {
      if (!item.isFound) {
        const mesh = Collectible3D.createCollectibleMesh(item);
        this.scene.add(mesh);
        this.collectibleMeshes.set(item.id, mesh);
      }
    });
  }

  private setupParticles(): void {
    const pCount = 200;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);

    for (let i = 0; i < pCount * 3; i += 3) {
      pPos[i] = (Math.random() - 0.5) * 80;
      pPos[i + 1] = Math.random() * 8 + 0.5;
      pPos[i + 2] = (Math.random() - 0.5) * 80;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));

    const pMat = new THREE.PointsMaterial({
      color: 0xffe6aa,
      size: 0.18,
      transparent: true,
      opacity: 0.65
    });

    this.particleSystem = new THREE.Points(pGeo, pMat);
    this.scene.add(this.particleSystem);
  }

  private bindInputs(container: HTMLDivElement): void {
    // Mouse orbit
    const onMouseDown = (e: MouseEvent) => {
      this.isMouseDown = true;
      this.prevMouseX = e.clientX;
      this.prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!this.isMouseDown) return;
      const dx = e.clientX - this.prevMouseX;
      const dy = e.clientY - this.prevMouseY;
      this.cameraYaw -= dx * 0.005;
      this.cameraPitch = Math.max(0.08, Math.min(1.2, this.cameraPitch + dy * 0.005));
      this.prevMouseX = e.clientX;
      this.prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
      this.isMouseDown = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      this.cameraDistance = Math.max(3.5, Math.min(12, this.cameraDistance + e.deltaY * 0.005));
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('wheel', onWheel, { passive: false });

    // Touch orbit for mobile
    let touchStartX = 0;
    let touchStartY = 0;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const dx = e.touches[0].clientX - touchStartX;
        const dy = e.touches[0].clientY - touchStartY;
        this.cameraYaw -= dx * 0.008;
        this.cameraPitch = Math.max(0.08, Math.min(1.2, this.cameraPitch + dy * 0.008));
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    };

    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchmove', onTouchMove, { passive: true });
  }

  public handleResize(width: number, height: number): void {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  public animate(): void {
    this.reqId = requestAnimationFrame(this.animate);
    const delta = Math.min(this.clock.getDelta(), 0.1);

    // 1. Update Player Physics & Movement
    this.updatePlayer(delta);

    // 2. Update Third-Person Camera
    this.updateCamera();

    // 3. Update Animations (NPCs, Collectibles, River, Particles)
    this.updateWorldAnimations(delta);

    // 4. Check Proximity to Interactions
    this.checkProximity();

    // 5. Render
    this.renderer.render(this.scene, this.camera);
  }

  private updatePlayer(delta: number): void {
    // Determine movement direction relative to camera yaw
    const moveZ = (this.controls.forward ? -1 : 0) + (this.controls.backward ? 1 : 0);
    const moveX = (this.controls.left ? -1 : 0) + (this.controls.right ? 1 : 0);
    const isMoving = moveX !== 0 || moveZ !== 0;

    let speed = this.controls.sprint ? this.runSpeed : this.walkSpeed;

    if (isMoving) {
      const inputAngle = Math.atan2(moveX, moveZ);
      const targetRotation = this.cameraYaw + inputAngle;

      // Smoothly rotate player toward movement direction
      const currentRotation = this.player.mesh.rotation.y;
      this.player.mesh.rotation.y = THREE.MathUtils.lerp(
        currentRotation,
        targetRotation,
        14 * delta
      );

      // Compute displacement vector
      const vx = Math.sin(targetRotation) * speed;
      const vz = Math.cos(targetRotation) * speed;

      const nextX = this.player.mesh.position.x + vx * delta;
      const nextZ = this.player.mesh.position.z + vz * delta;

      // Collision Check
      if (!WorldBuilder.checkCollision(nextX, this.player.mesh.position.z)) {
        this.player.mesh.position.x = nextX;
      }
      if (!WorldBuilder.checkCollision(this.player.mesh.position.x, nextZ)) {
        this.player.mesh.position.z = nextZ;
      }

      // Footstep sound
      this.stepCooldown += delta;
      const stepInterval = this.controls.sprint ? 0.28 : 0.42;
      if (this.stepCooldown > stepInterval && this.isGrounded) {
        sound.playFootstep('grass');
        this.stepCooldown = 0;
      }
    }

    // Jump & Gravity Physics
    if (this.controls.jump && this.isGrounded) {
      this.playerVelocity.y = this.jumpForce;
      this.isGrounded = false;
      sound.playJump();
    }

    // Apply gravity
    this.playerVelocity.y += this.gravity * delta;
    this.player.mesh.position.y += this.playerVelocity.y * delta;

    // Ground check (Base ground elevation ~0)
    const groundHeight = 0;
    if (this.player.mesh.position.y <= groundHeight) {
      this.player.mesh.position.y = groundHeight;
      this.playerVelocity.y = 0;
      this.isGrounded = true;
    }

    // Determine Animation State
    let animState: AnimationState = 'IDLE';
    if (!this.isGrounded) {
      animState = 'JUMP';
    } else if (isMoving) {
      animState = this.controls.sprint ? 'RUN' : 'WALK';
    }
    this.player.updateAnimation(animState, delta);
  }

  private updateCamera(): void {
    // Camera focuses on character's chest
    const targetPos = this.player.mesh.position.clone().add(new THREE.Vector3(0, 1.4, 0));

    // Spherical offset based on Yaw & Pitch
    const offsetX = Math.sin(this.cameraYaw) * Math.cos(this.cameraPitch) * this.cameraDistance;
    const offsetY = Math.sin(this.cameraPitch) * this.cameraDistance;
    const offsetZ = Math.cos(this.cameraYaw) * Math.cos(this.cameraPitch) * this.cameraDistance;

    const desiredCamPos = targetPos.clone().add(new THREE.Vector3(offsetX, offsetY, offsetZ));

    // Smooth camera lag
    this.camera.position.lerp(desiredCamPos, 0.15);
    this.camera.lookAt(targetPos);
  }

  private updateWorldAnimations(delta: number): void {
    const time = this.clock.getElapsedTime();

    // 1. Water ripple animation
    if (this.waterMesh) {
      const pos = (this.waterMesh.geometry as THREE.BufferGeometry).attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const u = pos.getX(i);
        pos.setZ(i, Math.sin(u * 0.3 + time * 2) * 0.15);
      }
      pos.needsUpdate = true;
    }

    // 2. Rotate Collectibles & bounce
    this.collectibleMeshes.forEach(mesh => {
      const core = mesh.getObjectByName('Core');
      if (core) {
        core.rotation.y += delta * 1.8;
        core.position.y = Math.sin(time * 3) * 0.12;
      }
    });

    // 3. Bob NPC indicator diamonds
    this.npcMeshes.forEach(mesh => {
      const ind = mesh.getObjectByName('IndicatorDiamond');
      if (ind) {
        ind.rotation.y += delta * 2;
        ind.position.y = Math.sin(time * 3.5) * 0.08;
      }
    });

    // 4. Drifting particles
    if (this.particleSystem) {
      const pPos = this.particleSystem.geometry.attributes.position;
      for (let i = 1; i < pPos.count * 3; i += 3) {
        pPos.array[i] -= delta * 0.3;
        if (pPos.array[i] < 0.2) pPos.array[i] = 8.5;
      }
      pPos.needsUpdate = true;
    }
  }

  private checkProximity(): void {
    const playerPos = this.player.mesh.position;
    let closestTarget: NearbyTarget | null = null;
    let minDistance = 3.6; // Max interaction distance

    // Check NPCs
    WORLD_01_NPCS.forEach(npc => {
      const dist = playerPos.distanceTo(new THREE.Vector3(npc.position.x, playerPos.y, npc.position.z));
      if (dist < minDistance) {
        minDistance = dist;
        closestTarget = {
          id: npc.id,
          type: 'NPC',
          name: npc.name,
          prompt: `Bicara dengan ${npc.name}`,
          entityData: npc
        };
      }
    });

    // Check Collectibles
    WORLD_01_COLLECTIBLES.forEach(item => {
      if (!item.isFound) {
        const dist = playerPos.distanceTo(new THREE.Vector3(item.position.x, playerPos.y, item.position.z));
        if (dist < minDistance) {
          minDistance = dist;
          closestTarget = {
            id: item.id,
            type: 'COLLECTIBLE',
            name: item.name,
            prompt: `Ambil Artefak: ${item.name}`,
            entityData: item
          };
        }
      }
    });

    // Check PETA Cipher Chest
    const chestPos = new THREE.Vector3(-25, playerPos.y, -1.8);
    const chestDist = playerPos.distanceTo(chestPos);
    if (chestDist < 3.2 && chestDist < minDistance) {
      closestTarget = {
        id: 'chest-peta',
        type: 'CHEST',
        name: 'Peti Sandi Telegraf PETA',
        prompt: 'Buka Peti Sandi Komando (1608)'
      };
    }

    this.nearbyTarget = closestTarget;
  }

  public removeCollectibleMesh(id: string): void {
    const mesh = this.collectibleMeshes.get(id);
    if (mesh) {
      this.scene.remove(mesh);
      this.collectibleMeshes.delete(id);
    }
  }

  public destroy(): void {
    if (this.reqId) cancelAnimationFrame(this.reqId);
    this.renderer.dispose();
  }
}
