// ==================== 健身器材区 ====================
// 右上角：单杠 + 双杠 + 哑铃架
// 使用直接 scene.add(mesh)，不使用 Group 嵌套

function createFitnessArea() {
    if (typeof scene === 'undefined' || !scene) {
        console.warn('fitness-area: scene 未就绪');
        return;
    }

    const metal   = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.3, metalness: 0.8 });
    const rubber  = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.9 });
    const chrome  = new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.2, metalness: 0.9 });

    // ─────────────────────────────────────────
    // 单杠（Pull-up Bar）中心 x=16, z=-19
    // ─────────────────────────────────────────
    const pbX = 16, pbZ = -19;

    // 左支柱
    addMesh(new THREE.CylinderGeometry(0.07, 0.07, 2.8, 8), metal, pbX - 0.9, 1.4, pbZ);
    // 右支柱
    addMesh(new THREE.CylinderGeometry(0.07, 0.07, 2.8, 8), metal, pbX + 0.9, 1.4, pbZ);
    // 横杆
    const bar1 = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 1.8, 8), chrome);
    bar1.rotation.z = Math.PI / 2;
    bar1.position.set(pbX, 2.7, pbZ);
    scene.add(bar1);
    // 底座 左
    addMesh(new THREE.BoxGeometry(0.25, 0.08, 0.25), rubber, pbX - 0.9, 0.04, pbZ);
    // 底座 右
    addMesh(new THREE.BoxGeometry(0.25, 0.08, 0.25), rubber, pbX + 0.9, 0.04, pbZ);

    // ─────────────────────────────────────────
    // 双杠（Parallel Bars）中心 x=19, z=-19
    // ─────────────────────────────────────────
    const ppX = 19, ppZ = -19;

    // 4 根竖支柱
    [[-0.55, -0.85], [-0.55, 0.85], [0.55, -0.85], [0.55, 0.85]].forEach(([dx, dz]) => {
        addMesh(new THREE.CylinderGeometry(0.055, 0.055, 1.6, 8), metal, ppX + dx, 0.8, ppZ + dz);
    });
    // 左扶手横杆
    const ppBar1 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.7, 8), chrome);
    ppBar1.rotation.x = Math.PI / 2;
    ppBar1.position.set(ppX - 0.55, 1.5, ppZ);
    scene.add(ppBar1);
    // 右扶手横杆
    const ppBar2 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.7, 8), chrome);
    ppBar2.rotation.x = Math.PI / 2;
    ppBar2.position.set(ppX + 0.55, 1.5, ppZ);
    scene.add(ppBar2);
    // 底座
    [[-0.55, -0.85], [-0.55, 0.85], [0.55, -0.85], [0.55, 0.85]].forEach(([dx, dz]) => {
        addMesh(new THREE.BoxGeometry(0.2, 0.07, 0.2), rubber, ppX + dx, 0.035, ppZ + dz);
    });

    // ─────────────────────────────────────────
    // 哑铃架（Dumbbell Rack）中心 x=22, z=-19
    // ─────────────────────────────────────────
    const dbX = 22, dbZ = -19;

    // 架子主体（立柱 + 横梁）
    addMesh(new THREE.BoxGeometry(0.1, 1.4, 0.1), metal, dbX - 0.7, 0.7, dbZ - 0.3);
    addMesh(new THREE.BoxGeometry(0.1, 1.4, 0.1), metal, dbX + 0.7, 0.7, dbZ - 0.3);
    addMesh(new THREE.BoxGeometry(0.1, 1.4, 0.1), metal, dbX - 0.7, 0.7, dbZ + 0.3);
    addMesh(new THREE.BoxGeometry(0.1, 1.4, 0.1), metal, dbX + 0.7, 0.7, dbZ + 0.3);
    // 底横梁
    addMesh(new THREE.BoxGeometry(1.5, 0.08, 0.7), metal, dbX, 0.04, dbZ);
    // 上横梁
    addMesh(new THREE.BoxGeometry(1.5, 0.08, 0.7), metal, dbX, 1.35, dbZ);
    // 中间搁板
    addMesh(new THREE.BoxGeometry(1.4, 0.06, 0.6), metal, dbX, 0.75, dbZ);

    // 哑铃（3对，从小到大）
    const weights = [
        { color: 0x3399ff, r: 0.10, h: 0.28, x: dbX - 0.45 },
        { color: 0x33cc66, r: 0.13, h: 0.30, x: dbX },
        { color: 0xff4444, r: 0.16, h: 0.32, x: dbX + 0.45 },
    ];
    weights.forEach(w => {
        const wMat = new THREE.MeshStandardMaterial({ color: w.color, roughness: 0.5 });
        // 手柄
        const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, w.h, 8), chrome);
        handle.rotation.z = Math.PI / 2;
        handle.position.set(w.x, 0.80, dbZ);
        scene.add(handle);
        // 左重片
        const pl = new THREE.Mesh(new THREE.CylinderGeometry(w.r, w.r, 0.05, 16), wMat);
        pl.rotation.z = Math.PI / 2;
        pl.position.set(w.x - w.h / 2 + 0.025, 0.80, dbZ);
        scene.add(pl);
        // 右重片
        const pr = new THREE.Mesh(new THREE.CylinderGeometry(w.r, w.r, 0.05, 16), wMat);
        pr.rotation.z = Math.PI / 2;
        pr.position.set(w.x + w.h / 2 - 0.025, 0.80, dbZ);
        scene.add(pr);
    });

    // 地垫
    const matGeo = new THREE.BoxGeometry(9, 0.04, 2.5);
    const matMat = new THREE.MeshStandardMaterial({ color: 0x2d6a4f, roughness: 0.95 });
    const mat = new THREE.Mesh(matGeo, matMat);
    mat.position.set(19, 0.02, -19);
    scene.add(mat);

    console.log('✅ 健身器材区创建完成');
}

// ─── 辅助函数：创建并添加 Mesh ───
function addMesh(geometry, material, x, y, z) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    scene.add(mesh);
    return mesh;
}
