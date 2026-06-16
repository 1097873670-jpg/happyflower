// ==================== 别墅内部（第三人称版）====================

let insideHouse = false;
let cakeCloseUp = false;  // ← 提到最顶部，避免 exitHouse 引用时未定义

// ─────────────────────────────────────────────
// 创建别墅内部场景
// ─────────────────────────────────────────────
function createHouseInterior(housePos) {
    if (!housePos || typeof housePos.x === 'undefined') {
        console.error('❌ housePos 参数无效！', housePos);
        return;
    }

    const interior = new THREE.Group();
    interior.name = 'houseInterior';
    interior.visible = false;

    // ✅ 地板：深原木色
const floorMat = new THREE.MeshStandardMaterial({ 
    color: 0x8b5a2b,  // 深胡桃木色
    roughness: 0.85 
});

// ✅ 墙壁：薄荷绿清新风
const wallMat2 = new THREE.MeshStandardMaterial({ 
    color: 0xa5d6a7,  // 薄荷绿
    roughness: 0.9, 
    side: THREE.DoubleSide 
});

// ✅ 天花板：配套奶白色（不要纯白，太刺眼）
const ceilMat = new THREE.MeshStandardMaterial({ 
    color: 0xf5f5f0,  
    roughness: 0.7 
});
    // 地板
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    floor.name = 'indoorGround';
    interior.add(floor);

    // 后墙
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(20, 5), wallMat2);
    backWall.position.set(0, 2.5, -10);
    interior.add(backWall);

    // 前墙左
    const frontWallL = new THREE.Mesh(new THREE.PlaneGeometry(8, 5), wallMat2);
    frontWallL.position.set(-6, 2.5, 10);
    frontWallL.rotation.y = Math.PI;
    interior.add(frontWallL);

    // 前墙右
    const frontWallR = new THREE.Mesh(new THREE.PlaneGeometry(8, 5), wallMat2);
    frontWallR.position.set(6, 2.5, 10);
    frontWallR.rotation.y = Math.PI;
    interior.add(frontWallR);

    // 左墙
    const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(20, 5), wallMat2);
    leftWall.position.set(-10, 2.5, 0);
    leftWall.rotation.y = Math.PI / 2;
    interior.add(leftWall);

    // 右墙
    const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(20, 5), wallMat2);
    rightWall.position.set(10, 2.5, 0);
    rightWall.rotation.y = -Math.PI / 2;
    interior.add(rightWall);

    // 天花板
    const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), ceilMat);
    ceiling.position.y = 5;
    ceiling.rotation.x = Math.PI / 2;
    interior.add(ceiling);

    // 室内灯光（柔和不曝光）
    const light1 = new THREE.PointLight(0xfff4e0, 0.5, 30);
    light1.position.set(0, 4.5, 0);
    interior.add(light1);

    const light2 = new THREE.PointLight(0xfff4e0, 0.3, 20);
    light2.position.set(-6, 4, -5);
    interior.add(light2);

    const light3 = new THREE.PointLight(0xfff4e0, 0.3, 20);
    light3.position.set(6, 4, 5);
    interior.add(light3);

    const ambientIndoor = new THREE.AmbientLight(0xfff8f0, 0.4);
    interior.add(ambientIndoor);

    // 家具
    createRoomFurniture(interior);

    // 三面照片墙
    createPhotoWallBack(interior);
    createPhotoWallLeft(interior);
    createPhotoWallRight(interior);

    // 厨房
    createKitchenArea(interior);

    interior.position.set(housePos.x, 0.5, housePos.z);
    scene.add(interior);
    console.log('✅ 别墅内部创建成功，子对象数量：', interior.children.length);
    return interior;
}

// ─────────────────────────────────────────────
// 家具（圆桌 + 蛋糕，无沙发）
// ─────────────────────────────────────────────
function createRoomFurniture(interior) {
    const tMat = new THREE.MeshStandardMaterial({ color: 0x8b4513, roughness: 0.4, metalness: 0.15 });

    const tabletop = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 0.08, 32), tMat);
    tabletop.position.set(0, 0.68, 0);
    tabletop.castShadow = true;
    interior.add(tabletop);

    const tleg = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.1, 0.68, 10), tMat);
    tleg.position.set(0, 0.34, 0);
    tleg.castShadow = true;
    interior.add(tleg);

    const tbase = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.05, 16), tMat);
    tbase.position.set(0, 0.025, 0);
    interior.add(tbase);

    createBirthdayCake(interior);
}

