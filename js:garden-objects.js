// ==================== 花园互动物件 ====================

let gardenObjects = {}; // 存储所有可点击物件

// ─────────────────────────────────────────────
// 统一初始化（在 main.js 的 init() 里调用）
// ─────────────────────────────────────────────
function createGardenObjects() {
    createPinkSofa(8, -8);          // 粉色沙发
    createGrayCar(-8, 8);           // 灰色小汽车
    createWhiteMotorcycle(10, 8);   // 白色摩托车
    createRobotVacuum(-10, -8);     // 扫地机器人
}

// ─────────────────────────────────────────────
// 1. 粉色单人沙发（可坐）
// ─────────────────────────────────────────────
function createPinkSofa(x, z) {
    const group = new THREE.Group();
    group.name = 'pinkSofa';
    group.userData = { isSofa: true, bubble: '这是我们的爱椅女神 💕' };

    const pink  = new THREE.MeshStandardMaterial({ color: 0xff8fab, roughness: 0.7 });
    const lpink = new THREE.MeshStandardMaterial({ color: 0xffb3c6, roughness: 0.7 });
    const leg   = new THREE.MeshStandardMaterial({ color: 0xd4a96a, roughness: 0.5, metalness: 0.2 });

    // 座垫
    const seat = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.35, 1.2), pink);
    seat.position.y = 0.5;
    seat.castShadow = true;
    group.add(seat);

    // 靠背
    const back = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.0, 0.22), pink);
    back.position.set(0, 1.1, -0.49);
    back.castShadow = true;
    group.add(back);

    // 左扶手
    const armL = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.45, 1.2), lpink);
    armL.position.set(-0.7, 0.72, 0);
    group.add(armL);

    // 右扶手
    const armR = armL.clone();
    armR.position.x = 0.7;
    group.add(armR);

    // 靠背顶部圆弧装饰
    const topMat = new THREE.MeshStandardMaterial({ color: 0xff6b9d, roughness: 0.6 });
    const top = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 1.6, 12), topMat);
    top.rotation.z = Math.PI / 2;
    top.position.set(0, 1.62, -0.49);
    group.add(top);

    // 四条腿
    [[-0.62, -0.62], [0.62, -0.62], [-0.62, 0.42], [0.62, 0.42]].forEach(([lx, lz]) => {
        const l = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.32, 8), leg);
        l.position.set(lx, 0.16, lz);
        group.add(l);
    });

    // 抱枕
    const pillowMat = new THREE.MeshStandardMaterial({ color: 0xffd6e8, roughness: 0.8 });
    const pillow = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.38, 0.12), pillowMat);
    pillow.position.set(0.35, 0.85, -0.38);
    pillow.rotation.x = 0.15;
    group.add(pillow);

    group.position.set(x, 0, z);
    group.rotation.y = Math.PI / 6;
    scene.add(group);
    gardenObjects.sofa = group;

    // 坐下点位（沙发前方）
    group.userData.sitPos = new THREE.Vector3(x, 0, z + 1.2);
    group.userData.sitRotY = Math.PI; // 面朝沙发
}

