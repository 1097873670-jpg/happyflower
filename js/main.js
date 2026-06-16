// ==================== 主逻辑（修复版）====================

let scene, camera, renderer, raycaster, mouse;
let characters = {};
let clawMachine, ferrisWheel, house;
let clock = new THREE.Clock();
let petalParticles, fireflyParticles;

let followers = [ ];


function init() {
    // ── 场景 ──
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);
    scene.fog = new THREE.FogExp2(0x87CEEB, 0.011);

    // ── 相机 ──
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 14, 22);
    camera.lookAt(0, 0, 0);

    // ── 渲染器 ──
    const canvas = document.getElementById('canvas3d');
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // ── 光照 ──
    scene.add(new THREE.AmbientLight(0xffffff, 0.55));

    const sun = new THREE.DirectionalLight(0xfff4e0, 0.75);
    sun.position.set(18, 30, 18);
    sun.castShadow = true;
    sun.shadow.mapSize.width = 2048;
    sun.shadow.mapSize.height = 2048;
    sun.shadow.camera.left = -45;
    sun.shadow.camera.right = 45;
    sun.shadow.camera.top = 45;
    sun.shadow.camera.bottom = -45;
    scene.add(sun);

    // ✅ 修复：先创建 Light，再设置位置，再 add（不能链式调用 .position.set 后直接 add）
    const fillLight = new THREE.DirectionalLight(0xb0d8e6, 0.28);
    fillLight.position.set(-12, 12, -12);
    scene.add(fillLight);

    // ── 地面 ──
    const groundGeo = new THREE.PlaneGeometry(65, 65, 32, 32);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x78c84a, roughness: 0.92 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    ground.name = 'ground';
    const gp = ground.geometry.attributes.position;
    for (let i = 0; i < gp.count; i++) gp.setZ(i, Math.random() * 0.12);
    gp.needsUpdate = true;
    ground.geometry.computeVertexNormals();
    scene.add(ground);

    // ── 树 ──
    [[-22,-22],[-22,22],[22,-22],[22,22],[-26,0],[26,0],[0,-26],[0,26],[-14,-8],[14,8]].forEach(([x, z]) => {
        const t = new THREE.Group();
        const trunk = new THREE.Mesh(
            new THREE.CylinderGeometry(0.24, 0.36, 3.6, 8),
            new THREE.MeshStandardMaterial({ color: 0x7a4010, roughness: 0.9 })
        );
        trunk.position.y = 1.8;
        trunk.castShadow = true;
        t.add(trunk);
        const crown = new THREE.Mesh(
            new THREE.SphereGeometry(2.0, 9, 9),
            new THREE.MeshStandardMaterial({ color: 0x228b22, roughness: 0.85 })
        );
        crown.position.y = 4.4;
        crown.castShadow = true;
        t.add(crown);
        t.position.set(x, 0, z);
        scene.add(t);
    });

    // ── 花朵 ──
    const petalColors = [0xff69b4, 0xffd700, 0xff6347, 0x9370db, 0xff1493, 0xffa500, 0xffffff];
    for (let i = 0; i < 90; i++) {
        const fx = (Math.random() - 0.5) * 55;
        const fz = (Math.random() - 0.5) * 55;
        if (Math.abs(fx) < 9 && Math.abs(fz) < 9) continue;
        const flower = new THREE.Group();
        const stem = new THREE.Mesh(
            new THREE.CylinderGeometry(0.013, 0.018, 0.55, 4),
            new THREE.MeshStandardMaterial({ color: 0x228b22 })
        );
        stem.position.y = 0.275;
        flower.add(stem);
        const pc = petalColors[Math.floor(Math.random() * petalColors.length)];
        const pMat = new THREE.MeshStandardMaterial({ color: pc });
        for (let j = 0; j < 5; j++) {
            const p = new THREE.Mesh(new THREE.SphereGeometry(0.11, 6, 6), pMat);
            const a = (j / 5) * Math.PI * 2;
            p.position.set(Math.cos(a) * 0.09, 0.58, Math.sin(a) * 0.09);
            p.scale.y = 0.38;
            flower.add(p);
        }
        const center = new THREE.Mesh(
            new THREE.SphereGeometry(0.07, 6, 6),
            new THREE.MeshStandardMaterial({ color: 0xffee00 })
        );
        center.position.y = 0.58;
        flower.add(center);
        flower.position.set(fx, 0, fz);
        scene.add(flower);
    }

    // ── 角色 ──
    characters.mainGirl = createEnhancedCharacter('long', 0xc97dd4, 0, 0, true);
    characters.followerGirl = createEnhancedCharacter('short', 0xff85a1, -2, 0, false);
    characters.dog = createEnhancedDog(2, 0);

    followers.push(new FollowerAI(
        characters.followerGirl, characters.mainGirl,
        CONFIG.followDistance.followerGirl,
        CONFIG.followSpeed.followerGirl
    ));
    followers.push(new FollowerAI(
        characters.dog, characters.mainGirl,
        CONFIG.followDistance.dog,
        CONFIG.followSpeed.dog
    ));

    // ── 建筑 ──
    clawMachine = createClawMachine(13, 2);
    ferrisWheel = createFerrisWheel(-17, 2);
    house = createTwoStoryHouse(-10, -12);

    // ── 别墅内部 ──
    if (typeof house !== 'undefined' && house && house.position) {
        createHouseInterior(house.position);
    } else {
        console.error('❌ house 对象不存在，无法创建室内场景');
    }

    // ✅ 健身区：在 scene 创建完成、建筑之后调用
    if (typeof createFitnessArea === 'function') {
        try {
            createFitnessArea();
        } catch(e) {
            console.warn('健身区创建失败:', e);
        }
    }

    // ── 心形玫瑰花园 ──
    if (typeof createHeartRoseGarden === 'function') {
        createHeartRoseGarden();
        // 创建花园物件
         createGardenObjects();
    }

    // ── 粒子 ──
    petalParticles = createPetalParticles();
    scene.add(petalParticles);
    fireflyParticles = createFireflyParticles();
    scene.add(fireflyParticles);

    // ── 音乐 ──
    setupBackgroundMusic();

    // ── 事件 ──
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    canvas.addEventListener('click', onCanvasClick);
    canvas.addEventListener('mousemove', onMouseMove);
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    // ── 加载已种植的花朵 ──
    if (typeof loadPlantedFlowers === 'function') {
        loadPlantedFlowers();
    }

    setTimeout(() => {
        document.getElementById('loading').style.display = 'none';
    }, 1200);
    // 初始化室外触摸旋转
    initGardenOrbitControl();
    animate();
}