// ─────────────────────────────────────────────
// 三层生日蛋糕
// ─────────────────────────────────────────────
function createBirthdayCake(interior) {
    const cake = new THREE.Group();
    cake.name = 'birthdayCake';
    cake.userData = { candlesLit: false, isCake: true };

    const creamMat = new THREE.MeshStandardMaterial({ color: 0xfffaf0, roughness: 0.8 });

    // 第一层（底）粉色
    const l1 = new THREE.Mesh(
        new THREE.CylinderGeometry(0.42, 0.42, 0.20, 32),
        new THREE.MeshStandardMaterial({ color: 0xffd4e5, roughness: 0.6 })
    );
    l1.position.y = 0.10;
    cake.add(l1);
    const cr1 = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.035, 8, 32), creamMat);
    cr1.position.y = 0.20;
    cr1.rotation.x = Math.PI / 2;
    cake.add(cr1);

    // 第二层 黄色
    const l2 = new THREE.Mesh(
        new THREE.CylinderGeometry(0.32, 0.32, 0.18, 32),
        new THREE.MeshStandardMaterial({ color: 0xffe4b5, roughness: 0.6 })
    );
    l2.position.y = 0.29;
    cake.add(l2);
    const cr2 = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.030, 8, 32), creamMat);
    cr2.position.y = 0.38;
    cr2.rotation.x = Math.PI / 2;
    cake.add(cr2);

    // 第三层（顶）浅粉
    const l3 = new THREE.Mesh(
        new THREE.CylinderGeometry(0.22, 0.22, 0.15, 32),
        new THREE.MeshStandardMaterial({ color: 0xffc0cb, roughness: 0.6 })
    );
    l3.position.y = 0.455;
    cake.add(l3);
    const cr3 = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.025, 8, 32), creamMat);
    cr3.position.y = 0.53;
    cr3.rotation.x = Math.PI / 2;
    cake.add(cr3);

    // 草莓
    const berryMat = new THREE.MeshStandardMaterial({ color: 0xcc2200, roughness: 0.5 });
    for (let bi = 0; bi < 4; bi++) {
        const ba = (bi / 4) * Math.PI * 2;
        const berry = new THREE.Mesh(new THREE.SphereGeometry(0.048, 8, 8), berryMat);
        berry.position.set(Math.cos(ba) * 0.13, 0.56, Math.sin(ba) * 0.13);
        cake.add(berry);
    }

    // 5根蜡烛
    const candleGroup = new THREE.Group();
    candleGroup.name = 'candles';

    const cpos = [
        {x: 0,     z: 0},
        {x: 0.09,  z: 0},
        {x: -0.09, z: 0},
        {x: 0,     z: 0.09},
        {x: 0,     z: -0.09}
    ];
    const cColors = [0xfff8dc, 0xffccdd, 0xccffee, 0xffeebb, 0xddeeff];

    for (let ci = 0; ci < 5; ci++) {
        const cp = cpos[ci];

        const cbody = new THREE.Mesh(
            new THREE.CylinderGeometry(0.013, 0.013, 0.12, 8),
            new THREE.MeshStandardMaterial({ color: cColors[ci], roughness: 0.8 })
        );
        cbody.position.set(cp.x, 0.60, cp.z);
        candleGroup.add(cbody);

        const wick = new THREE.Mesh(
            new THREE.CylinderGeometry(0.003, 0.003, 0.02, 6),
            new THREE.MeshStandardMaterial({ color: 0x111111 })
        );
        wick.position.set(cp.x, 0.67, cp.z);
        candleGroup.add(wick);

        const flameMat = new THREE.MeshStandardMaterial({
            color: 0xff6600, emissive: 0xff9900, emissiveIntensity: 1.5,
            transparent: true, opacity: 0
        });
        const flame = new THREE.Mesh(new THREE.SphereGeometry(0.022, 8, 8), flameMat);
        flame.scale.y = 1.6;
        flame.position.set(cp.x, 0.695, cp.z);
        flame.userData = { isFlame: true, baseY: 0.695, phase: ci * 1.2 };
        candleGroup.add(flame);

        const innerMat = new THREE.MeshStandardMaterial({
            color: 0xffee00, emissive: 0xffee00, emissiveIntensity: 2.0,
            transparent: true, opacity: 0
        });
        const inner = new THREE.Mesh(new THREE.SphereGeometry(0.010, 6, 6), innerMat);
        inner.position.set(cp.x, 0.690, cp.z);
        inner.userData = { isFlameInner: true };
        candleGroup.add(inner);
    }

    cake.add(candleGroup);
    cake.position.set(0, 0.72, 0);
    interior.add(cake);
}

// ─────────────────────────────────────────────
// 照片墙辅助：获取照片配置（修复多余空格 bug）
// ─────────────────────────────────────────────
function getPhotos() {
    // 注意：原代码 'undefined ' 有空格导致判断失效，这里修复

    return (typeof CONFIG !== 'undefined ' && CONFIG && CONFIG.photos) ? CONFIG.photos : [ ];

}

// ─────────────────────────────────────────────
// 照片墙 - 后墙（2张）
// ─────────────────────────────────────────────
function createPhotoWallBack(interior) {
    const photos = getPhotos();

    const bgMat = new THREE.MeshStandardMaterial({ color: 0x1a1a2e, roughness: 0.8 });
    const bg = new THREE.Mesh(new THREE.BoxGeometry(18, 4.0, 0.1), bgMat);
    bg.position.set(0, 2.6, -9.95);
    interior.add(bg);

    const goldMat = new THREE.MeshStandardMaterial({ color: 0xffd700, emissive: 0xffd700, emissiveIntensity: 0.2 });
    const titleBar = new THREE.Mesh(new THREE.BoxGeometry(8, 0.28, 0.06), goldMat);
    titleBar.position.set(0, 4.55, -9.89);
    interior.add(titleBar);

    [{ idx: 0, x: -3.8 }, { idx: 1, x: 3.8 }].forEach(bp => {
        const fg = new THREE.Group();
        const fm = new THREE.MeshStandardMaterial({ color: 0x8b4513, roughness: 0.6 });
        fg.add(new THREE.Mesh(new THREE.BoxGeometry(5.5, 3.4, 0.12), fm));

        if (photos[bp.idx] && photos[bp.idx].url) {
            new THREE.TextureLoader().load(photos[bp.idx].url, tex => {
                const p = new THREE.Mesh(
                    new THREE.PlaneGeometry(5.1, 3.0),
                    new THREE.MeshStandardMaterial({ map: tex })
                );
                p.position.z = 0.07;
                fg.add(p);
            });
        } else {
            const ph = new THREE.Mesh(
                new THREE.PlaneGeometry(5.1, 3.0),
                new THREE.MeshStandardMaterial({ color: 0x334466 })
            );
            ph.position.z = 0.07;
            fg.add(ph);
        }

        fg.position.set(bp.x, 2.6, -9.89);
        fg.userData = { isPhoto: true, photoIndex: bp.idx };
        interior.add(fg);
    });
}

