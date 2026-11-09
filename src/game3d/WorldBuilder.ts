import * as THREE from 'three';

export interface CollisionBox {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

export class WorldBuilder {
  public static collisionBoxes: CollisionBox[] = [];

  public static buildWorld(scene: THREE.Scene): void {
    this.collisionBoxes = [];

    // --- 1. TERRAIN & GROUND ---
    const terrainGeo = new THREE.PlaneGeometry(120, 120, 40, 40);
    terrainGeo.rotateX(-Math.PI / 2);

    // Apply gentle height variation
    const pos = terrainGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      // River trench along z < -35
      if (z < -32) {
        pos.setY(i, -1.8 + Math.sin(x * 0.1) * 0.2);
      } else {
        const hill = Math.sin(x * 0.08) * Math.cos(z * 0.08) * 0.6;
        pos.setY(i, hill);
      }
    }
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshLambertMaterial({ 
      color: 0x558b2f, // Vibrant tropical grass
      flatShading: true 
    });
    const terrain = new THREE.Mesh(terrainGeo, terrainMat);
    terrain.receiveShadow = true;
    scene.add(terrain);

    // --- 2. CITARUM RIVER ---
    const waterGeo = new THREE.PlaneGeometry(120, 30, 20, 10);
    waterGeo.rotateX(-Math.PI / 2);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x219ebc,
      roughness: 0.1,
      metalness: 0.3,
      transparent: true,
      opacity: 0.85
    });
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.position.set(0, -0.9, -44);
    water.name = 'CitarumRiver';
    scene.add(water);

    // Wooden boat dock
    const dockGeo = new THREE.BoxGeometry(4, 0.3, 10);
    const dockMat = new THREE.MeshLambertMaterial({ color: 0x5c4033 });
    const dock = new THREE.Mesh(dockGeo, dockMat);
    dock.position.set(2, -0.6, -34);
    dock.castShadow = true;
    dock.receiveShadow = true;
    scene.add(dock);

    // Docked wooden sampan boat
    const boatGeo = new THREE.BoxGeometry(2, 0.6, 5);
    const boatMat = new THREE.MeshLambertMaterial({ color: 0x8b5a2b });
    const boat = new THREE.Mesh(boatGeo, boatMat);
    boat.position.set(6, -0.7, -37);
    boat.rotation.y = 0.3;
    boat.castShadow = true;
    scene.add(boat);

    // --- 3. DIRT PATHS & VILLAGE TRAILS ---
    const pathMat = new THREE.MeshStandardMaterial({ color: 0xc8a27a, roughness: 0.9 });
    
    // Main trail from south to historic house
    const path1Geo = new THREE.PlaneGeometry(6, 45);
    path1Geo.rotateX(-Math.PI / 2);
    const path1 = new THREE.Mesh(path1Geo, pathMat);
    path1.position.set(0, 0.04, 10);
    path1.receiveShadow = true;
    scene.add(path1);

    // Lateral trail to PETA outpost
    const path2Geo = new THREE.PlaneGeometry(35, 5);
    path2Geo.rotateX(-Math.PI / 2);
    const path2 = new THREE.Mesh(path2Geo, pathMat);
    path2.position.set(-15, 0.05, -3);
    path2.receiveShadow = true;
    scene.add(path2);

    // --- 4. RUMAH SEJARAH DJIAW KIE SIONG ---
    const houseGroup = new THREE.Group();
    houseGroup.position.set(0, 0, -12);

    // Wooden stilt foundation
    const woodMat = new THREE.MeshLambertMaterial({ color: 0x4a2e1b });
    const bambooWallMat = new THREE.MeshLambertMaterial({ color: 0xcab577 });
    const roofMat = new THREE.MeshLambertMaterial({ color: 0x9e2a2b, flatShading: true });

    // Raised Floor platform
    const floorGeo = new THREE.BoxGeometry(14, 0.8, 12);
    const floor = new THREE.Mesh(floorGeo, woodMat);
    floor.position.set(0, 0.8, 0);
    floor.castShadow = true;
    floor.receiveShadow = true;
    houseGroup.add(floor);

    // House Walls
    const wallGeo = new THREE.BoxGeometry(13.2, 3.2, 8);
    const wall = new THREE.Mesh(wallGeo, bambooWallMat);
    wall.position.set(0, 2.7, -1.8);
    wall.castShadow = true;
    wall.receiveShadow = true;
    houseGroup.add(wall);

    // Veranda (Front porch where Soekarno & Hatta sit)
    const verandaRoofGeo = new THREE.BoxGeometry(13.8, 0.25, 4.2);
    const verandaRoof = new THREE.Mesh(verandaRoofGeo, woodMat);
    verandaRoof.position.set(0, 3.8, 3.8);
    verandaRoof.castShadow = true;
    houseGroup.add(verandaRoof);

    // Veranda Pillars
    [-6.2, -2.1, 2.1, 6.2].forEach(px => {
      const pillarGeo = new THREE.BoxGeometry(0.25, 2.6, 0.25);
      const pillar = new THREE.Mesh(pillarGeo, woodMat);
      pillar.position.set(px, 2.5, 5.6);
      pillar.castShadow = true;
      houseGroup.add(pillar);
    });

    // Veranda Chairs and Table
    const tableGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.7, 12);
    const table = new THREE.Mesh(tableGeo, woodMat);
    table.position.set(1.5, 1.55, 3.8);
    table.castShadow = true;
    houseGroup.add(table);

    // Warm Lantern on table
    const lanternGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.28, 8);
    const lanternMat = new THREE.MeshBasicMaterial({ color: 0xffe066 });
    const lantern = new THREE.Mesh(lanternGeo, lanternMat);
    lantern.position.set(1.5, 2.05, 3.8);
    houseGroup.add(lantern);

    // Point Light from lantern
    const lanternLight = new THREE.PointLight(0xffb703, 1.5, 12);
    lanternLight.position.set(1.5, 2.3, 3.8);
    houseGroup.add(lanternLight);

    // Veranda Wooden Stairs
    const stairsGeo = new THREE.BoxGeometry(3, 0.4, 1.5);
    const stairs = new THREE.Mesh(stairsGeo, woodMat);
    stairs.position.set(0, 0.2, 6.7);
    stairs.castShadow = true;
    stairs.receiveShadow = true;
    houseGroup.add(stairs);

    // Main Clay Tile Hipped Roof
    const mainRoofGeo = new THREE.ConeGeometry(10.5, 4.2, 4);
    mainRoofGeo.rotateY(Math.PI / 4);
    const mainRoof = new THREE.Mesh(mainRoofGeo, roofMat);
    mainRoof.position.set(0, 5.8, -1.8);
    mainRoof.castShadow = true;
    houseGroup.add(mainRoof);

    scene.add(houseGroup);

    // Register collision box for the main house
    this.collisionBoxes.push({
      minX: -7.5,
      maxX: 7.5,
      minZ: -19,
      maxZ: -5.5
    });

    // --- 5. POS PENJAGAAN & MENARA PETA ---
    const petaGroup = new THREE.Group();
    petaGroup.position.set(-25, 0, -5);

    // Watchtower 4 wooden legs
    const towerLegMat = new THREE.MeshLambertMaterial({ color: 0x3d2817 });
    [-1.6, 1.6].forEach(tx => {
      [-1.6, 1.6].forEach(tz => {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.3, 7.5, 0.3), towerLegMat);
        leg.position.set(tx, 3.75, tz);
        leg.castShadow = true;
        petaGroup.add(leg);
      });
    });

    // Tower Observation Deck
    const deck = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.4, 4.2), woodMat);
    deck.position.set(0, 6.5, 0);
    deck.castShadow = true;
    petaGroup.add(deck);

    // Tower Thatched Roof
    const towerRoof = new THREE.Mesh(new THREE.ConeGeometry(3.5, 2.2, 4), roofMat);
    towerRoof.rotateY(Math.PI / 4);
    towerRoof.position.set(0, 8.2, 0);
    towerRoof.castShadow = true;
    petaGroup.add(towerRoof);

    // Flagpole & Indonesian Red-White Flag (Merah-Putih)
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 4.5, 8), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    pole.position.set(0, 10.2, 0);
    petaGroup.add(pole);

    const flagRed = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.45), new THREE.MeshBasicMaterial({ color: 0xd90429, side: THREE.DoubleSide }));
    flagRed.position.set(0.7, 11.4, 0);
    const flagWhite = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.45), new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide }));
    flagWhite.position.set(0.7, 10.95, 0);
    petaGroup.add(flagRed, flagWhite);

    // Sandbag Bunkers
    const sandbagMat = new THREE.MeshLambertMaterial({ color: 0xb79ced });
    const sandbagColor = new THREE.MeshLambertMaterial({ color: 0x998a6d });
    [-3.5, 3.5].forEach(bx => {
      const bunker = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.8, 1.2), sandbagColor);
      bunker.position.set(bx, 0.4, 2.5);
      bunker.castShadow = true;
      petaGroup.add(bunker);
    });

    // Vintage Military Transport Truck
    const truckMat = new THREE.MeshLambertMaterial({ color: 0x2e4233 });
    const wheelMat = new THREE.MeshLambertMaterial({ color: 0x1a1a1a });
    const truckGroup = new THREE.Group();
    truckGroup.position.set(-8, 0, -2);
    truckGroup.rotation.y = 0.4;

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
    const crate = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.0, 1.2), woodMat);
    crate.position.set(0, 0.5, 3.2);
    crate.castShadow = true;
    petaGroup.add(crate);

    const chest = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.4, 0.5), new THREE.MeshStandardMaterial({ color: 0x6e260e, metalness: 0.5 }));
    chest.name = 'Chest_PETACipher';
    chest.position.set(0, 1.2, 3.2);
    chest.castShadow = true;
    petaGroup.add(chest);

    scene.add(petaGroup);

    // Collision for watchtower and truck
    this.collisionBoxes.push({
      minX: -28,
      maxX: -22,
      minZ: -8,
      maxZ: -2
    });
    this.collisionBoxes.push({
      minX: -36,
      maxX: -30,
      minZ: -9,
      maxZ: -4
    });

    // --- 6. RICE PADDIES & BAMBOO GROVES ---
    this.buildRicePaddies(scene);
    this.buildBambooGroves(scene);
    this.buildTreesAndFences(scene);
  }

  private static buildRicePaddies(scene: THREE.Scene): void {
    const paddyMat = new THREE.MeshLambertMaterial({ color: 0x7cb518 });
    const waterMat = new THREE.MeshStandardMaterial({ color: 0x3d7068, roughness: 0.2 });

    [
      { x: 26, z: 12, w: 18, h: 22 },
      { x: 30, z: -15, w: 16, h: 18 }
    ].forEach((p, idx) => {
      // Basin water
      const basin = new THREE.Mesh(new THREE.PlaneGeometry(p.w, p.h), waterMat);
      basin.rotateX(-Math.PI / 2);
      basin.position.set(p.x, 0.08, p.z);
      scene.add(basin);

      // Rows of stylized rice stalks
      const rowCount = 6;
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
        new THREE.MeshLambertMaterial({ color: 0x6f4e37, wireframe: false })
      );
      ridge.position.set(p.x, 0.15, p.z);
      scene.add(ridge);
    });
  }

  private static buildBambooGroves(scene: THREE.Scene): void {
    const bambooStalkMat = new THREE.MeshLambertMaterial({ color: 0x6a994e });
    const leafMat = new THREE.MeshLambertMaterial({ color: 0x386641 });

    const grovePositions = [
      { x: 28, z: -25 },
      { x: 24, z: -28 },
      { x: 32, z: -23 },
      { x: -18, z: -28 },
      { x: -22, z: -32 }
    ];

    grovePositions.forEach((gp) => {
      const count = 7;
      for (let i = 0; i < count; i++) {
        const ox = (Math.random() - 0.5) * 4;
        const oz = (Math.random() - 0.5) * 4;
        const height = 6 + Math.random() * 3;

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
          new THREE.SphereGeometry(0.9 + Math.random() * 0.4, 6, 6),
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

    // Stylized Trees
    const treePositions = [
      { x: -12, z: 8 },
      { x: -16, z: 18 },
      { x: -8, z: 28 },
      { x: 14, z: 26 },
      { x: 18, z: 6 },
      { x: 8, z: 34 },
      { x: -28, z: 18 },
      { x: -38, z: 2 },
      { x: 22, z: 25 } // Banyan tree for hidden coin
    ];

    treePositions.forEach(tp => {
      const height = 4.5 + Math.random() * 2;
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.25, 0.4, height, 8),
        trunkMat
      );
      trunk.position.set(tp.x, height / 2, tp.z);
      trunk.castShadow = true;
      scene.add(trunk);

      // Layered foliage spheres
      const fol1 = new THREE.Mesh(new THREE.DodecahedronGeometry(2.1), foliageMat);
      fol1.position.set(tp.x, height + 1.2, tp.z);
      fol1.castShadow = true;
      scene.add(fol1);

      const fol2 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.6), foliageMat);
      fol2.position.set(tp.x, height + 2.5, tp.z);
      fol2.castShadow = true;
      scene.add(fol2);

      // Register trunk collision
      this.collisionBoxes.push({
        minX: tp.x - 0.8,
        maxX: tp.x + 0.8,
        minZ: tp.z - 0.8,
        maxZ: tp.z + 0.8
      });
    });

    // Fences along the main road
    [-3.8, 3.8].forEach(fx => {
      for (let z = 0; z < 30; z += 4) {
        // Post
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.2, 0.18), fenceMat);
        post.position.set(fx, 0.6, z);
        post.castShadow = true;
        scene.add(post);

        // Rail
        const rail = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.12, 4), fenceMat);
        rail.position.set(fx, 0.8, z + 2);
        rail.castShadow = true;
        scene.add(rail);
      }
    });
  }

  // Check collision for player capsule
  public static checkCollision(x: number, z: number, radius: number = 0.45): boolean {
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
    // River boundary (player cannot walk into deep water)
    if (z < -34) return true;

    return false;
  }
}