function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    const elapsed = clock.getElapsedTime();

    TWEEN.update();

    updateClawGame();

    followers.forEach(f => f.update());
    Object.values(characters).forEach(c => updateWalkAnimation(c, delta));

    // 蜡烛火焰跳动
    if (typeof updateCandleFlames === 'function') {
        updateCandleFlames(elapsed);
    }

    // 蛋糕近景检测
    if (typeof updateCakeCloseUp === 'function') {
        updateCakeCloseUp();
    }

    rotateFerrisWheel(ferrisWheel);
    updateClawMachine(clawMachine);
    updateParticles(petalParticles);
    updateParticles(fireflyParticles, 26);

    if (typeof updatePlantedFlowers === 'function') {
        updatePlantedFlowers(elapsed);
    }

    if (typeof updateRoseGarden === 'function') {
        updateRoseGarden(elapsed);
    }
    // 扫地机器人巡逻
    if (typeof updateRobotVacuum === 'function') 
        updateRobotVacuum(elapsed);

    // UI 距离检测
    if (characters.mainGirl && !clawGameActive) {
        const ed = characters.mainGirl.position.distanceTo(clawMachine.position);
        document.getElementById('claw-ui').style.display = ed < 3.5 ? 'block' : 'none';
        const fd = characters.mainGirl.position.distanceTo(ferrisWheel.position);
        document.getElementById('ferris-ui').style.display = fd < 9 ? 'block' : 'none';
    }

    renderer.render(scene, camera);
}

window.addEventListener('load', init);
// ==================== 室外场景触摸/鼠标旋转视角 ====================

let _gardenOrbit = {
    active: true,
    dragging: false,
    lastX: 0,
    lastY: 0,
    theta: 0,       // 水平角
    phi: 0.55,      // 垂直角
    radius: 26,     // 相机距离
    target: new THREE.Vector3(0, 2, 0),  // 看向场景中心
    pinchDist: 0    // 双指缩放距离
};