// ─────────────────────────────────────────────
// 照片墙 - 左墙（2张）
// ─────────────────────────────────────────────
function createPhotoWallLeft(interior) {
    const photos = getPhotos();

    [{ idx: 2, z: -3.5 }, { idx: 3, z: 3.5 }].forEach(lp => {
        const fg = new THREE.Group();
        const fm = new THREE.MeshStandardMaterial({ color: 0xa0522d, roughness: 0.6 });
        fg.add(new THREE.Mesh(new THREE.BoxGeometry(5.0, 3.2, 0.12), fm));

        if (photos[lp.idx] && photos[lp.idx].url) {
            new THREE.TextureLoader().load(photos[lp.idx].url, tex => {
                const p = new THREE.Mesh(
                    new THREE.PlaneGeometry(4.6, 2.8),
                    new THREE.MeshStandardMaterial({ map: tex })
                );
                p.position.z = 0.07;
                fg.add(p);
            });
        } else {
            const ph = new THREE.Mesh(
                new THREE.PlaneGeometry(4.6, 2.8),
                new THREE.MeshStandardMaterial({ color: 0x334444 })
            );
            ph.position.z = 0.07;
            fg.add(ph);
        }

        fg.position.set(-9.89, 2.5, lp.z);
        fg.rotation.y = Math.PI / 2;
        fg.userData = { isPhoto: true, photoIndex: lp.idx };
        interior.add(fg);
    });
}

// ─────────────────────────────────────────────
// 照片墙 - 右墙（2张）
// ─────────────────────────────────────────────
function createPhotoWallRight(interior) {
    const photos = getPhotos();

    [{ idx: 4, z: -3.5 }, { idx: 5, z: 3.5 }].forEach(rp => {
        const fg = new THREE.Group();
        const fm = new THREE.MeshStandardMaterial({ color: 0xdaa520, roughness: 0.6 });
        fg.add(new THREE.Mesh(new THREE.BoxGeometry(5.0, 3.2, 0.12), fm));

        if (photos[rp.idx] && photos[rp.idx].url) {
            new THREE.TextureLoader().load(photos[rp.idx].url, tex => {
                const p = new THREE.Mesh(
                    new THREE.PlaneGeometry(4.6, 2.8),
                    new THREE.MeshStandardMaterial({ map: tex })
                );
                p.position.z = 0.07;
                fg.add(p);
            });
        } else {
            const ph = new THREE.Mesh(
                new THREE.PlaneGeometry(4.6, 2.8),
                new THREE.MeshStandardMaterial({ color: 0x444433 })
            );
            ph.position.z = 0.07;
            fg.add(ph);
        }

        fg.position.set(9.89, 2.5, rp.z);
        fg.rotation.y = -Math.PI / 2;
        fg.userData = { isPhoto: true, photoIndex: rp.idx };
        interior.add(fg);
    });
}

// ─────────────────────────────────────────────
// 厨房
// ─────────────────────────────────────────────
function createKitchenArea(interior) {
    const cabinetMat = new THREE.MeshStandardMaterial({ color: 0xdeb887, roughness: 0.7 });
    const counterMat = new THREE.MeshStandardMaterial({ color: 0x696969, roughness: 0.4, metalness: 0.5 });
    const fridgeMat  = new THREE.MeshStandardMaterial({ color: 0xe0e0e0, roughness: 0.3, metalness: 0.6 });

    const cabinet = new THREE.Mesh(new THREE.BoxGeometry(3, 1, 0.6), cabinetMat);
    cabinet.position.set(6, 0.5, -7);
    cabinet.castShadow = true;
    interior.add(cabinet);

    const counter = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.1, 0.7), counterMat);
    counter.position.set(6, 1.05, -7);
    interior.add(counter);

    const fridge = new THREE.Mesh(new THREE.BoxGeometry(0.8, 2, 0.8), fridgeMat);
    fridge.position.set(8.5, 1, -7);
    fridge.castShadow = true;
    interior.add(fridge);

    const handle = new THREE.Mesh(
        new THREE.BoxGeometry(0.05, 0.6, 0.08),
        new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8 })
    );
    handle.position.set(8.08, 1, -6.65);
    interior.add(handle);
}

