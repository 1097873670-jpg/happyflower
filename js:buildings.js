// ==================== 建筑物（梦幻版）====================

// 两层大别墅（保持不变）
function createTwoStoryHouse(x, z) {
    const house = new THREE.Group();
    house.name = 'house';

    // ══════════════════════════════════════════
    // 粉色梦幻少女风配色
    // ══════════════════════════════════════════
    const wallMat  = new THREE.MeshStandardMaterial({ color: 0xffb7c5, roughness: 0.75 }); // 一楼：樱花粉
    const wall2Mat = new THREE.MeshStandardMaterial({ color: 0xffc8d4, roughness: 0.75 }); // 二楼：浅玫瑰粉
    const roofMat  = new THREE.MeshStandardMaterial({ color: 0xe75480, roughness: 0.85 }); // 屋顶：玫瑰红
    const doorMat  = new THREE.MeshStandardMaterial({ color: 0xc06090, roughness: 0.6  }); // 门：紫玫瑰
    const winMat   = new THREE.MeshStandardMaterial({ color: 0x48d1cc, transparent: true, opacity: 0.55, roughness: 0.05 }); // 窗户：粉透明
    const winFrMat = new THREE.MeshStandardMaterial({ color: 0xfff0f5, roughness: 0.4  }); // 窗框：珍珠白
    const railMat  = new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.2, metalness: 0.6 }); // 栏杆：香槟金
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0xf8d7e3, roughness: 0.85 }); // 腰线/台阶：粉米色
    const chimneyMat = new THREE.MeshStandardMaterial({ color: 0xd4789a, roughness: 0.9 }); // 烟囱：深玫瑰

    // ── 一楼主体 ──
    const floor1 = new THREE.Mesh(new THREE.BoxGeometry(6, 3.2, 5), wallMat);
    floor1.position.y = 1.6;
    floor1.castShadow = true;
    floor1.receiveShadow = true;
    house.add(floor1);

    // ── 二楼主体 ──
    const floor2 = new THREE.Mesh(new THREE.BoxGeometry(5.5, 2.8, 4.5), wall2Mat);
    floor2.position.y = 4.6;
    floor2.castShadow = true;
    floor2.receiveShadow = true;
    house.add(floor2);

    // ── 腰线装饰 ──
    const belt = new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.2, 5.2), stoneMat);
    belt.position.y = 3.3;
    house.add(belt);

    // ── 屋顶 ──
    const roofGeo = new THREE.ConeGeometry(4.2, 2.2, 4);
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.y = 7.3;
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    house.add(roof);

    // ── 屋顶装饰线（新增：奶白色描边让屋顶更精致）──
    const roofRimMat = new THREE.MeshStandardMaterial({ color: 0xfff0f5, roughness: 0.5 });
    const roofRim = new THREE.Mesh(new THREE.TorusGeometry(2.96, 0.08, 6, 4), roofRimMat);
    roofRim.position.y = 6.22;
    roofRim.rotation.y = Math.PI / 4;
    house.add(roofRim);

    // ── 烟囱 ──
    const chimney = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.8, 0.5), chimneyMat);
    chimney.position.set(1.2, 7.8, -0.5);
    chimney.castShadow = true;
    house.add(chimney);
    const chimneyTop = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.15, 0.65), stoneMat);
    chimneyTop.position.set(1.2, 8.75, -0.5);
    house.add(chimneyTop);

    // ── 门 ──
    const door = new THREE.Mesh(new THREE.BoxGeometry(1.0, 2.0, 0.12), doorMat);
    door.position.set(0, 1.0, 2.56);
    house.add(door);

    // 门上圆弧装饰（新增：拱形顶让门更少女）
    const archMat = new THREE.MeshStandardMaterial({ color: 0xfff0f5, roughness: 0.4 });
    const arch = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.07, 8, 16, Math.PI), archMat);
    arch.position.set(0, 2.05, 2.56);
    house.add(arch);

    const doorFrameH = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.1, 0.15), winFrMat);
    doorFrameH.position.set(0, 2.05, 2.56);
    house.add(doorFrameH);
    const doorFrameL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2.1, 0.15), winFrMat);
    doorFrameL.position.set(-0.55, 1.0, 2.56);
    house.add(doorFrameL);
    const doorFrameR = doorFrameL.clone();
    doorFrameR.position.x = 0.55;
    house.add(doorFrameR);

    // 门把手（金色）
    const handle = new THREE.Mesh(
        new THREE.SphereGeometry(0.06, 8, 8),
        new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.9, roughness: 0.1 })
    );
    handle.position.set(0.3, 1.0, 2.63);
    house.add(handle);

    // ── 台阶（粉米色）──
    [0, 1, 2].forEach(i => {
        const step = new THREE.Mesh(
            new THREE.BoxGeometry(1.8 - i * 0.2, 0.18, 0.38),
            stoneMat
        );
        step.position.set(0, i * 0.18, 2.75 + i * 0.38);
        step.castShadow = true;
        house.add(step);
    });

    // ── 窗户 ──
    const addWindow = (wx, wy, wz, faceZ) => {
        const win = new THREE.Mesh(new THREE.PlaneGeometry(0.85, 0.9), winMat);
        win.position.set(wx, wy, wz + (faceZ ? 0.01 : 0));
        if (!faceZ) win.rotation.y = Math.PI / 2;
        house.add(win);
        const fH = new THREE.Mesh(
            new THREE.BoxGeometry(faceZ ? 1.0 : 0.12, 0.1, faceZ ? 0.12 : 1.0), winFrMat
        );
        fH.position.set(wx, wy + 0.5, wz);
        house.add(fH);
        const fB = fH.clone();
        fB.position.set(wx, wy - 0.5, wz);
        house.add(fB);
    };

    addWindow(-1.8, 1.6,  2.56, true);
    addWindow( 1.8, 1.6,  2.56, true);
    addWindow(-1.8, 1.6, -2.56, true);
    addWindow( 1.8, 1.6, -2.56, true);
    addWindow(-1.5, 4.6,  2.26, true);
    addWindow( 1.5, 4.6,  2.26, true);
    addWindow(-1.5, 4.6, -2.26, true);
    addWindow( 1.5, 4.6, -2.26, true);

    // ── 阳台地板 ──
    const balcony = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.15, 1.2), stoneMat);
    balcony.position.set(0, 3.42, 2.8);
    balcony.castShadow = true;
    house.add(balcony);

    // ── 阳台栏杆（金色）──
    for (let i = -1.3; i <= 1.3; i += 0.4) {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.7, 0.08), railMat);
        post.position.set(i, 3.77, 3.3);
        house.add(post);
    }
    const rail = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.08, 0.08), railMat);
    rail.position.set(0, 4.12, 3.3);
    house.add(rail);
    const railSideL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.7, 1.2), railMat);
    railSideL.position.set(-1.5, 3.77, 2.8);
    house.add(railSideL);
    const railSideR = railSideL.clone();
    railSideR.position.x = 1.5;
    house.add(railSideR);

    // ── 阳台落地窗 ──
    const balconyDoor = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.6, 0.08), winMat);
    balconyDoor.position.set(0, 4.4, 2.28);
    house.add(balconyDoor);
    const bdFrame = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.1, 0.12), winFrMat);
    bdFrame.position.set(0, 5.22, 2.28);
    house.add(bdFrame);

    // ── 地基（粉米色）──
    const foundation = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.3, 5.4), stoneMat);
    foundation.position.y = 0.15;
    foundation.receiveShadow = true;
    house.add(foundation);

    // ── 侧面窗户 ──
    const sideWinMat = winMat.clone();
    const sideWin1 = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.8), sideWinMat);
    sideWin1.position.set(3.01, 1.6, 0.5);
    sideWin1.rotation.y = Math.PI / 2;
    house.add(sideWin1);
    const sideWin2 = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.8), sideWinMat);
    sideWin2.position.set(3.01, 1.6, -0.5);
    sideWin2.rotation.y = Math.PI / 2;
    house.add(sideWin2);

    house.position.set(x, 0, z);
    scene.add(house);
    return house;
}

