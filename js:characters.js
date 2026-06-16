// ==================== 人物系统（修复版）====================

function createEnhancedCharacter(type, color, x, z, isMain) {
    const character = new THREE.Group();
    character.userData = {
        isMoving: false,
        walkPhase: 0,
        breathPhase: Math.random() * Math.PI * 2,
        isMain: isMain
    };

    // 身体
    const bodyMat = new THREE.MeshStandardMaterial({ color, roughness: 0.6, metalness: 0.05 });
    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.28, 1.0, 12, 20), bodyMat);
    body.position.y = 1.0;
    body.castShadow = true;
    character.add(body);
    character.userData.body = body;

    // 颈部
    const neck = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.12, 0.2, 8),
        new THREE.MeshStandardMaterial({ color: 0xffdbac, roughness: 0.5 })
    );
    neck.position.y = 1.65;
    character.add(neck);

    // ── 头部 Group（头 + 头发 + 五官全部挂在这里）──
    const headGroup = new THREE.Group();
    headGroup.position.y = 1.95;
    character.add(headGroup);
    character.userData.headGroup = headGroup;

    // 头皮
    const headMat = new THREE.MeshStandardMaterial({ color: 0xffdbac, roughness: 0.5 });
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.32, 20, 20), headMat);
    head.castShadow = true;
    headGroup.add(head);

   const hairMat = new THREE.MeshStandardMaterial({ color: 0x3d1c00, roughness: 0.8 });

    if (type === 'short') {
        // 短发外壳（只盖头顶，不往下盖脸）
        const hairShell = new THREE.Mesh(
            new THREE.SphereGeometry(0.34, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.52),
            //                                                              ↑ 0.65→0.52，只盖头顶一半
            hairMat
        );
        hairShell.position.y = 0.04;  // 往上移
        headGroup.add(hairShell);

        // 后脑补充（半球盖不到的后下方）
        const hairBack = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.20, 0.18), hairMat);
        hairBack.position.set(0, -0.10, -0.24);
        headGroup.add(hairBack);

        // 刘海
        const bangs = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.08, 0.07), hairMat);
        bangs.position.set(0, 0.18, 0.30);
        headGroup.add(bangs);

        // 左鬓角
        const leftBurn = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.18, 0.14), hairMat);
        leftBurn.position.set(-0.30, -0.08, 0.00);
        headGroup.add(leftBurn);

        // 右鬓角
        const rightBurn = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.18, 0.14), hairMat);
        rightBurn.position.set(0.30, -0.08, 0.00);
        headGroup.add(rightBurn);

    } else {
        // 长发外壳（只盖头顶）
        const hairShell = new THREE.Mesh(
            new THREE.SphereGeometry(0.34, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.52),
            hairMat
        );
        hairShell.position.y = 0.04;
        headGroup.add(hairShell);

        // 后脑补充
        const hairBack = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.20, 0.18), hairMat);
        hairBack.position.set(0, -0.10, -0.24);
        headGroup.add(hairBack);

        // 刘海
        const bangs = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.08, 0.07), hairMat);
        bangs.position.set(0, 0.18, 0.30);
        headGroup.add(bangs);

        // 长发（从头球背面垂下）
        const hairLong = new THREE.Mesh(new THREE.BoxGeometry(0.40, 1.20, 0.16), hairMat);
        hairLong.position.set(0, -0.50, -0.26);
        headGroup.add(hairLong);

        // 发尾
        const hairTip = new THREE.Mesh(new THREE.ConeGeometry(0.20, 0.38, 8), hairMat);
        hairTip.position.set(0, -1.18, -0.26);
        headGroup.add(hairTip);

        // 左侧发片（耳朵旁细条）
        const leftSide = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.60, 0.12), hairMat);
        leftSide.position.set(-0.30, -0.22, -0.12);
        headGroup.add(leftSide);

        // 右侧发片
        const rightSide = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.60, 0.12), hairMat);
        rightSide.position.set(0.30, -0.22, -0.12);
        headGroup.add(rightSide);
    }
    // ── 五官（也挂在 headGroup）──
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
    const eyeGeo = new THREE.SphereGeometry(0.048, 10, 10);
    const lEye = new THREE.Mesh(eyeGeo, eyeMat);
    lEye.position.set(-0.1, 0.03, 0.28);
    headGroup.add(lEye);
    const rEye = new THREE.Mesh(eyeGeo, eyeMat);
    rEye.position.set(0.1, 0.03, 0.28);
    headGroup.add(rEye);

    // 眼白高光
    const eyeHighMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const eyeHighGeo = new THREE.SphereGeometry(0.018, 6, 6);
    [-0.1, 0.1].forEach(ex => {
        const h = new THREE.Mesh(eyeHighGeo, eyeHighMat);
        h.position.set(ex + 0.02, 0.05, 0.3);
        headGroup.add(h);
    });

    // 嘴巴（微笑）
    const mouthMat = new THREE.MeshStandardMaterial({ color: 0xff6b9d });
    const mouth = new THREE.Mesh(
        new THREE.TorusGeometry(0.07, 0.018, 8, 16, Math.PI),
        mouthMat
    );
    mouth.position.set(0, -0.11, 0.3);
    mouth.rotation.x = Math.PI;
    headGroup.add(mouth);

    // ── 手臂 ──
    const armMat = new THREE.MeshStandardMaterial({ color: 0xffdbac, roughness: 0.6 });
    const armGeo = new THREE.CapsuleGeometry(0.085, 0.58, 8, 10);

    const lArm = new THREE.Mesh(armGeo, armMat);
    lArm.position.set(-0.38, 1.02, 0);
    lArm.castShadow = true;
    character.add(lArm);
    character.userData.leftArm = lArm;

    const rArm = new THREE.Mesh(armGeo, armMat);
    rArm.position.set(0.38, 1.02, 0);
    rArm.castShadow = true;
    character.add(rArm);
    character.userData.rightArm = rArm;

    // ── 腿 ──
    const legMat = new THREE.MeshStandardMaterial({ color, roughness: 0.6 });
    const legGeo = new THREE.CapsuleGeometry(0.1, 0.65, 8, 10);

    const lLeg = new THREE.Mesh(legGeo, legMat);
    lLeg.position.set(-0.14, 0.42, 0);
    lLeg.castShadow = true;
    character.add(lLeg);
    character.userData.leftLeg = lLeg;

    const rLeg = new THREE.Mesh(legGeo, legMat);
    rLeg.position.set(0.14, 0.42, 0);
    rLeg.castShadow = true;
    character.add(rLeg);
    character.userData.rightLeg = rLeg;

    // ── 鞋子 ──
    const shoeMat = new THREE.MeshStandardMaterial({ color: 0x2c2c2c, roughness: 0.5 });
    const shoeGeo = new THREE.BoxGeometry(0.17, 0.1, 0.27);

    const lShoe = new THREE.Mesh(shoeGeo, shoeMat);
    lShoe.position.set(-0.14, 0.05, 0.04);
    lShoe.castShadow = true;
    character.add(lShoe);
    character.userData.leftShoe = lShoe;

    const rShoe = new THREE.Mesh(shoeGeo, shoeMat);
    rShoe.position.set(0.14, 0.05, 0.04);
    rShoe.castShadow = true;
    character.add(rShoe);
    character.userData.rightShoe = rShoe;

    character.position.set(x, 0, z);
    scene.add(character);

    return {
        model: character,
        position: character.position,
        rotation: character.rotation,
        userData: character.userData
    };
}