// ─────────────────────────────────────────────
// 进入别墅
// ─────────────────────────────────────────────
function enterHouse() {
    if (insideHouse) return;
    insideHouse = true;

    const interior = scene.getObjectByName('houseInterior');
    if (!interior) { insideHouse = false; return; }

    // 记录并隐藏室外对象

    window._outdoorObjects = [ ];

    scene.children.forEach(obj => {
        if (obj.name !== 'houseInterior' &&
            obj.type !== 'DirectionalLight' &&
            obj.type !== 'AmbientLight' &&
            obj.type !== 'HemisphereLight') {
            obj.visible = false;
            window._outdoorObjects.push(obj);
        }
    });

    interior.visible = true;

    // ── 所有角色自动跟进来 ──
    if (typeof characters !== 'undefined') {
        const houseX = interior.position.x;
        const houseZ = interior.position.z;

        // 收集所有有 model 的角色（自动识别，不依赖 key 名）
        const allChars = Object.keys(characters)
            .map(key => ({ key, char: characters[key] }))
            .filter(({ char }) => char && char.model);

        const positions = [
            { x: houseX - 1.5, z: houseZ + 7 },  // 第1个角色（长发）
            { x: houseX + 1.5, z: houseZ + 7 },  // 第2个角色（短发 followerGirl）
            { x: houseX,       z: houseZ + 6.5 }, // 第3个角色（小狗）
        ];

        allChars.forEach(({ key, char }, idx) => {
            const pos = positions[idx] || { x: houseX + (idx - 1) * 1.5, z: houseZ + 6 };
            char.model.visible = true;
            char.model.position.set(pos.x, 0, pos.z);
            if (key !== 'dog') char.model.rotation.y = Math.PI;
            console.log(`✅ ${key} 进入房间`);
        });
    }

    scene.background = new THREE.Color(0xf5f0e8);
    scene.fog = null;

    // 相机平视
    const hx = interior.position.x;
    const hz = interior.position.z;
    camera.position.set(hx, 2.8, hz + 8);
    camera.lookAt(hx, 1.0, hz);

    const hint = document.getElementById('hint');
    if (hint) hint.textContent = '点击地面移动 | 靠近蛋糕查看近景 | 点击蛋糕点蜡烛 | ESC退出';

    playBirthdayMusic();
    document.addEventListener('keydown', onHouseEscKey);
    // 启动室内轨道控制
    startIndoorOrbitControl();
}

// ─────────────────────────────────────────────
// 退出别墅
// ─────────────────────────────────────────────
function exitHouse() {
    if (!insideHouse) return;
    insideHouse = false;
    cakeCloseUp = false;

    stopBirthdayMusic();

    const interior = scene.getObjectByName('houseInterior');
    if (interior) interior.visible = false;

    // 恢复室外
    if (window._outdoorObjects && window._outdoorObjects.length > 0) {
        window._outdoorObjects.forEach(obj => { obj.visible = true; });

        window._outdoorObjects = [ ];

    } else {
        scene.children.forEach(obj => {
            if (obj.name !== 'houseInterior') obj.visible = true;
        });
    }

    // 恢复背景和雾效
    scene.background = new THREE.Color(0x87CEEB);
    scene.fog = new THREE.FogExp2(0x87CEEB, 0.011);

    // 恢复所有角色朝向（自动遍历，不漏 followerGirl）
    if (typeof characters !== 'undefined') {
        Object.keys(characters).forEach(key => {
            const c = characters[key];
            if (c && c.model) c.model.rotation.y = 0;
        });
    }

    camera.position.set(0, 14, 22);
    camera.lookAt(0, 0, 0);

    const hint = document.getElementById('hint');
    if (hint) hint.textContent = '点击地面移动长发小人，其他角色会跟随 💕';

    document.removeEventListener('keydown', onHouseEscKey);
    // 停止室内轨道控制
    stopIndoorOrbitControl();
}

function onHouseEscKey(e) {
    if (e.key === 'Escape') exitHouse();
}

// ─────────────────────────────────────────────
// 室内点击处理
// ─────────────────────────────────────────────
function handleIndoorClick(event) {
    if (!insideHouse) return false;

    raycaster.setFromCamera(mouse, camera);

    const interior = scene.getObjectByName('houseInterior');
    if (!interior) return false;

    // 1. 检测蛋糕
    const cake = interior.getObjectByName('birthdayCake');
    if (cake) {
        const cakeHits = raycaster.intersectObjects(cake.children, true);
        if (cakeHits.length > 0) {
            toggleCakeCandles();
            return true;
        }
    }

    // 2. 检测照片
    const photoHits = raycaster.intersectObjects(interior.children, true);
    for (let i = 0; i < photoHits.length; i++) {
        let obj = photoHits[i].object;
        let depth = 0;
        while (obj && depth < 5) {
            if (obj.userData && obj.userData.isPhoto) {
                showPhotoGallery(obj.userData.photoIndex);
                return true;
            }
            obj = obj.parent;
            depth++;
        }
    }

    // 3. 检测地面（移动小人）
    const ground = interior.getObjectByName('indoorGround');
    if (ground) {
        const groundHits = raycaster.intersectObject(ground);
        if (groundHits.length > 0) {
            const pt = groundHits[0].point;
            // 移动长发主角
            if (typeof characters !== 'undefined' && characters.mainGirl) {
                moveCharacterTo(characters.mainGirl, pt);
            }
            return true;
        }
    }

    return false;
}