// 摩天轮（保持不变）
function createFerrisWheel(x, z) {
    const wheel = new THREE.Group();
    wheel.name = 'ferrisWheel';

    const supportMat = new THREE.MeshStandardMaterial({ color: 0x87ceeb, roughness: 0.7 });
    const rimMat = new THREE.MeshStandardMaterial({ color: 0xb0e0ff, metalness: 0.5, roughness: 0.3 });
    const cabinMat = new THREE.MeshStandardMaterial({ color: 0xb0e0ff, metalness: 0.3, roughness: 0.5 });
    const spokeMat = new THREE.MeshStandardMaterial({ color: 0xb0e0ff, metalness: 0.4, roughness: 0.4 });

    const support = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.42, 8.5, 10), supportMat);
    support.position.y = 4.25;
    support.castShadow = true;
    wheel.add(support);

    const base = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.4, 1.2), supportMat);
    base.position.y = 0.2;
    base.castShadow = true;
    wheel.add(base);

    const rim = new THREE.Mesh(new THREE.TorusGeometry(4.2, 0.18, 16, 48), rimMat);
    rim.position.y = 8.5;
    rim.rotation.x = Math.PI / 2;
    wheel.add(rim);

    const innerRim = new THREE.Mesh(new THREE.TorusGeometry(2.0, 0.1, 16, 32), spokeMat);
    innerRim.position.y = 8.5;
    innerRim.rotation.x = Math.PI / 2;
    wheel.add(innerRim);

    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const spoke = new THREE.Mesh(
            new THREE.CylinderGeometry(0.045, 0.045, 8.4, 6),
            spokeMat
        );
        spoke.position.set(Math.cos(angle) * 2.1, 8.5, Math.sin(angle) * 2.1);
        spoke.rotation.z = angle + Math.PI / 2;
        wheel.add(spoke);
    }

    const cabins = [];
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const cabinGroup = new THREE.Group();

        const cabin = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.9, 0.6), cabinMat);
        cabin.castShadow = true;
        cabinGroup.add(cabin);

        const cabinRoof = new THREE.Mesh(
            new THREE.BoxGeometry(0.85, 0.12, 0.7),
            new THREE.MeshStandardMaterial({ color: 0xff9900, roughness: 0.5 })
        );
        cabinRoof.position.y = 0.51;
        cabinGroup.add(cabinRoof);

        const cabinWin = new THREE.Mesh(
            new THREE.PlaneGeometry(0.45, 0.45),
            new THREE.MeshStandardMaterial({ color: 0x87ceeb, transparent: true, opacity: 0.7 })
        );
        cabinWin.position.set(0, 0, 0.31);
        cabinGroup.add(cabinWin);

        cabinGroup.position.set(Math.cos(angle) * 4.2, 8.5, Math.sin(angle) * 4.2);
        wheel.add(cabinGroup);
        cabins.push(cabinGroup);
    }

    wheel.userData = { rim, innerRim, rotation: 0, cabins };
    wheel.position.set(x, 0, z);
    scene.add(wheel);
    return wheel;
}

