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

export type ActionKeyType = 'INTERACT' | 'JOURNAL' | 'MAP' | 'SETTINGS' | 'TOGGLE_DEBUG';

export class Engine3D {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  public player: Character3D;

  // Camera Orbit & Follow
  public cameraYaw: number = 0;
  public cameraPitch: number = 0.38; // Elevated downward angle (~22 deg)
  public cameraDistance: number = 7.2;
  private isMouseDown: boolean = false;
  private prevMouseX: number = 0;
  private prevMouseY: number = 0;

  // Player Physics & Movement
  public playerVelocity: THREE.Vector3 = new THREE.Vector3();
  public isGrounded: boolean = true;
  private gravity: number = -24;
  private jumpForce: number = 7.8;
  private walkSpeed: number = 5.2;
  private runSpeed: number = 9.2;
  public currentAnim: AnimationState = 'IDLE';

  // Controls state
  private pressedKeys: Set<string> = new Set<string>();
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

  // Interactive targets & priority
  public activeTargetId: string | null = 'npc-singgih';
  public nearbyTarget: NearbyTarget | null = null;
  public onInteractCallback?: (target: NearbyTarget) => void;
  public onCollectCallback?: (item: CollectibleItem) => void;
  public onActionKey?: (action: ActionKeyType) => void;

  // Animation frame
  private reqId: number | null = null;
  private clock: THREE.Clock;
  private stepCooldown: number = 0;

  // Cleanup listeners reference
  private cleanupListeners: (() => void)[] = [];
  private containerElement: HTMLDivElement;

  constructor(container: HTMLDivElement) {
    this.containerElement = container;
    this.clock = new THREE.Clock();

    // Clean container first to prevent duplicate canvases
    container.innerHTML = '';
    container.tabIndex = 0;
    container.style.outline = 'none';

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x9fc3e8); // Vibrant tropical morning sky
    this.scene.fog = new THREE.FogExp2(0x9fc3e8, 0.009);

    // 2. Camera
    const width = Math.max(container.clientWidth, 320);
    const height = Math.max(container.clientHeight, 240);
    const aspect = width / height;
    this.camera = new THREE.PerspectiveCamera(54, aspect, 0.1, 350);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.08;
    container.appendChild(this.renderer.domElement);

    // Auto-focus container so keyboard is immediately active
    setTimeout(() => {
      try { container.focus(); } catch { /* ignore */ }
    }, 50);

    // 4. Lights
    this.setupLighting();

    // 5. Build Environment
    WorldBuilder.buildWorld(this.scene);
    this.waterMesh = this.scene.getObjectByName('CitarumRiver') as THREE.Mesh;

    // 6. Spawn Player
    this.player = new Character3D();
    this.player.mesh.position.set(0, 0, 24);
    this.player.mesh.rotation.y = Math.PI; // Face north
    this.scene.add(this.player.mesh);

    // 7. Spawn NPCs
    this.spawnNPCs();

    // 8. Spawn Collectibles
    this.spawnCollectibles();

    // 9. Floating Leaf/Dust Particle System
    this.setupParticles();

    // 10. Bind Input & Listeners (Mouse, Touch, Keyboard)
    this.bindInputs(container);