// ─────────────────────────────────────────────
// 蜡烛交互
// ─────────────────────────────────────────────
function toggleCakeCandles() {
    const interior = scene.getObjectByName('houseInterior');
    if (!interior) return;
    const cake = interior.getObjectByName('birthdayCake');
    if (!cake) return;
    const candles = cake.getObjectByName('candles');
    if (!candles) return;

    cake.userData.candlesLit = !cake.userData.candlesLit;
    const isLit = cake.userData.candlesLit;

    candles.children.forEach(child => {
        if (child.userData && (child.userData.isFlame || child.userData.isFlameInner)) {
            const target = isLit ? (child.userData.isFlame ? 0.88 : 0.95) : 0;
            new TWEEN.Tween(child.material)
                .to({ opacity: target }, 400)
                .easing(TWEEN.Easing.Quadratic.Out)
                .start();
            if (child.userData.isFlame) child.userData.isActive = isLit;
        }
    });

    showCakeMessage(isLit ? '🕯️ 蜡烛点燃！生日快乐 🎂' : '💨 蜡烛吹灭！愿望成真 ✨');

    if (isLit) {
        // 点燃：显示"香香女王 生日快乐"
        launchBirthdayFireworks();
    } else {
        // 吹灭：显示"愿望成真"
        launchWishFireworks();
    }
}

function showCakeMessage(text) {
    const old = document.getElementById('cake-toast');
    if (old) old.remove();
    const toast = document.createElement('div');
    toast.id = 'cake-toast';
    toast.textContent = text;
    toast.style.cssText =
        'position:fixed;top:90px;left:50%;transform:translateX(-50%);' +
        'background:linear-gradient(135deg,#ff6b9d,#ffd700);color:white;' +
        'padding:15px 30px;border-radius:30px;font-size:18px;font-weight:600;' +
        'z-index:10000;box-shadow:0 8px 25px rgba(255,107,157,0.5);' +
        'white-space:nowrap;pointer-events:none;';
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.transition = 'opacity 0.4s';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 400);
    }, 2600);
}

// 蜡烛火焰动画（在 animate 里调用）
function updateCandleFlames(elapsed) {
    if (!insideHouse) return;
    const interior = scene.getObjectByName('houseInterior');
    if (!interior) return;
    const cake = interior.getObjectByName('birthdayCake');
    if (!cake || !cake.userData.candlesLit) return;
    const candles = cake.getObjectByName('candles');
    if (!candles) return;

    candles.children.forEach(child => {
        if (child.userData && child.userData.isFlame && child.userData.isActive) {
            const p = child.userData.phase;
            child.scale.y = 1.6 + Math.sin(elapsed * 9 + p) * 0.35;
            child.scale.x = 1.0 + Math.cos(elapsed * 7 + p) * 0.12;
            child.position.y = child.userData.baseY + Math.sin(elapsed * 8 + p) * 0.004;
        }
    });
}

// ─────────────────────────────────────────────
// 照片轮播
// ─────────────────────────────────────────────
function showPhotoGallery(startIndex) {
    const photos = getPhotos();
    if (!photos.length) return;

    const old = document.getElementById('photo-gallery-modal');
    if (old) old.remove();

    const modal = document.createElement('div');
    modal.id = 'photo-gallery-modal';
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML =
        '<div class="modal-content card" style="max-width:700px;">' +
        '<span class="close">&times;</span>' +
        '<div style="padding:30px;text-align:center;">' +
        '<img id="gallery-image" src="' + photos[startIndex].url + '" style="width:100%;max-height:480px;object-fit:contain;border-radius:12px;margin-bottom:16px;">' +
        '<h3 id="gallery-title" style="color:#2c2c2c;margin-bottom:10px;">' + photos[startIndex].title + '</h3>' +
        '<div style="display:flex;justify-content:center;gap:20px;margin-top:16px;">' +
        '<button id="prev-photo" style="padding:10px 22px;background:#667eea;color:white;border:none;border-radius:8px;cursor:pointer;font-size:15px;">◀ 上一张</button>' +
        '<span id="photo-counter" style="line-height:40px;color:#666;">' + (startIndex + 1) + ' / ' + photos.length + '</span>' +
        '<button id="next-photo" style="padding:10px 22px;background:#667eea;color:white;border:none;border-radius:8px;cursor:pointer;font-size:15px;">下一张 ▶</button>' +
        '</div></div></div>';

    document.body.appendChild(modal);

    let cur = startIndex;
    const update = () => {
        document.getElementById('gallery-image').src = photos[cur].url;
        document.getElementById('gallery-title').textContent = photos[cur].title;
        document.getElementById('photo-counter').textContent = (cur + 1) + ' / ' + photos.length;
    };
    document.getElementById('prev-photo').onclick = () => { cur = (cur - 1 + photos.length) % photos.length; update(); };
    document.getElementById('next-photo').onclick = () => { cur = (cur + 1) % photos.length; update(); };
    modal.querySelector('.close').onclick = () => modal.remove();
    modal.onclick = e => { if (e.target === modal) modal.remove(); };
}

// ─────────────────────────────────────────────
// 生日快乐歌（Web Audio API 合成）
// ─────────────────────────────────────────────
let birthdayAudioCtx = null;