function rotateFerrisWheel(wheel, speed = 0.003) {
    if (!wheel || !wheel.userData.rim) return;
    wheel.userData.rotation += speed;
    const rot = wheel.userData.rotation;
    wheel.userData.rim.rotation.z = rot;
    wheel.userData.innerRim.rotation.z = rot;
    wheel.userData.cabins.forEach((cabin, i) => {
        const angle = (i / 8) * Math.PI * 2 + rot;
        cabin.position.set(Math.cos(angle) * 4.2, 8.5 + Math.sin(angle) * 4.2, 0);
        cabin.rotation.z = -rot;
    });
}

// ========== 🎀 梦幻粉色抓娃娃机（透明玻璃罩版）==========
function createClawMachine(x, z) {
    const machine = new THREE.Group();
    machine.name = 'clawMachine';

    // 材质定义
    const pinkGradientMat = new THREE.MeshStandardMaterial({ 
        color: 0xff9ed8,  // 粉紫色
        roughness: 0.3, 
        metalness: 0.5,
        emissive: 0xff9ed8,
        emissiveIntensity: 0.1
    });
    
    const purpleMat = new THREE.MeshStandardMaterial({ 
        color: 0xd896ff,  // 紫色
        roughness: 0.3, 
        metalness: 0.4 
    });

    // 超透明玻璃罩材质（修复关键）
    const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true, 
        opacity: 0.08,  // 几乎完全透明
        roughness: 0.0, 
        metalness: 0.0, 
        transmission: 0.95,  // 高透光率
        thickness: 0.5,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
        ior: 1.5  // 玻璃折射率
    });

    const goldMat = new THREE.MeshStandardMaterial({
        color: 0xffd700, 
        metalness: 0.9, 
        roughness: 0.2
    });

    // === 底座（粉紫色渐变）===
    const base = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.4, 0.3, 32), pinkGradientMat);
    base.position.y = 0.15;
    base.castShadow = true;
    machine.add(base);

    // 底座装饰环
    const baseRing = new THREE.Mesh(new THREE.TorusGeometry(1.35, 0.08, 16, 32), goldMat);
    baseRing.position.y = 0.3;
    baseRing.rotation.x = Math.PI / 2;
    machine.add(baseRing);

    // === 主体机身（只有边框，不是实心）===
    // 底部圆环
    const bodyRing = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.1, 16, 32), purpleMat);
    bodyRing.position.y = 0.3;
    bodyRing.rotation.x = Math.PI / 2;
    machine.add(bodyRing);

    // 顶部圆环
    const topRing = new THREE.Mesh(new THREE.TorusGeometry(1.25, 0.12, 16, 32), purpleMat);
    topRing.position.y = 2.8;
    topRing.rotation.x = Math.PI / 2;
    machine.add(topRing);

    // 四根支撑柱（代替实心圆柱）
    for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2;
        const pillar = new THREE.Mesh(
            new THREE.CylinderGeometry(0.08, 0.08, 2.5, 8),
            purpleMat
        );
        pillar.position.set(
            Math.cos(angle) * 1.15,
            1.55,
            Math.sin(angle) * 1.15
        );
        pillar.castShadow = true;
        machine.add(pillar);
    }

    // === 超透明圆顶玻璃罩 ===
    const dome = new THREE.Mesh(
        new THREE.SphereGeometry(1.25, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.5),
        glassMat
    );
    dome.position.y = 2.8;
    machine.add(dome);

    // 玻璃罩顶部金色装饰
    const domeTop = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), goldMat);
    domeTop.position.y = 4.05;
    machine.add(domeTop);

    // === 彩色渐变球（堆放在底部，清晰可见）===
    const ballColors = [
        0xff6b9d,  // 粉红
        0xffd700,  // 金色
        0x9d6bff,  // 紫色
        0x6bddff,  // 蓝色
        0x6bff9d,  // 绿色
        0xffdd6b,  // 橙色
        0xff6bdd   // 玫红
    ];


    machine.userData.balls = [ ];

    
    // 第一层（底部）
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 0.6 + Math.random() * 0.3;
        const color = ballColors[Math.floor(Math.random() * ballColors.length)];
        const ballMat = new THREE.MeshStandardMaterial({ 
            color, 
            roughness: 0.2, 
            metalness: 0.7,
            emissive: color,
            emissiveIntensity: 0.3
        });
        
        const ball = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), ballMat);
        ball.position.set(
            Math.cos(angle) * radius,
            0.48,
            Math.sin(angle) * radius
        );
        ball.castShadow = true;
        machine.add(ball);
        machine.userData.balls.push(ball);
    }

    // 第二层（中间）
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 + 0.3;
        const radius = 0.4 + Math.random() * 0.25;
        const color = ballColors[Math.floor(Math.random() * ballColors.length)];
        const ballMat = new THREE.MeshStandardMaterial({ 
            color, 
            roughness: 0.2, 
            metalness: 0.7,
            emissive: color,
            emissiveIntensity: 0.3
        });
        
        const ball = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), ballMat);
        ball.position.set(
            Math.cos(angle) * radius,
            0.84,
            Math.sin(angle) * radius
        );
        ball.castShadow = true;
        machine.add(ball);
        machine.userData.balls.push(ball);
    }

    // 第三层（顶部）
    for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2;
        const radius = 0.2 + Math.random() * 0.15;
        const color = ballColors[Math.floor(Math.random() * ballColors.length)];
        const ballMat = new THREE.MeshStandardMaterial({ 
            color, 
            roughness: 0.2, 
            metalness: 0.7,
            emissive: color,
            emissiveIntensity: 0.3
        });
        
        const ball = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), ballMat);
        ball.position.set(
            Math.cos(angle) * radius,
            1.2,
            Math.sin(angle) * radius
        );
        ball.castShadow = true;
        machine.add(ball);
        machine.userData.balls.push(ball);
    }

    // === 操作面板（底部）===
    const panel = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.25, 0.8), pinkGradientMat);
    panel.position.set(0, 0.42, 1.3);
    panel.castShadow = true;
    machine.add(panel);

    // 操作按钮
    const buttonMat = new THREE.MeshStandardMaterial({ 
        color: 0xff6b9d, 
        emissive: 0xff6b9d, 
        emissiveIntensity: 0.5 
    });
    
    [-0.4, 0, 0.4].forEach(bx => {
        const button = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.1, 16), buttonMat);
        button.position.set(bx, 0.6, 1.3);
        button.rotation.x = Math.PI / 2;
        machine.add(button);
    });

    // === 环绕光点粒子 ===
    const particleCount = 30;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2;
        const radius = 1.8 + Math.random() * 0.3;
        const height = Math.random() * 3.5;
        
        particlePositions[i * 3] = Math.cos(angle) * radius;
        particlePositions[i * 3 + 1] = height;
        particlePositions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    
    const particleMat = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.08,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    });
    
    const particles = new THREE.Points(particleGeo, particleMat);
    machine.add(particles);
    machine.userData.particles = particles;

    machine.position.set(x, 0, z);
    scene.add(machine);
    return machine;
}

// 娃娃机动画更新
function updateClawMachine(machine) {
    if (!machine || !machine.userData.particles) return;
    
    const time = performance.now() * 0.001;
    
    // 粒子旋转
    machine.userData.particles.rotation.y = time * 0.3;
    
    // 彩球轻微浮动
    if (machine.userData.balls) {
        machine.userData.balls.forEach((ball, i) => {
            ball.position.y = 0.5 + Math.sin(time * 2 + i) * 0.05;
            ball.rotation.y = time * 0.5 + i;
        });
    }
}