// ── 走路动画（修复：只移动 headGroup，头发跟随）──
function updateWalkAnimation(character, delta) {
    if (!character.model) return;
    const ud = character.userData;
    const cd = character.model.userData;

    if (ud.isMoving) {
        ud.walkPhase += delta * 9;
        const swing  = Math.sin(ud.walkPhase) * 0.38;
        const bounce = Math.abs(Math.sin(ud.walkPhase)) * 0.07;

        // 手臂
        if (cd.leftArm)   cd.leftArm.rotation.x   =  swing;
        if (cd.rightArm)  cd.rightArm.rotation.x   = -swing;
        // 腿
        if (cd.leftLeg)   cd.leftLeg.rotation.x    = -swing * 0.55;
        if (cd.rightLeg)  cd.rightLeg.rotation.x   =  swing * 0.55;
        // 鞋
        if (cd.leftShoe)  cd.leftShoe.rotation.x   = -swing * 0.25;
        if (cd.rightShoe) cd.rightShoe.rotation.x  =  swing * 0.25;
        // 身体上下
        if (cd.body)      cd.body.position.y = 1.0 + bounce;
        // 头部 Group 整体上下（头发一起跟着动，不再秃顶）
        if (cd.headGroup) {
            cd.headGroup.position.y = 1.95 + bounce;
            cd.headGroup.rotation.z = Math.sin(ud.walkPhase * 0.5) * 0.04;
        }

    } else {
        // 待机呼吸
        ud.breathPhase += delta * 1.8;
        const breathe = Math.sin(ud.breathPhase) * 0.018;
        if (cd.body) cd.body.scale.y = 1 + breathe;

        // 平滑回正
        if (cd.leftArm)   cd.leftArm.rotation.x   *= 0.88;
        if (cd.rightArm)  cd.rightArm.rotation.x   *= 0.88;
        if (cd.leftLeg)   cd.leftLeg.rotation.x    *= 0.88;
        if (cd.rightLeg)  cd.rightLeg.rotation.x   *= 0.88;
        if (cd.leftShoe)  cd.leftShoe.rotation.x   *= 0.88;
        if (cd.rightShoe) cd.rightShoe.rotation.x  *= 0.88;
        if (cd.headGroup) cd.headGroup.rotation.z  *= 0.88;
    }
}