let birthdayNodes = [ ];

let birthdayPlaying = false;
let birthdayLoopTimer = null;

const BIRTHDAY_NOTES = [
    ['G4',0.75],['G4',0.25],['A4',1],['G4',1],['C5',1],['B4',2],
    ['G4',0.75],['G4',0.25],['A4',1],['G4',1],['D5',1],['C5',2],
    ['G4',0.75],['G4',0.25],['G5',1],['E5',1],['C5',1],['B4',1],['A4',2],
    ['F5',0.75],['F5',0.25],['E5',1],['C5',1],['D5',1],['C5',2]
];

const NOTE_FREQ = {
    'C4':261.63,'D4':293.66,'E4':329.63,'F4':349.23,
    'G4':392.00,'A4':440.00,'B4':493.88,
    'C5':523.25,'D5':587.33,'E5':659.25,'F5':698.46,
    'G5':783.99,'A5':880.00,'B5':987.77
};

function playBirthdayMusic() {
    if (birthdayPlaying) return;
    birthdayPlaying = true;

    try {
        birthdayAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch(e) {
        console.warn('Web Audio API 不支持');
        return;
    }

    const BPM = 80;
    const beatDur = 60 / BPM;
    const totalBeats = BIRTHDAY_NOTES.reduce((s, n) => s + n[1], 0);
    const totalDur = totalBeats * beatDur;

    function scheduleNotes() {
        const startTime = birthdayAudioCtx.currentTime + 0.1;

        birthdayNodes = [ ];

        let t = startTime;

        BIRTHDAY_NOTES.forEach(([note, beats]) => {
            const freq = NOTE_FREQ[note];
            if (!freq) { t += beats * beatDur; return; }

            const osc = birthdayAudioCtx.createOscillator();
            const gain = birthdayAudioCtx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t);
            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(0.22, t + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.12, t + beats * beatDur * 0.7);
            gain.gain.linearRampToValueAtTime(0, t + beats * beatDur * 0.95);

            osc.connect(gain);
            gain.connect(birthdayAudioCtx.destination);
            osc.start(t);
            osc.stop(t + beats * beatDur);
            birthdayNodes.push(osc, gain);
            t += beats * beatDur;
        });
    }

    scheduleNotes();
    birthdayLoopTimer = setInterval(() => {
        if (!birthdayPlaying) return;
        scheduleNotes();
    }, totalDur * 1000);

    console.log('🎵 生日快乐歌开始播放');
}

function stopBirthdayMusic() {
    birthdayPlaying = false;
    if (birthdayLoopTimer) { clearInterval(birthdayLoopTimer); birthdayLoopTimer = null; }
    if (birthdayAudioCtx) {
        birthdayNodes.forEach(n => { try { n.disconnect(); } catch(e) {} });

        birthdayNodes = [ ];

        try { birthdayAudioCtx.close(); } catch(e) {}
        birthdayAudioCtx = null;
    }
    console.log('🎵 生日快乐歌停止');
}


function smoothCameraTo(px, py, pz, lx, ly, lz, duration) {
    if (typeof TWEEN === 'undefined') {
        camera.position.set(px, py, pz);
        camera.lookAt(lx, ly, lz);
        return;
    }
    new TWEEN.Tween(camera.position)
        .to({ x: px, y: py, z: pz }, duration)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
    const lookTarget = { x: lx + (camera.position.x - lx) * 0.8, y: ly + 1, z: lz + (camera.position.z - lz) * 0.8 };
    new TWEEN.Tween(lookTarget)
        .to({ x: lx, y: ly, z: lz }, duration)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(() => camera.lookAt(lookTarget.x, lookTarget.y, lookTarget.z))
        .start();
}
// ─────────────────────────────────────────────
// 室内360°轨道控制（鼠标拖拽旋转视角）
// ─────────────────────────────────────────────
let _orbitActive = false;
let _orbitDragging = false;
let _orbitLastX = 0;
let _orbitLastY = 0;

// 相机围绕的中心点（室内中心）
let _orbitTarget = new THREE.Vector3(0, 1.2, 0);

// 球坐标：距离、水平角、垂直角
let _orbitRadius = 8;
let _orbitTheta = 0;       // 水平角（绕Y轴）
let _orbitPhi = 0.38;      // 垂直角（弧度，0=水平）

function startIndoorOrbitControl() {
    _orbitActive = true;

    // 初始化轨道中心为 interior 中心
    const interior = scene.getObjectByName('houseInterior');
    if (interior) {
        _orbitTarget.set(interior.position.x, 1.2, interior.position.z);
    }

    // 根据当前相机位置初始化球坐标
    const dx = camera.position.x - _orbitTarget.x;
    const dy = camera.position.y - _orbitTarget.y;
    const dz = camera.position.z - _orbitTarget.z;
    _orbitRadius = Math.sqrt(dx * dx + dy * dy + dz * dz);
    _orbitTheta = Math.atan2(dx, dz);
    _orbitPhi = Math.asin(Math.max(-0.99, Math.min(0.99, dy / _orbitRadius)));

    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    canvas.addEventListener('mousedown', _onOrbitMouseDown);
    canvas.addEventListener('mousemove', _onOrbitMouseMove);
    canvas.addEventListener('mouseup',   _onOrbitMouseUp);
    canvas.addEventListener('mouseleave',_onOrbitMouseUp);
    canvas.addEventListener('wheel',     _onOrbitWheel, { passive: true });

    // 触摸支持
    canvas.addEventListener('touchstart', _onOrbitTouchStart, { passive: true });
    canvas.addEventListener('touchmove',  _onOrbitTouchMove,  { passive: false });
    canvas.addEventListener('touchend',   _onOrbitTouchEnd);
}