function initGardenOrbitControl() {
    const canvas = document.getElementById('canvas3d');
    if (!canvas) return;

    // 初始化球坐标（根据初始相机位置）
    _gardenOrbit.theta = 0;
    _gardenOrbit.phi = 0.55;
    _gardenOrbit.radius = 26;

    // ── 鼠标 ──
    canvas.addEventListener('mousedown', _gardenMouseDown);
    canvas.addEventListener('mousemove', _gardenMouseMove);
    canvas.addEventListener('mouseup',   _gardenMouseUp);
    canvas.addEventListener('mouseleave',_gardenMouseUp);
    canvas.addEventListener('wheel',     _gardenWheel, { passive: true });

    // ── 触摸 ──
    canvas.addEventListener('touchstart', _gardenTouchStart, { passive: true });
    canvas.addEventListener('touchmove',  _gardenTouchMove,  { passive: false });
    canvas.addEventListener('touchend',   _gardenTouchEnd);
}

function _gardenMouseDown(e) {
    if (!_gardenOrbit.active || typeof insideHouse !== 'undefined' && insideHouse) return;
    if (clawGameActive) return;
    _gardenOrbit.dragging = true;
    _gardenOrbit.lastX = e.clientX;
    _gardenOrbit.lastY = e.clientY;
}

function _gardenMouseMove(e) {
    if (!_gardenOrbit.dragging) return;
    const dx = e.clientX - _gardenOrbit.lastX;
    const dy = e.clientY - _gardenOrbit.lastY;
    _gardenOrbit.lastX = e.clientX;
    _gardenOrbit.lastY = e.clientY;
    _applyGardenOrbit(dx, dy);
}

function _gardenMouseUp() {
    _gardenOrbit.dragging = false;
}

function _gardenWheel(e) {
    if (!_gardenOrbit.active || typeof insideHouse !== 'undefined' && insideHouse) return;
    _gardenOrbit.radius = THREE.MathUtils.clamp(
        _gardenOrbit.radius + e.deltaY * 0.05, 8, 50
    );
    _updateGardenCamera();
}

// ── 触摸事件 ──
function _gardenTouchStart(e) {
    if (!_gardenOrbit.active || typeof insideHouse !== 'undefined' && insideHouse) return;
    if (clawGameActive) return;
    if (e.touches.length === 1) {
        _gardenOrbit.dragging = true;
        _gardenOrbit.lastX = e.touches[0].clientX;
        _gardenOrbit.lastY = e.touches[0].clientY;
    } else if (e.touches.length === 2) {
        // 双指缩放起始距离
        _gardenOrbit.pinchDist = _getTouchDist(e.touches);
    }
}

function _gardenTouchMove(e) {
    if (!_gardenOrbit.active || typeof insideHouse !== 'undefined' && insideHouse) return;
    if (clawGameActive) return;

    if (e.touches.length === 1 && _gardenOrbit.dragging) {
        e.preventDefault();
        const dx = e.touches[0].clientX - _gardenOrbit.lastX;
        const dy = e.touches[0].clientY - _gardenOrbit.lastY;
        _gardenOrbit.lastX = e.touches[0].clientX;
        _gardenOrbit.lastY = e.touches[0].clientY;
        _applyGardenOrbit(dx, dy);
    } else if (e.touches.length === 2) {
        e.preventDefault();
        const dist = _getTouchDist(e.touches);
        const delta = _gardenOrbit.pinchDist - dist;
        _gardenOrbit.radius = THREE.MathUtils.clamp(
            _gardenOrbit.radius + delta * 0.05, 8, 50
        );
        _gardenOrbit.pinchDist = dist;
        _updateGardenCamera();
    }
}

function _gardenTouchEnd() {
    _gardenOrbit.dragging = false;
}

function _getTouchDist(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
}

function _applyGardenOrbit(dx, dy) {
    _gardenOrbit.theta -= dx * 0.006;
    _gardenOrbit.phi   -= dy * 0.004;
    // 限制垂直角：不能翻转，不能看到地面以下
    _gardenOrbit.phi = THREE.MathUtils.clamp(_gardenOrbit.phi, 0.15, 1.2);
    _updateGardenCamera();
}

function _updateGardenCamera() {
    if (typeof insideHouse !== 'undefined' && insideHouse) return;
    if (clawGameActive) return;
    const r   = _gardenOrbit.radius;
    const phi = _gardenOrbit.phi;
    const theta = _gardenOrbit.theta;
    camera.position.set(
        _gardenOrbit.target.x + r * Math.cos(phi) * Math.sin(theta),
        _gardenOrbit.target.y + r * Math.sin(phi),
        _gardenOrbit.target.z + r * Math.cos(phi) * Math.cos(theta)
    );
    camera.lookAt(_gardenOrbit.target);
}