// ─────────────────────────────────────────────
// 2. 灰色小汽车
// ─────────────────────────────────────────────
function createGrayCar(x, z) {
    const group = new THREE.Group();
    group.name = 'grayCar';
    group.userData = { isCar: true, bubble: '小零祝你生日快乐！🎂' };

    const body   = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.5, metalness: 0.4 });
    const glass  = new THREE.MeshStandardMaterial({ color: 0xadd8e6, transparent: true, opacity: 0.6, roughness: 0.1 });
    const wheel  = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.9 });
    const chrome = new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.8, roughness: 0.2 });

    // 车身下部
    const lower = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.6, 1.4), body);
    lower.position.y = 0.55;
    lower.castShadow = true;
    group.add(lower);

    // 车身上部（圆角感用缩小的box）
    const upper = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.55, 1.25), body);
    upper.position.set(-0.1, 1.1, 0);
    upper.castShadow = true;
    group.add(upper);

    // 挡风玻璃
    const windshield = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.48), glass);
    windshield.position.set(0.7, 1.1, 0);
    windshield.rotation.y = -Math.PI / 2 + 0.45;
    group.add(windshield);

    // 后窗
    const rearWindow = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.42), glass);
    rearWindow.position.set(-0.85, 1.1, 0);
    rearWindow.rotation.y = Math.PI / 2 + 0.3;
    group.add(rearWindow);

    // 四轮
    [[-1.0, -0.72], [-1.0, 0.72], [1.0, -0.72], [1.0, 0.72]].forEach(([wx, wz]) => {
        const w = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.22, 16), wheel);
        w.rotation.z = Math.PI / 2;
        w.position.set(wx, 0.28, wz);
        group.add(w);
        // 轮毂
        const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.24, 8), chrome);
        hub.rotation.z = Math.PI / 2;
        hub.position.set(wx, 0.28, wz);
        group.add(hub);
    });

    // 车头灯
    const lightMat = new THREE.MeshStandardMaterial({ color: 0xfffde7, emissive: 0xfffde7, emissiveIntensity: 0.5 });
    [0.5, -0.5].forEach(lz => {
        const headlight = new THREE.Mesh(new THREE.CircleGeometry(0.1, 12), lightMat);
        headlight.position.set(1.41, 0.68, lz);
        headlight.rotation.y = Math.PI / 2;
        group.add(headlight);
    });

    group.position.set(x, 0, z);
    group.rotation.y = -Math.PI / 5;
    scene.add(group);
    gardenObjects.car = group;
}

// ─────────────────────────────────────────────
// 3. 白色摩托车
// ─────────────────────────────────────────────
function createWhiteMotorcycle(x, z) {
    const group = new THREE.Group();
    group.name = 'whiteMoto';
    group.userData = { isMoto: true, bubble: '小包包祝你生日快乐！🎀' };

    const white  = new THREE.MeshStandardMaterial({ color: 0xf5f5f5, roughness: 0.4, metalness: 0.3 });
    const chrome = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.15 });
    const wheel  = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.9 });
    const seat   = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.8 });

    // 车架
    const frame = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.18, 0.22), chrome);
    frame.position.y = 0.62;
    group.add(frame);

    // 油箱/车身
    const tankBody = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.32, 0.38), white);
    tankBody.position.set(0.1, 0.82, 0);
    tankBody.castShadow = true;
    group.add(tankBody);

    // 座椅
    const seatMesh = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.12, 0.3), seat);
    seatMesh.position.set(-0.22, 0.92, 0);
    group.add(seatMesh);

    // 车头（整流罩）
    const fairing = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.36, 0.34), white);
    fairing.position.set(0.72, 0.78, 0);
    fairing.castShadow = true;
    group.add(fairing);

    // 车把
    const handlebar = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.6, 8), chrome);
    handlebar.rotation.z = Math.PI / 2;
    handlebar.position.set(0.6, 1.05, 0);
    group.add(handlebar);

    // 前轮
    const frontWheel = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.07, 8, 24), wheel);
    frontWheel.rotation.y = Math.PI / 2;
    frontWheel.position.set(0.85, 0.3, 0);
    group.add(frontWheel);

    // 后轮
    const rearWheel = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.07, 8, 24), wheel);
    rearWheel.rotation.y = Math.PI / 2;
    rearWheel.position.set(-0.75, 0.3, 0);
    group.add(rearWheel);

    // 排气管
    const exhaust = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.055, 0.7, 8), chrome);
    exhaust.rotation.z = Math.PI / 2;
    exhaust.position.set(-0.3, 0.45, -0.22);
    group.add(exhaust);

    // 车头灯
    const lightMat = new THREE.MeshStandardMaterial({ color: 0xfffde7, emissive: 0xfffde7, emissiveIntensity: 0.6 });
    const headlight = new THREE.Mesh(new THREE.CircleGeometry(0.08, 12), lightMat);
    headlight.position.set(0.87, 0.82, 0);
    headlight.rotation.y = Math.PI / 2;
    group.add(headlight);

    group.position.set(x, 0, z);
    group.rotation.y = Math.PI / 4;
    scene.add(group);
    gardenObjects.moto = group;
}

// ─────────────────────────────────────────────
// 4. 白色扫地机器人（自动巡逻）
// ─────────────────────────────────────────────
let robotAngle = 0;
let robotRadius = 6;
let robotCenterX = -6;
let robotCenterZ = -6;