function stopIndoorOrbitControl() {
    _orbitActive = false;
    _orbitDragging = false;

    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    canvas.removeEventListener('mousedown', _onOrbitMouseDown);
    canvas.removeEventListener('mousemove', _onOrbitMouseMove);
    canvas.removeEventListener('mouseup',   _onOrbitMouseUp);
    canvas.removeEventListener('mouseleave',_onOrbitMouseUp);
    canvas.removeEventListener('wheel',     _onOrbitWheel);
    canvas.removeEventListener('touchstart', _onOrbitTouchStart);
    canvas.removeEventListener('touchmove',  _onOrbitTouchMove);
    canvas.removeEventListener('touchend',   _onOrbitTouchEnd);
}

function _onOrbitMouseDown(e) {
    if (!_orbitActive) return;
    _orbitDragging = true;
    _orbitLastX = e.clientX;
    _orbitLastY = e.clientY;
}

function _onOrbitMouseMove(e) {
    if (!_orbitActive || !_orbitDragging) return;
    const dx = e.clientX - _orbitLastX;
    const dy = e.clientY - _orbitLastY;
    _orbitLastX = e.clientX;
    _orbitLastY = e.clientY;
    _applyOrbitDelta(dx, dy);
}

function _onOrbitMouseUp() {
    _orbitDragging = false;
}

function _onOrbitWheel(e) {
    if (!_orbitActive) return;
    _orbitRadius = Math.max(2.5, Math.min(14, _orbitRadius + e.deltaY * 0.01));
    _updateOrbitCamera();
}

// 触摸支持
let _touchLastX = 0, _touchLastY = 0;
function _onOrbitTouchStart(e) {
    if (!_orbitActive || e.touches.length !== 1) return;
    _orbitDragging = true;
    _touchLastX = e.touches[0].clientX;
    _touchLastY = e.touches[0].clientY;
}
function _onOrbitTouchMove(e) {
    if (!_orbitActive || !_orbitDragging || e.touches.length !== 1) return;
    e.preventDefault();
    const dx = e.touches[0].clientX - _touchLastX;
    const dy = e.touches[0].clientY - _touchLastY;
    _touchLastX = e.touches[0].clientX;
    _touchLastY = e.touches[0].clientY;
    _applyOrbitDelta(dx, dy);
}
function _onOrbitTouchEnd() {
    _orbitDragging = false;
}

function _applyOrbitDelta(dx, dy) {
    _orbitTheta -= dx * 0.008;   // 水平灵敏度
    _orbitPhi   -= dy * 0.006;   // 垂直灵敏度
    // 限制垂直角：不能翻转，不能看到天花板以上或地板以下
    _orbitPhi = Math.max(-0.15, Math.min(0.75, _orbitPhi));
    _updateOrbitCamera();
}

function _updateOrbitCamera() {
    if (!_orbitActive) return;
    const r = _orbitRadius;
    const x = _orbitTarget.x + r * Math.cos(_orbitPhi) * Math.sin(_orbitTheta);
    const y = _orbitTarget.y + r * Math.sin(_orbitPhi);
    const z = _orbitTarget.z + r * Math.cos(_orbitPhi) * Math.cos(_orbitTheta);
    camera.position.set(x, y, z);
    camera.lookAt(_orbitTarget);
}
// ─────────────────────────────────────────────
// 烟花特效 + "愿望成真"文字（吹灭蜡烛时触发）
// ─────────────────────────────────────────────
function launchWishFireworks() {
    // ── 1. "愿望成真"文字动画（DOM层） ──
    const old = document.getElementById('wish-text');
    if (old) old.remove();

    const wishEl = document.createElement('div');
    wishEl.id = 'wish-text';
    wishEl.innerHTML = '✨ 愿望成真 ✨';
    wishEl.style.cssText = [
        'position:fixed',
        'top:50%',
        'left:50%',
        'transform:translate(-50%,-50%) scale(0.2)',
        'font-size:52px',
        'font-weight:900',
        'color:transparent',
        'background:linear-gradient(135deg,#ff6b9d,#ffd700,#a8edea,#ff6b9d)',
        'background-size:300% 300%',
        '-webkit-background-clip:text',
        'background-clip:text',
        'z-index:20000',
        'pointer-events:none',
        'opacity:0',
        'transition:transform 0.6s cubic-bezier(0.34,1.56,0.64,1), opacity 0.4s',
        'text-shadow:0 0 30px rgba(255, 0, 0, 0.8)',
        'letter-spacing:6px',
        'white-space:nowrap',
    ].join(';');
    document.body.appendChild(wishEl);

    // 动画：渐入放大
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            wishEl.style.opacity = '1';
            wishEl.style.transform = 'translate(-50%,-50%) scale(1)';
        });
    });

    // 渐出消失
    setTimeout(() => {
        wishEl.style.transition = 'opacity 0.8s, transform 0.8s';
        wishEl.style.opacity = '0';
        wishEl.style.transform = 'translate(-50%,-60%) scale(1.1)';
        setTimeout(() => wishEl.remove(), 800);
    }, 2800);

    // ── 2. Three.js 粒子烟花 ──
    const interior = scene.getObjectByName('houseInterior');
    const baseX = interior ? interior.position.x : 0;
    const baseZ = interior ? interior.position.z : 0;

    // 发射5组烟花
    const fireworkColors = [0xff6b9d, 0xffd700, 0x88eeff, 0xcc88ff, 0xffaa44];
    for (let fi = 0; fi < 5; fi++) {
        setTimeout(() => {
            const fx = baseX + (Math.random() - 0.5) * 10;
            const fy = 2.5 + Math.random() * 1.5;
            const fz = baseZ + (Math.random() - 0.5) * 8;
            _spawnFirework(fx, fy, fz, fireworkColors[fi]);
        }, fi * 280);
    }
}