// ── 小狗 ──
function createEnhancedDog(x, z) {
    const dog = new THREE.Group();
    dog.userData = { isMoving: false, walkPhase: 0 };

    const mat     = new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.7 });
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });

    const body = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.4, 0.5), mat);
    body.position.y = 0.5;
    body.castShadow = true;
    dog.add(body);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 16), mat);
    head.position.set(0.52, 0.62, 0);
    head.castShadow = true;
    dog.add(head);

    const earGeo = new THREE.ConeGeometry(0.11, 0.22, 8);
    const lEar = new THREE.Mesh(earGeo, mat);
    lEar.position.set(0.47, 0.82, -0.14);
    lEar.rotation.z = -0.4;
    dog.add(lEar);
    const rEar = new THREE.Mesh(earGeo, mat);
    rEar.position.set(0.47, 0.82, 0.14);
    rEar.rotation.z = 0.4;
    dog.add(rEar);

    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), darkMat);
    nose.position.set(0.73, 0.62, 0);
    dog.add(nose);

    [-0.1, 0.1].forEach(ez => {
        const eye = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), darkMat);
        eye.position.set(0.68, 0.68, ez);
        dog.add(eye);
    });

    const legGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.38, 8);
    [[0.28,0.19,0.19],[0.28,0.19,-0.19],[-0.28,0.19,0.19],[-0.28,0.19,-0.19]].forEach(p => {
        const leg = new THREE.Mesh(legGeo, mat);
        leg.position.set(...p);
        leg.castShadow = true;
        dog.add(leg);
    });



    dog.position.set(x, 0, z);
    scene.add(dog);

    return {
        model: dog,
        position: dog.position,
        rotation: dog.rotation,
        userData: dog.userData
    };
}

// ── 跟随AI ──
class FollowerAI {
    constructor(follower, target, distance, speed) {
        this.follower = follower;
        this.target   = target;
        this.followDistance = distance;
        this.speed    = speed;
    }

    update() {
        const tp   = this.target.position;
        const fp   = this.follower.position;
        const dx   = tp.x - fp.x;
        const dz   = tp.z - fp.z;
        const dist = Math.sqrt(dx * dx + dz * dz);

        if (dist > this.followDistance) {
            fp.x += (dx / dist) * this.speed;
            fp.z += (dz / dist) * this.speed;
            this.follower.rotation.y    = Math.atan2(dx, dz);
            this.follower.userData.isMoving = true;
        } else {
            this.follower.userData.isMoving = false;
        }
    }
}