function createRobotVacuum(x, z) {
    const group = new THREE.Group();
    group.name = 'robotVacuum';
    group.userData = { isRobot: true, bubble: '小圣祝你生日快乐！🤖💕' };

    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xf0f0f0, roughness: 0.4, metalness: 0.2 });
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.6 });
    const blueMat = new THREE.MeshStandardMaterial({ color: 0x4fc3f7, emissive: 0x4fc3f7, emissiveIntensity: 0.4 });
    const redMat  = new THREE.MeshStandardMaterial({ color: 0xff4444, emissive: 0xff4444, emissiveIntensity: 0.3 });

    // 机身（圆盘）
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.14, 32), bodyMat);
    body.position.y = 0.1;
    body.castShadow = true;
    group.add(body);

    // 顶部面板（深色）
    const panel = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.03, 32), darkMat);
    panel.position.y = 0.18;
    group.add(panel);

    // 蓝色感应条
    const sensor = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.05, 0.08), blueMat);
    sensor.position.set(0.2, 0.18, 0);
    group.add(sensor);

    // 电源按钮（红色圆点）
    const btn = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.04, 12), redMat);
    btn.position.set(-0.1, 0.2, 0.1);
    group.add(btn);

    // 底部小轮（装饰）
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.8 });
    [0.3, -0.3].forEach(wx => {
        const w = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.08, 10), wheelMat);
        w.rotation.z = Math.PI / 2;
        w.position.set(wx, 0.04, 0);
        group.add(w);
    });

    group.position.set(x, 0, z);
    scene.add(group);
    gardenObjects.robot = group;

    // 记录巡逻中心
    robotCenterX = x;
    robotCenterZ = z;
    robotRadius  = 4;
}

// 扫地机器人巡逻动画（在 main.js animate 里调用）
function updateRobotVacuum(elapsed) {
    if (!gardenObjects.robot) return;
    robotAngle = elapsed * 0.5; // 巡逻速度
    const rx = robotCenterX + Math.cos(robotAngle) * robotRadius;
    const rz = robotCenterZ + Math.sin(robotAngle) * robotRadius;
    gardenObjects.robot.position.set(rx, 0, rz);
    gardenObjects.robot.rotation.y = -robotAngle + Math.PI / 2;
}

// ─────────────────────────────────────────────
// 点击检测（在 onCanvasClick 里调用）
// ─────────────────────────────────────────────
function tryClickGardenObject(event) {
    if (typeof insideHouse !== 'undefined' && insideHouse) return false;

    raycaster.setFromCamera(mouse, camera);
    const objects = Object.values(gardenObjects);
    if (!objects.length) return false;

    const hits = raycaster.intersectObjects(objects, true);
    if (!hits.length) return false;

    // 向上找有 bubble 的父级
    let obj = hits[0].object;
    let depth = 0;
    while (obj && depth < 6) {
        if (obj.userData && obj.userData.bubble) {
            showSpeechBubble(obj.userData.bubble, obj, 3500);

            // 沙发特殊：让主角走过去坐下
        if (obj.userData.isSofa) {
            // 取沙发世界坐标，在沙发前方1.5单位作为目标点
            const sofaWorldPos = new THREE.Vector3();
            obj.getWorldPosition(sofaWorldPos);
            
            const sitTarget = new THREE.Vector3(
                sofaWorldPos.x,
                0,
                sofaWorldPos.z + 1.5
            );
            
            // ✅ 传 characters.mainGirl.model（不是整个对象）
            moveCharacterTo(characters.mainGirl.model, sitTarget);
            
            // 到达后转身面向沙发
            setTimeout(() => {
                if (characters.mainGirl && characters.mainGirl.model) {
                    characters.mainGirl.model.rotation.y = Math.PI;
                }
            }, 1900);
            return true;
        }
            
        }
        obj = obj.parent;
        depth++;
    }
    return false;
}

// 小狗点击气泡（在 onCanvasClick 里调用）
function tryClickDog(event) {
    if (typeof insideHouse !== 'undefined' && insideHouse) return false;
    if (!characters.dog || !characters.dog.model) return false;

    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObject(characters.dog.model, true);
    if (hits.length > 0) {
        showSpeechBubble('姐姐生日快乐！🐾🎂', characters.dog.model, 3000);
        return true;
    }
    return false;
}