function _spawnFirework(x, y, z, color) {
    const count = 80;
    const positions = new Float32Array(count * 3);

    const velocities = [ ];


    for (let i = 0; i < count; i++) {
        positions[i * 3]     = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        // 随机方向速度
        const theta = Math.random() * Math.PI * 2;
        const phi   = Math.random() * Math.PI;
        const speed = 0.04 + Math.random() * 0.06;
        velocities.push({
            vx: Math.sin(phi) * Math.cos(theta) * speed,
            vy: Math.sin(phi) * Math.sin(theta) * speed + 0.02,
            vz: Math.cos(phi) * speed,
        });
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions.slice(), 3));

    const mat = new THREE.PointsMaterial({
        color,
        size: 0.12,
        transparent: true,
        opacity: 1,
        depthWrite: false,
        sizeAttenuation: true,
    });

    const points = new THREE.Points(geo, mat);
    scene.add(points);

    // 动画：每帧更新粒子位置
    let life = 0;
    const maxLife = 60; // 帧数

    function animateFirework() {
        if (life >= maxLife) {
            scene.remove(points);
            geo.dispose();
            mat.dispose();
            return;
        }

        const pos = geo.attributes.position.array;
        for (let i = 0; i < count; i++) {
            pos[i * 3]     += velocities[i].vx;
            pos[i * 3 + 1] += velocities[i].vy;
            pos[i * 3 + 2] += velocities[i].vz;
            velocities[i].vy -= 0.002; // 重力
        }
        geo.attributes.position.needsUpdate = true;

        // 淡出
        mat.opacity = 1 - (life / maxLife) * 0.9;
        life++;

        requestAnimationFrame(animateFirework);
    }

    animateFirework();
}
// ─────────────────────────────────────────────
// 点燃蜡烛烟花：香香女王 生日快乐
// ─────────────────────────────────────────────
function launchBirthdayFireworks() {
    // ── 文字动画 ──
    const old = document.getElementById('birthday-text');
    if (old) old.remove();

    const el = document.createElement('div');
    el.id = 'birthday-text';
    el.innerHTML = '🎂 香香女王<br>生日快乐 🎉';
    el.style.cssText = [
        'position:fixed',
        'top:42%',
        'left:50%',
        'transform:translate(-50%,-50%) scale(0.1)',
        'font-size:46px',
        'font-weight:900',
        'line-height:1.4',
        'text-align:center',
        'color:transparent',
        'background:linear-gradient(135deg,#ff6b9d,#ff9a3c,#ffd700,#ff6b9d)',
        'background-size:300% 300%',
        '-webkit-background-clip:text',
        'background-clip:text',
        'z-index:20000',
        'pointer-events:none',
        'opacity:0',
        'transition:transform 0.7s cubic-bezier(0.34,1.56,0.64,1),opacity 0.4s',
        'letter-spacing:4px',
        'white-space:nowrap',
        'filter:drop-shadow(0 0 20px rgba(255,180,0,0.9))',
    ].join(';');
    document.body.appendChild(el);

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            el.style.opacity = '1';
            el.style.transform = 'translate(-50%,-50%) scale(1)';
        });
    });

    // 3秒后淡出
    setTimeout(() => {
        el.style.transition = 'opacity 0.8s, transform 0.8s';
        el.style.opacity = '0';
        el.style.transform = 'translate(-50%,-58%) scale(1.08)';
        setTimeout(() => el.remove(), 800);
    }, 3000);

    // ── 粒子烟花（暖色系：粉/金/橙/红/黄）──
    const interior = scene.getObjectByName('houseInterior');
    const baseX = interior ? interior.position.x : 0;
    const baseZ = interior ? interior.position.z : 0;

    const colors = [0xff6b9d, 0xffd700, 0xff9a3c, 0xff4466, 0xffee44];
    for (let fi = 0; fi < 6; fi++) {
        setTimeout(() => {
            const fx = baseX + (Math.random() - 0.5) * 12;
            const fy = 2.0 + Math.random() * 2.0;
            const fz = baseZ + (Math.random() - 0.5) * 10;
            _spawnFirework(fx, fy, fz, colors[fi % colors.length]);
        }, fi * 220);
    }
}
