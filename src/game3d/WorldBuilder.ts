import * as THREE from 'three';

export interface CollisionBox {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

export class WorldBuilder {
  public static collisionBoxes: CollisionBox[] = [];
  public static enableCollision: boolean = true; // Debuggable collision toggle

  // Ground elevation query function for player and NPC grounding
  public static getTerrainHeight(x: number, z: number): number {
    // 1. Rumah Bojong Veranda Porch
    if (x >= -6.8 && x <= 6.8 && z >= -14.0 && z <= -5.5) {
      return 1.2; // Raised wooden veranda floor elevation
    }

    // 2. Wooden Dock over Kali Citarum
    if (x >= 0.5 && x <= 6.5 && z >= -38.5 && z <= -30.0) {
      return -0.2; // Dock platform level
    }

    // 3. Citarum River slope and water basin
    if (z < -32) {
      const depth = Math.max(-1.8, -0.9 - (Math.abs(z + 32) * 0.15));
      return depth;
    }

    // 4. Central Village Flat Exploration Area
    if (Math.abs(x) < 42 && z >= -32 && z <= 42) {
      return 0.0; // Perfectly flat, stable, solid village grounds
    }

    // 5. Outer perimeter gentle rolling hills
    const dist = Math.sqrt(x * x + z * z);
    if (dist > 42) {
      return Math.sin(x * 0.08) * Math.cos(z * 0.08) * 0.8;
    }

    return 0.0;
  }

  public static buildWorld(scene: THREE.Scene): void {
    this.collisionBoxes = [];

    // --- 1. TERRAIN & GROUND ---
    const terrainGeo = new THREE.PlaneGeometry(130, 130, 50, 50);
    terrainGeo.rotateX(-Math.PI / 2);

    const pos = terrainGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      pos.setY(i, this.getTerrainHeight(x, z));
    }
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshLambertMaterial({ 
      color: 0x5a9332, // Lush tropical meadow
      flatShading: true 
    });
    const terrain = new THREE.Mesh(terrainGeo, terrainMat);
    terrain.receiveShadow = true;
    scene.add(terrain);