    // 11. Start Loop
    this.animate = this.animate.bind(this);
    this.animate();
  }

  private setupLighting(): void {
    const hemiLight = new THREE.HemisphereLight(0xfffaee, 0x4f772d, 0.75);
    this.scene.add(hemiLight);

    const sun = new THREE.DirectionalLight(0xfff2d4, 1.35);
    sun.position.set(45, 60, 35);
    sun.castShadow = true;
    sun.shadow.mapSize.width = 2048;
    sun.shadow.mapSize.height = 2048;
    sun.shadow.camera.near = 10;
    sun.shadow.camera.far = 140;
    const d = 48;
    sun.shadow.camera.left = -d;
    sun.shadow.camera.right = d;
    sun.shadow.camera.top = d;
    sun.shadow.camera.bottom = -d;
    sun.shadow.bias = -0.0004;
    this.scene.add(sun);
  }

  private spawnNPCs(): void {
    WORLD_01_NPCS.forEach(npc => {
      const terrainY = WorldBuilder.getTerrainHeight(npc.position.x, npc.position.z);
      const effectiveY = Math.max(npc.position.y, terrainY);
      const entity: NPCEntity = {
        ...npc,
        position: { ...npc.position, y: effectiveY }
      };
      const mesh = NPCBuilder.createNPCMesh(entity);
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
    const pCount = 180;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);

    for (let i = 0; i < pCount * 3; i += 3) {
      pPos[i] = (Math.random() - 0.5) * 85;
      pPos[i + 1] = Math.random() * 8 + 0.5;
      pPos[i + 2] = (Math.random() - 0.5) * 85;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));

    const pMat = new THREE.PointsMaterial({
      color: 0xffe8aa,
      size: 0.16,
      transparent: true,
      opacity: 0.6
    });

    this.particleSystem = new THREE.Points(pGeo, pMat);
    this.scene.add(this.particleSystem);
  }

  private bindInputs(container: HTMLDivElement): void {
    // 1. Mouse Orbit Drag
    const onMouseDown = (e: MouseEvent) => {
      this.isMouseDown = true;
      this.prevMouseX = e.clientX;
      this.prevMouseY = e.clientY;
      container.focus();
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!this.isMouseDown) return;
      const dx = e.clientX - this.prevMouseX;
      const dy = e.clientY - this.prevMouseY;
      this.cameraYaw -= dx * 0.005;
      this.cameraPitch = Math.max(0.18, Math.min(0.85, this.cameraPitch + dy * 0.005));
      this.prevMouseX = e.clientX;
      this.prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
      this.isMouseDown = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      this.cameraDistance = Math.max(4.5, Math.min(11, this.cameraDistance + e.deltaY * 0.005));
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('wheel', onWheel, { passive: false });

    this.cleanupListeners.push(() => {
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('wheel', onWheel);
    });

    // 2. Touch Orbit for Mobile
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
        this.cameraYaw -= dx * 0.007;
        this.cameraPitch = Math.max(0.18, Math.min(0.85, this.cameraPitch + dy * 0.007));
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    };

    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchmove', onTouchMove, { passive: true });

    this.cleanupListeners.push(() => {
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
    });

    // 3. Direct Keyboard Input Handlers with Full Code & Key Support and Multi-Key Tracking
    const updateControlsFromPressedKeys = () => {
      this.controls.forward = 
        this.pressedKeys.has('KeyW') || 
        this.pressedKeys.has('ArrowUp') || 
        this.pressedKeys.has('w') || 
        this.pressedKeys.has('arrowup') || 
        this.pressedKeys.has('up');

      this.controls.backward = 
        this.pressedKeys.has('KeyS') || 
        this.pressedKeys.has('ArrowDown') || 
        this.pressedKeys.has('s') || 
        this.pressedKeys.has('arrowdown') || 
        this.pressedKeys.has('down');

      this.controls.left = 
        this.pressedKeys.has('KeyA') || 
        this.pressedKeys.has('ArrowLeft') || 
        this.pressedKeys.has('a') || 
        this.pressedKeys.has('arrowleft') || 
        this.pressedKeys.has('left');

      this.controls.right = 
        this.pressedKeys.has('KeyD') || 
        this.pressedKeys.has('ArrowRight') || 
        this.pressedKeys.has('d') || 
        this.pressedKeys.has('arrowright') || 
        this.pressedKeys.has('right');

      this.controls.jump = 
        this.pressedKeys.has('Space') || 
        this.pressedKeys.has(' ') || 
        this.pressedKeys.has('spacebar');

      this.controls.sprint = 
        this.pressedKeys.has('ShiftLeft') || 
        this.pressedKeys.has('ShiftRight') || 
        this.pressedKeys.has('shift');
    };

    const handleKey = (e: KeyboardEvent, isDown: boolean) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      const code = e.code;
      const key = e.key ? e.key.toLowerCase() : '';

      if (isDown) {
        if (code) this.pressedKeys.add(code);
        if (key) this.pressedKeys.add(key);
      } else {
        if (code) this.pressedKeys.delete(code);
        if (key) this.pressedKeys.delete(key);
      }

      updateControlsFromPressedKeys();

      // Action shortcuts on KeyDown only
      if (isDown) {
        if (code === 'KeyE' || key === 'e' || key === 'enter') {
          this.onActionKey?.('INTERACT');
        } else if (code === 'Tab' || key === 'tab' || code === 'KeyB' || key === 'b') {
          e.preventDefault();
          this.onActionKey?.('JOURNAL');
        } else if (code === 'KeyM' || key === 'm') {
          e.preventDefault();
          this.onActionKey?.('MAP');
        } else if (code === 'Escape' || key === 'escape') {
          this.onActionKey?.('SETTINGS');
        } else if (code === 'F3' || key === 'f3') {
          e.preventDefault();
          this.onActionKey?.('TOGGLE_DEBUG');
        }
      }

      const isMovementKey = code === 'Space' || code === 'ArrowUp' || code === 'ArrowDown' || code === 'ArrowLeft' || code === 'ArrowRight';
      if (isMovementKey) {
        e.preventDefault();
      }
    };

    const onKeyDown = (e: KeyboardEvent) => handleKey(e, true);
    const onKeyUp = (e: KeyboardEvent) => handleKey(e, false);

    // Reset controls when window loses focus or document is hidden
    const onBlur = () => {
      this.resetMovementInput();
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        this.resetMovementInput();
      }
    };

    window.addEventListener('keydown', onKeyDown, { capture: true });
    window.addEventListener('keyup', onKeyUp, { capture: true });
    window.addEventListener('blur', onBlur);
    document.addEventListener('visibilitychange', onVisibilityChange);

    this.cleanupListeners.push(() => {
      window.removeEventListener('keydown', onKeyDown, { capture: true });
      window.removeEventListener('keyup', onKeyUp, { capture: true });
      window.removeEventListener('blur', onBlur);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    });
  }

  public resetMovementInput(): void {
    this.pressedKeys.clear();
    this.controls.forward = false;
    this.controls.backward = false;
    this.controls.left = false;
    this.controls.right = false;
    this.controls.jump = false;
    this.controls.sprint = false;
    this.controls.interact = false;
    this.playerVelocity.x = 0;
    this.playerVelocity.z = 0;
  }

  public handleResize(width: number, height: number): void {
    if (width <= 0 || height <= 0) return;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  public setActiveQuestTarget(targetId: string | null): void {
    this.activeTargetId = targetId;
  }

  // Programmatic movement injection for virtual controls / buttons
  public setVirtualMovement(forward: boolean, backward: boolean, left: boolean, right: boolean): void {
    this.controls.forward = forward;
    this.controls.backward = backward;
    this.controls.left = left;
    this.controls.right = right;
  }

  public setVirtualJump(jump: boolean): void {
    this.controls.jump = jump;
  }

  public setVirtualSprint(sprint: boolean): void {
    this.controls.sprint = sprint;
  }

  public animate(): void {
    this.reqId = requestAnimationFrame(this.animate);
    const delta = Math.min(this.clock.getDelta(), 0.1);

    // 1. Update Player Physics & Movement
    this.updatePlayer(delta);

    // 2. Update Third-Person Camera with Smooth Follow & Ground Safety
    this.updateCamera();

    // 3. Update Animations (NPCs, Collectibles, River, Particles, Clouds)
    this.updateWorldAnimations(delta);

    // 4. Check Proximity & Facing Direction for Single High-Priority Interaction Target
    this.checkProximity();

    // 5. Render
    this.renderer.render(this.scene, this.camera);
  }

  private updatePlayer(delta: number): void {
    const moveZ = (this.controls.forward ? -1 : 0) + (this.controls.backward ? 1 : 0);
    const moveX = (this.controls.left ? -1 : 0) + (this.controls.right ? 1 : 0);
    const isMoving = moveX !== 0 || moveZ !== 0;

    const speed = this.controls.sprint ? this.runSpeed : this.walkSpeed;

    if (isMoving) {
      // Normalize diagonal vector to avoid diagonal speed boost
      const inputDir = new THREE.Vector2(moveX, moveZ).normalize();
      const inputAngle = Math.atan2(inputDir.x, inputDir.y);
      const targetRotation = this.cameraYaw + inputAngle;

      // Smoothly rotate player toward movement direction
      const currentRotation = this.player.mesh.rotation.y;
      this.player.mesh.rotation.y = THREE.MathUtils.lerp(
        currentRotation,
        targetRotation,
        15 * delta
      );

      // Compute displacement vector
      const vx = Math.sin(targetRotation) * speed;
      const vz = Math.cos(targetRotation) * speed;

      this.playerVelocity.x = vx;
      this.playerVelocity.z = vz;

      // Robust sliding collision with surface alignment
      const resolved = WorldBuilder.moveWithSliding(
        this.player.mesh.position.x,
        this.player.mesh.position.z,
        vx,
        vz,
        delta,
        0.45
      );
      this.player.mesh.position.x = resolved.x;
      this.player.mesh.position.z = resolved.z;

      // Footstep sound
      this.stepCooldown += delta;
      const stepInterval = this.controls.sprint ? 0.28 : 0.42;
      if (this.stepCooldown > stepInterval && this.isGrounded) {
        sound.playFootstep('grass');
        this.stepCooldown = 0;
      }
    } else {
      this.playerVelocity.x = 0;
      this.playerVelocity.z = 0;
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

    // Ground check based on actual terrain height at current (x, z)
    const groundHeight = WorldBuilder.getTerrainHeight(
      this.player.mesh.position.x, 
      this.player.mesh.position.z
    );

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
    this.currentAnim = animState;
    this.player.updateAnimation(animState, delta);
  }

  private updateCamera(): void {
    const targetPos = this.player.mesh.position.clone().add(new THREE.Vector3(0, 1.6, 0));

    const offsetX = Math.sin(this.cameraYaw) * Math.cos(this.cameraPitch) * this.cameraDistance;
    const offsetY = Math.sin(this.cameraPitch) * this.cameraDistance;
    const offsetZ = Math.cos(this.cameraYaw) * Math.cos(this.cameraPitch) * this.cameraDistance;

    const desiredCamPos = targetPos.clone().add(new THREE.Vector3(offsetX, offsetY, offsetZ));

    const terrainUnderCam = WorldBuilder.getTerrainHeight(desiredCamPos.x, desiredCamPos.z);
    if (desiredCamPos.y < terrainUnderCam + 0.6) {
      desiredCamPos.y = terrainUnderCam + 0.6;
    }

    this.camera.position.lerp(desiredCamPos, 0.16);
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

    // 3. NPC Idle Animations (Breathing, head turns, diamond beacons)
    this.npcMeshes.forEach(mesh => {
      const ind = mesh.getObjectByName('IndicatorDiamond');
      if (ind) {
        ind.rotation.y += delta * 2;
        ind.position.y = Math.sin(time * 3.5) * 0.08;
      }

      const head = mesh.getObjectByName('NPCHead');
      if (head) {
        head.rotation.y = Math.sin(time * 1.2) * 0.08;
      }

      const torso = mesh.getObjectByName('NPCTorso');
      if (torso) {
        torso.position.y = 1.05 + Math.sin(time * 2.2) * 0.015;
      }
    });

    // 4. Drifting Clouds
    this.scene.traverse(obj => {
      if (obj.name === 'Cloud') {
        obj.position.x += delta * 0.8;
        if (obj.position.x > 65) obj.position.x = -65;
      }
    });

    // 5. Drifting particles
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
    
    const playerFacing = new THREE.Vector3(
      Math.sin(this.player.mesh.rotation.y),
      0,
      Math.cos(this.player.mesh.rotation.y)
    );

    let bestTarget: NearbyTarget | null = null;
    let bestScore: number = 999;
    const maxInteractDist = 3.8;

    const evaluateCandidate = (
      id: string, 
      type: 'NPC' | 'COLLECTIBLE' | 'CHEST', 
      name: string, 
      prompt: string, 
      pos: THREE.Vector3,
      entityData?: unknown
    ) => {
      const toTarget = new THREE.Vector3(pos.x - playerPos.x, 0, pos.z - playerPos.z);
      const dist = toTarget.length();

      if (dist > maxInteractDist) return;

      toTarget.normalize();
      const dot = playerFacing.dot(toTarget);

      if (dot < 0.15 && dist > 1.6) return;

      let score = dist - (dot * 1.4);

      if (this.activeTargetId && id === this.activeTargetId) {
        score -= 3.5;
      }

      if (score < bestScore) {
        bestScore = score;
        bestTarget = { id, type, name, prompt, entityData };
      }
    };

    // 1. Check NPCs
    WORLD_01_NPCS.forEach(npc => {
      evaluateCandidate(
        npc.id,
        'NPC',
        npc.name,
        `Bicara dengan ${npc.name}`,
        new THREE.Vector3(npc.position.x, playerPos.y, npc.position.z),
        npc
      );
    });

    // 2. Check Collectibles
    WORLD_01_COLLECTIBLES.forEach(item => {
      if (!item.isFound) {
        evaluateCandidate(
          item.id,
          'COLLECTIBLE',
          item.name,
          `Ambil Artefak: ${item.name}`,
          new THREE.Vector3(item.position.x, playerPos.y, item.position.z),
          item
        );
      }
    });

    // 3. Check PETA Cipher Chest
    evaluateCandidate(
      'chest-peta',
      'CHEST',
      'Peti Sandi Telegraf PETA',
      'Buka Peti Sandi Komando (1608)',
      new THREE.Vector3(-23, playerPos.y, -0.2)
    );

    this.nearbyTarget = bestTarget;
  }

  // Real-time debug telemetry getter for on-screen debug panel
  public getDebugTelemetry() {
    const isMoving = this.controls.forward || this.controls.backward || this.controls.left || this.controls.right;
    return {
      keys: {
        W: this.controls.forward,
        A: this.controls.left,
        S: this.controls.backward,
        D: this.controls.right,
        SPACE: this.controls.jump,
        SHIFT: this.controls.sprint
      },
      pos: {
        x: parseFloat(this.player.mesh.position.x.toFixed(2)),
        y: parseFloat(this.player.mesh.position.y.toFixed(2)),
        z: parseFloat(this.player.mesh.position.z.toFixed(2))
      },
      velocity: {
        vx: parseFloat(this.playerVelocity.x.toFixed(2)),
        vy: parseFloat(this.playerVelocity.y.toFixed(2)),
        vz: parseFloat(this.playerVelocity.z.toFixed(2))
      },
      speed: this.controls.sprint ? this.runSpeed : this.walkSpeed,
      isGrounded: this.isGrounded,
      isMoving: isMoving,
      animState: this.currentAnim,
      collisionEnabled: WorldBuilder.enableCollision,
      cameraYaw: parseFloat(this.cameraYaw.toFixed(2)),
      cameraPitch: parseFloat(this.cameraPitch.toFixed(2)),
      cameraDist: parseFloat(this.cameraDistance.toFixed(2))
    };
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

    // Clean up all input event listeners
    this.cleanupListeners.forEach(cleanup => cleanup());
    this.cleanupListeners = [];

    // Remove canvas from DOM
    if (this.renderer.domElement && this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }

    this.renderer.dispose();
  }
}