    // --- 2. CITARUM RIVER ---
    const waterGeo = new THREE.PlaneGeometry(130, 32, 24, 12);
    waterGeo.rotateX(-Math.PI / 2);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x2288a8,
      roughness: 0.15,
      metalness: 0.25,
      transparent: true,
      opacity: 0.88
    });
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.position.set(0, -0.85, -45);
    water.name = 'CitarumRiver';
    scene.add(water);

    // River Sandy Shoreline
    const shoreGeo = new THREE.PlaneGeometry(130, 6);
    shoreGeo.rotateX(-Math.PI / 2);
    const shoreMat = new THREE.MeshStandardMaterial({ color: 0xd8c29d, roughness: 0.95 });
    const shore = new THREE.Mesh(shoreGeo, shoreMat);
    shore.position.set(0, -0.05, -31.5);
    shore.receiveShadow = true;
    scene.add(shore);

    // Wooden boat dock
    const dockGeo = new THREE.BoxGeometry(4.5, 0.4, 9.5);
    const woodMat = new THREE.MeshLambertMaterial({ color: 0x4a2e1b });
    const dock = new THREE.Mesh(dockGeo, woodMat);
    dock.position.set(3.5, -0.2, -34.5);
    dock.castShadow = true;
    dock.receiveShadow = true;
    scene.add(dock);

    // Dock support stilts in water
    [1.5, 5.5].forEach(dx => {
      [-37, -33].forEach(dz => {
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 2.2, 6), woodMat);
        post.position.set(dx, -1.0, dz);
        scene.add(post);
      });
    });

    // Sampan Boat at Dock
    const boatGeo = new THREE.BoxGeometry(2.2, 0.7, 5.8);
    const boatMat = new THREE.MeshLambertMaterial({ color: 0x7c4f24 });
    const boat = new THREE.Mesh(boatGeo, boatMat);
    boat.position.set(7.5, -0.65, -36.5);
    boat.rotation.y = 0.25;
    boat.castShadow = true;
    scene.add(boat);

    // River boulders along shoreline
    [-20, -10, 12, 22, 35].forEach((bx, idx) => {
      const rockGeo = new THREE.DodecahedronGeometry(0.7 + (idx % 3) * 0.25);
      const rockMat = new THREE.MeshLambertMaterial({ color: 0x6e757c, flatShading: true });
      const rock = new THREE.Mesh(rockGeo, rockMat);
      rock.position.set(bx, 0.1, -30.5 + (idx % 2) * 1.5);
      rock.rotation.set(0.3, idx, 0.2);
      rock.castShadow = true;
      rock.receiveShadow = true;
      scene.add(rock);
    });

    // --- 3. DIRT PATHS & VILLAGE TRAILS ---
    this.buildVillagePaths(scene);

    // --- 4. RUMAH SEJARAH DJIAW KIE SIONG ---
    this.buildRumahBojong(scene);

    // --- 5. POS PENJAGAAN & MENARA PETA ---
    this.buildPETAOutpost(scene);

    // --- 6. ADDITIONAL VILLAGE COTTAGES ---
    this.buildVillageCottages(scene);

    // --- 7. DIRECTIONAL SIGNPOST & LANDMARKS ---
    this.buildSignpostsAndBenches(scene);

    // --- 8. RICE PADDIES, BAMBOO & VEGETATION ---
    this.buildRicePaddies(scene);
    this.buildBambooGroves(scene);
    this.buildTreesAndFences(scene);

    // --- 9. STYLIZED DRIFTING CLOUDS ---
    this.buildClouds(scene);
  }

  private static buildVillagePaths(scene: THREE.Scene): void {
    const pathMat = new THREE.MeshStandardMaterial({ 
      color: 0xc8a27a, 
      roughness: 0.92 
    });

    // 1. South Village Entrance Road (Spawn Trail)
    const southRoadGeo = new THREE.PlaneGeometry(6.5, 34);
    southRoadGeo.rotateX(-Math.PI / 2);
    const southRoad = new THREE.Mesh(southRoadGeo, pathMat);
    southRoad.position.set(0, 0.02, 21);
    southRoad.receiveShadow = true;
    scene.add(southRoad);

    // 2. Central Village Crossroads Plaza
    const plazaGeo = new THREE.PlaneGeometry(12, 10);
    plazaGeo.rotateX(-Math.PI / 2);
    const plaza = new THREE.Mesh(plazaGeo, pathMat);
    plaza.position.set(0, 0.025, 0);
    plaza.receiveShadow = true;
    scene.add(plaza);

    // 3. North Trail to Rumah Bojong
    const northRoadGeo = new THREE.PlaneGeometry(6.5, 12);
    northRoadGeo.rotateX(-Math.PI / 2);
    const northRoad = new THREE.Mesh(northRoadGeo, pathMat);
    northRoad.position.set(0, 0.02, -8);
    northRoad.receiveShadow = true;
    scene.add(northRoad);

    // 4. West Trail to Pos Penjagaan PETA
    const westRoadGeo = new THREE.PlaneGeometry(24, 5.5);
    westRoadGeo.rotateX(-Math.PI / 2);
    const westRoad = new THREE.Mesh(westRoadGeo, pathMat);
    westRoad.position.set(-13, 0.02, -2.5);
    westRoad.receiveShadow = true;
    scene.add(westRoad);

    // 5. East Trail curving towards Sungai Citarum & Dock
    const eastRoadGeo = new THREE.PlaneGeometry(18, 5.0);
    eastRoadGeo.rotateX(-Math.PI / 2);
    const eastRoad = new THREE.Mesh(eastRoadGeo, pathMat);
    eastRoad.position.set(11, 0.02, -3.5);
    eastRoad.receiveShadow = true;
    scene.add(eastRoad);

    // Diagonal trail leading down to dock
    const dockTrailGeo = new THREE.PlaneGeometry(4.8, 26);
    dockTrailGeo.rotateX(-Math.PI / 2);
    const dockTrail = new THREE.Mesh(dockTrailGeo, pathMat);
    dockTrail.position.set(8.5, 0.02, -18);
    dockTrail.rotation.y = 0.22;
    dockTrail.receiveShadow = true;
    scene.add(dockTrail);
  }

  private static buildRumahBojong(scene: THREE.Scene): void {
    const houseGroup = new THREE.Group();
    houseGroup.position.set(0, 0, -12);

    const woodMat = new THREE.MeshLambertMaterial({ color: 0x4a2e1b });
    const bambooWallMat = new THREE.MeshLambertMaterial({ color: 0xcab577 });
    const roofMat = new THREE.MeshLambertMaterial({ color: 0x9e2a2b, flatShading: true });

    // 1. Raised Floor Platform (Elevation 1.2m at top surface)
    const floorGeo = new THREE.BoxGeometry(13.6, 0.8, 11.5);
    const floor = new THREE.Mesh(floorGeo, woodMat);
    floor.position.set(0, 0.8, 0.5);
    floor.castShadow = true;
    floor.receiveShadow = true;
    houseGroup.add(floor);

    // Foundation stilt pillars underneath
    [-6.0, -2.0, 2.0, 6.0].forEach(sx => {
      [-4.0, 0, 4.0].forEach(sz => {
        const stilt = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.8, 6), woodMat);
        stilt.position.set(sx, 0.4, sz);
        stilt.castShadow = true;
        houseGroup.add(stilt);
      });
    });

    // 2. Main Enclosed Room Walls
    const wallGeo = new THREE.BoxGeometry(13.0, 3.2, 6.5);
    const wall = new THREE.Mesh(wallGeo, bambooWallMat);
    wall.position.set(0, 2.8, -2.0);
    wall.castShadow = true;
    wall.receiveShadow = true;
    houseGroup.add(wall);

    // Windows & Wooden shutters
    [-4.0, 4.0].forEach(wx => {
      const windowFrame = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.2, 0.15), woodMat);
      windowFrame.position.set(wx, 3.0, 1.3);
      houseGroup.add(windowFrame);
    });

    // Doorway
    const doorFrame = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.4, 0.2), woodMat);
    doorFrame.position.set(0, 2.4, 1.3);
    houseGroup.add(doorFrame);

    // 3. Veranda (Front Porch where Soekarno & Hatta sit)
    const verandaRoofGeo = new THREE.BoxGeometry(13.8, 0.25, 4.8);
    const verandaRoof = new THREE.Mesh(verandaRoofGeo, woodMat);
    verandaRoof.position.set(0, 3.8, 3.8);
    verandaRoof.castShadow = true;
    houseGroup.add(verandaRoof);

    // Veranda Wooden Pillars
    [-6.2, -2.1, 2.1, 6.2].forEach(px => {
      const pillarGeo = new THREE.BoxGeometry(0.24, 2.6, 0.24);
      const pillar = new THREE.Mesh(pillarGeo, woodMat);
      pillar.position.set(px, 2.5, 5.8);
      pillar.castShadow = true;
      houseGroup.add(pillar);
    });

    // Veranda Chairs and Table
    const tableGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.65, 12);
    const table = new THREE.Mesh(tableGeo, woodMat);
    table.position.set(0.6, 1.55, 3.6);
    table.castShadow = true;
    houseGroup.add(table);

    // Two wooden armchairs
    [-1.2, 2.4].forEach(cx => {
      const chairSeat = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.1, 0.6), woodMat);
      chairSeat.position.set(cx, 1.45, 3.6);
      const chairBack = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 0.1), woodMat);
      chairBack.position.set(cx, 1.75, 3.3);
      chairSeat.castShadow = true;
      chairBack.castShadow = true;
      houseGroup.add(chairSeat, chairBack);
    });

    // Warm Lantern on table
    const lanternGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.28, 8);
    const lanternMat = new THREE.MeshBasicMaterial({ color: 0xffe066 });
    const lantern = new THREE.Mesh(lanternGeo, lanternMat);
    lantern.position.set(0.6, 2.05, 3.6);
    houseGroup.add(lantern);

    // Point Light from lantern
    const lanternLight = new THREE.PointLight(0xffb703, 1.6, 14);
    lanternLight.position.set(0.6, 2.3, 3.6);
    houseGroup.add(lanternLight);

    // 4. Veranda Front Steps (Stairs connecting ground 0.0 to veranda 1.2)
    const step1 = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.35, 1.4), woodMat);
    step1.position.set(0, 0.2, 6.8);
    const step2 = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.35, 1.4), woodMat);
    step2.position.set(0, 0.55, 6.2);
    const step3 = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.35, 1.4), woodMat);
    step3.position.set(0, 0.9, 5.6);
    step1.castShadow = true;
    step2.castShadow = true;
    step3.castShadow = true;
    step1.receiveShadow = true;
    step2.receiveShadow = true;
    step3.receiveShadow = true;
    houseGroup.add(step1, step2, step3);

    // 5. Main Traditional Limasan Roof
    const mainRoofGeo = new THREE.ConeGeometry(10.5, 4.0, 4);
    mainRoofGeo.rotateY(Math.PI / 4);
    const mainRoof = new THREE.Mesh(mainRoofGeo, roofMat);
    mainRoof.position.set(0, 5.8, -1.8);
    mainRoof.castShadow = true;
    houseGroup.add(mainRoof);

    scene.add(houseGroup);

    // House Wall Collision (player cannot walk inside enclosed room, veranda is accessible!)
    this.collisionBoxes.push({
      minX: -6.8,
      maxX: 6.8,
      minZ: -17.5,
      maxZ: -9.8
    });
  }

  private static buildPETAOutpost(scene: THREE.Scene): void {
    const petaGroup = new THREE.Group();
    petaGroup.position.set(-23, 0, -3);

    const woodMat = new THREE.MeshLambertMaterial({ color: 0x3d2817 });
    const roofMat = new THREE.MeshLambertMaterial({ color: 0x8b4513, flatShading: true });

    // Watchtower 4 wooden legs
    [-1.7, 1.7].forEach(tx => {
      [-1.7, 1.7].forEach(tz => {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.3, 7.5, 0.3), woodMat);
        leg.position.set(tx, 3.75, tz);
        leg.castShadow = true;
        petaGroup.add(leg);
      });
    });

    // Tower Observation Deck
    const deck = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.4, 4.4), woodMat);
    deck.position.set(0, 6.5, 0);
    deck.castShadow = true;
    petaGroup.add(deck);

    // Tower Roof
    const towerRoof = new THREE.Mesh(new THREE.ConeGeometry(3.6, 2.2, 4), roofMat);
    towerRoof.rotateY(Math.PI / 4);
    towerRoof.position.set(0, 8.2, 0);
    towerRoof.castShadow = true;
    petaGroup.add(towerRoof);

    // Flagpole & Indonesian Red-White Flag (Merah-Putih)
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 4.5, 8), new THREE.MeshBasicMaterial({ color: 0xf5f5f5 }));
    pole.position.set(0, 10.2, 0);
    petaGroup.add(pole);

    const flagRed = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.48), new THREE.MeshBasicMaterial({ color: 0xd90429, side: THREE.DoubleSide }));
    flagRed.position.set(0.8, 11.45, 0);
    const flagWhite = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.48), new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide }));
    flagWhite.position.set(0.8, 10.97, 0);
    petaGroup.add(flagRed, flagWhite);

    // Sandbag Bunkers
    const sandbagColor = new THREE.MeshLambertMaterial({ color: 0xa48e6c });
    [-3.8, 3.8].forEach(bx => {
      const bunker = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.85, 1.2), sandbagColor);
      bunker.position.set(bx, 0.42, 2.2);
      bunker.castShadow = true;
      petaGroup.add(bunker);
    });

    // Military Truck parked beside outpost
    const truckMat = new THREE.MeshLambertMaterial({ color: 0x2e4233 });
    const wheelMat = new THREE.MeshLambertMaterial({ color: 0x1a1a1a });
    const truckGroup = new THREE.Group();
    truckGroup.position.set(-8.5, 0, -1);
    truckGroup.rotation.y = 0.35;

    // Truck Cab
    const cab = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.1, 2.4), truckMat);
    cab.position.set(0, 1.4, 1.8);
    cab.castShadow = true;
    truckGroup.add(cab);

    // Truck Cargo Bed with Tan Canvas Canopy
    const bed = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.6, 4.5), new THREE.MeshLambertMaterial({ color: 0x786047 }));
    bed.position.set(0, 1.8, -1.8);
    bed.castShadow = true;
    truckGroup.add(bed);

    // Wheels
    [-1.2, 1.2].forEach(wx => {
      [-2.8, -0.8, 1.8].forEach(wz => {
        const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.4, 12), wheelMat);
        wheel.rotateZ(Math.PI / 2);
        wheel.position.set(wx, 0.5, wz);
        wheel.castShadow = true;
        truckGroup.add(wheel);
      });
    });

    petaGroup.add(truckGroup);

    // PETA Cipher Box on Crates
    const crate = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.9, 1.2), woodMat);
    crate.position.set(0, 0.45, 2.8);
    crate.castShadow = true;
    petaGroup.add(crate);

    const chest = new THREE.Mesh(
      new THREE.BoxGeometry(0.65, 0.38, 0.48), 
      new THREE.MeshStandardMaterial({ color: 0x6e260e, metalness: 0.5, roughness: 0.3 })
    );
    chest.name = 'Chest_PETACipher';
    chest.position.set(0, 1.1, 2.8);
    chest.castShadow = true;
    petaGroup.add(chest);

    scene.add(petaGroup);

    // Collision boxes for watchtower and truck
    this.collisionBoxes.push({
      minX: -25.5,
      maxX: -20.5,
      minZ: -5.5,
      maxZ: -0.5
    });
    this.collisionBoxes.push({
      minX: -34.5,
      maxX: -28.0,
      minZ: -6.0,
      maxZ: 2.0
    });
  }

  private static buildVillageCottages(scene: THREE.Scene): void {
    const woodMat = new THREE.MeshLambertMaterial({ color: 0x5a3d28 });
    const bambooMat = new THREE.MeshLambertMaterial({ color: 0xd4bc8b });
    const rumbiaMat = new THREE.MeshLambertMaterial({ color: 0x826644, flatShading: true });

    // Cottage 1: South-West Village Dwelling
    const c1 = new THREE.Group();
    c1.position.set(-18, 0, 18);

    const c1Base = new THREE.Mesh(new THREE.BoxGeometry(7.0, 0.6, 6.0), woodMat);
    c1Base.position.set(0, 0.3, 0);
    c1.add(c1Base);

    const c1Wall = new THREE.Mesh(new THREE.BoxGeometry(6.4, 2.5, 5.4), bambooMat);
    c1Wall.position.set(0, 1.8, 0);
    c1Wall.castShadow = true;
    c1.add(c1Wall);

    const c1Roof = new THREE.Mesh(new THREE.ConeGeometry(5.6, 2.6, 4), rumbiaMat);
    c1Roof.rotateY(Math.PI / 4);
    c1Roof.position.set(0, 4.0, 0);
    c1Roof.castShadow = true;
    c1.add(c1Roof);

    // Porch & firewood pile
    const firewood = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 1.4, 6), woodMat);
    firewood.rotateZ(Math.PI / 2);
    firewood.position.set(2.4, 0.3, 3.4);
    c1.add(firewood);

    scene.add(c1);

    this.collisionBoxes.push({
      minX: -22.0,
      maxX: -14.0,
      minZ: 14.5,
      maxZ: 21.5
    });

    // Cottage 2: South-East Village Dwelling
    const c2 = new THREE.Group();
    c2.position.set(19, 0, 10);

    const c2Base = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.6, 5.5), woodMat);
    c2Base.position.set(0, 0.3, 0);
    c2.add(c2Base);

    const c2Wall = new THREE.Mesh(new THREE.BoxGeometry(6.0, 2.4, 5.0), bambooMat);
    c2Wall.position.set(0, 1.8, 0);
    c2Wall.castShadow = true;
    c2.add(c2Wall);

    const c2Roof = new THREE.Mesh(new THREE.ConeGeometry(5.2, 2.4, 4), rumbiaMat);
    c2Roof.rotateY(Math.PI / 4);
    c2Roof.position.set(0, 3.8, 0);
    c2Roof.castShadow = true;
    c2.add(c2Roof);

    // Clay water pot (Gentong)
    const gentong = new THREE.Mesh(
      new THREE.CylinderGeometry(0.35, 0.25, 0.7, 10), 
      new THREE.MeshLambertMaterial({ color: 0x8d5b4c })
    );
    gentong.position.set(-2.4, 0.65, 3.0);
    c2.add(gentong);

    scene.add(c2);

    this.collisionBoxes.push({
      minX: 15.0,
      maxX: 23.0,
      minZ: 7.0,
      maxZ: 13.5
    });
  }

  private static buildSignpostsAndBenches(scene: THREE.Scene): void {
    const woodMat = new THREE.MeshLambertMaterial({ color: 0x4a2e1b });
    const signMat = new THREE.MeshLambertMaterial({ color: 0xddc89a });

    // Directional Signpost at Village Crossroads (x = 3.2, z = 2.5)
    const signGroup = new THREE.Group();
    signGroup.position.set(3.2, 0, 2.5);

    // Post
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 2.4, 8), woodMat);
    post.position.set(0, 1.2, 0);
    post.castShadow = true;
    signGroup.add(post);

    // Top Board (North: Rumah Bojong)
    const boardNorth = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.22, 1.2), signMat);
    boardNorth.position.set(0, 2.1, 0);
    signGroup.add(boardNorth);

    // Middle Board (West: Pos PETA)
    const boardWest = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.22, 0.1), signMat);
    boardWest.position.set(0, 1.75, 0);
    signGroup.add(boardWest);

    // Bottom Board (East: Sungai Citarum)
    const boardEast = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.2, 0.1), signMat);
    boardEast.position.set(0.1, 1.4, 0);
    signGroup.add(boardEast);

    scene.add(signGroup);

    // Wooden Resting Benches under Trees
    [-6, 12].forEach((bx, idx) => {
      const bZ = 12 + idx * 4;
      const bench = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.45, 0.7), woodMat);
      bench.position.set(bx, 0.35, bZ);
      bench.castShadow = true;
      scene.add(bench);
    });
  }

  private static buildRicePaddies(scene: THREE.Scene): void {
    const paddyMat = new THREE.MeshLambertMaterial({ color: 0x7cb518 });
    const waterMat = new THREE.MeshStandardMaterial({ color: 0x3d7068, roughness: 0.2 });

    [
      { x: 26, z: 22, w: 16, h: 18 },
      { x: 30, z: -15, w: 14, h: 16 }
    ].forEach((p) => {
      // Basin water
      const basin = new THREE.Mesh(new THREE.PlaneGeometry(p.w, p.h), waterMat);
      basin.rotateX(-Math.PI / 2);
      basin.position.set(p.x, 0.08, p.z);
      scene.add(basin);

      // Rows of stylized rice stalks
      const rowCount = 5;
      for (let r = 0; r < rowCount; r++) {
        const cropRow = new THREE.Mesh(
          new THREE.BoxGeometry(p.w - 2, 0.45, 0.35),
          paddyMat
        );
        cropRow.position.set(p.x, 0.3, p.z - p.h / 2 + (r + 1) * (p.h / (rowCount + 1)));
        cropRow.castShadow = true;
        scene.add(cropRow);
      }

      // Dirt ridge boundary
      const ridge = new THREE.Mesh(
        new THREE.BoxGeometry(p.w + 0.8, 0.3, p.h + 0.8),
        new THREE.MeshLambertMaterial({ color: 0x6f4e37 })
      );
      ridge.position.set(p.x, 0.15, p.z);
      scene.add(ridge);
    });
  }

  private static buildBambooGroves(scene: THREE.Scene): void {
    const bambooStalkMat = new THREE.MeshLambertMaterial({ color: 0x6a994e });
    const leafMat = new THREE.MeshLambertMaterial({ color: 0x386641 });

    const grovePositions = [
      { x: 24, z: -28 },
      { x: 30, z: -25 },
      { x: -16, z: -26 },
      { x: -22, z: -30 }
    ];

    grovePositions.forEach((gp) => {
      const count = 6;
      for (let i = 0; i < count; i++) {
        const ox = (Math.random() - 0.5) * 3.5;
        const oz = (Math.random() - 0.5) * 3.5;
        const height = 6 + Math.random() * 2.5;

        // Stalk
        const stalk = new THREE.Mesh(
          new THREE.CylinderGeometry(0.08, 0.12, height, 6),
          bambooStalkMat
        );
        stalk.position.set(gp.x + ox, height / 2, gp.z + oz);
        stalk.castShadow = true;
        scene.add(stalk);

        // Clump of leaves
        const leaves = new THREE.Mesh(
          new THREE.SphereGeometry(0.85 + Math.random() * 0.35, 6, 6),
          leafMat
        );
        leaves.position.set(gp.x + ox, height - 0.5, gp.z + oz);
        leaves.castShadow = true;
        scene.add(leaves);
      }
    });
  }

  private static buildTreesAndFences(scene: THREE.Scene): void {
    const trunkMat = new THREE.MeshLambertMaterial({ color: 0x5c4033 });
    const foliageMat = new THREE.MeshLambertMaterial({ color: 0x2d6a4f, flatShading: true });
    const fenceMat = new THREE.MeshLambertMaterial({ color: 0x8b5a2b });

    // Stylized Trees placed off the pathways
    const treePositions = [
      { x: -10, z: 8 },
      { x: -28, z: 12 },
      { x: 12, z: 28 },
      { x: 16, z: 14 }, // Banyan tree near coin
      { x: -12, z: 32 },
      { x: -35, z: 8 },
      { x: 18, z: -8 }
    ];

    treePositions.forEach(tp => {
      const height = 4.5 + Math.random() * 2;
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.24, 0.38, height, 8),
        trunkMat
      );
      trunk.position.set(tp.x, height / 2, tp.z);
      trunk.castShadow = true;
      scene.add(trunk);

      // Layered foliage spheres
      const fol1 = new THREE.Mesh(new THREE.DodecahedronGeometry(2.0), foliageMat);
      fol1.position.set(tp.x, height + 1.1, tp.z);
      fol1.castShadow = true;
      scene.add(fol1);

      const fol2 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.5), foliageMat);
      fol2.position.set(tp.x, height + 2.3, tp.z);
      fol2.castShadow = true;
      scene.add(fol2);

      // Register trunk collision
      this.collisionBoxes.push({
        minX: tp.x - 0.7,
        maxX: tp.x + 0.7,
        minZ: tp.z - 0.7,
        maxZ: tp.z + 0.7
      });
    });

    // Fences: Only enclose the side perimeter of Djiaw Kie Siong's courtyard (NEVER cross the roads!)
    // Eastern boundary of courtyard
    for (let z = -17; z <= -4; z += 3.5) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.16, 1.1, 0.16), fenceMat);
      post.position.set(8.5, 0.55, z);
      post.castShadow = true;
      scene.add(post);

      const rail = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.1, 3.5), fenceMat);
      rail.position.set(8.5, 0.75, z + 1.75);
      rail.castShadow = true;
      scene.add(rail);
    }

    // Western boundary of courtyard
    for (let z = -17; z <= -7; z += 3.5) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.16, 1.1, 0.16), fenceMat);
      post.position.set(-8.5, 0.55, z);
      post.castShadow = true;
      scene.add(post);

      const rail = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.1, 3.5), fenceMat);
      rail.position.set(-8.5, 0.75, z + 1.75);
      rail.castShadow = true;
      scene.add(rail);
    }
  }

  private static buildClouds(scene: THREE.Scene): void {
    const cloudMat = new THREE.MeshLambertMaterial({ 
      color: 0xffffff, 
      transparent: true, 
      opacity: 0.75,
      flatShading: true 
    });

    const cloudPositions = [
      { x: -30, y: 28, z: -10 },
      { x: 15, y: 32, z: 20 },
      { x: -10, y: 30, z: -40 },
      { x: 35, y: 26, z: -20 },
      { x: -25, y: 34, z: 35 }
    ];

    cloudPositions.forEach(cp => {
      const cloud = new THREE.Group();
      cloud.position.set(cp.x, cp.y, cp.z);

      const puff1 = new THREE.Mesh(new THREE.DodecahedronGeometry(3.5), cloudMat);
      puff1.position.set(0, 0, 0);
      const puff2 = new THREE.Mesh(new THREE.DodecahedronGeometry(2.5), cloudMat);
      puff2.position.set(2.6, -0.4, 0);
      const puff3 = new THREE.Mesh(new THREE.DodecahedronGeometry(2.2), cloudMat);
      puff3.position.set(-2.4, -0.5, 0);

      cloud.add(puff1, puff2, puff3);
      cloud.name = 'Cloud';
      scene.add(cloud);
    });
  }

  // Check collision for player capsule
  public static checkCollision(x: number, z: number, radius: number = 0.45): boolean {
    if (!this.enableCollision) return false;

    for (const box of this.collisionBoxes) {
      if (
        x + radius > box.minX &&
        x - radius < box.maxX &&
        z + radius > box.minZ &&
        z - radius < box.maxZ
      ) {
        return true; // Collision detected
      }
    }
    // World boundary
    if (Math.abs(x) > 52 || Math.abs(z) > 52) return true;
    
    // River boundary (safe on dock: x in [0.5, 6.5], z in [-38.5, -30])
    if (z < -32.5) {
      const onDock = (x >= 0.5 && x <= 6.5 && z >= -38.5 && z <= -30.0);
      if (!onDock) return true;
    }

    return false;
  }
}
