// ==================== 心形红玫瑰花园 ====================

// 创建心形红玫瑰花园
function createHeartRoseGarden() {
    const roseGarden = new THREE.Group();
    roseGarden.name = 'heartRoseGarden';
    
    // 心形参数方程生成点位
    const heartPoints = generateHeartPoints(60);  // 60朵玫瑰
    
    // 玫瑰颜色渐变（深红到粉红）
    const roseColors = [
        0x8b0000,  // 深红
        0xdc143c,  // 猩红
        0xff0000,  // 正红
        0xff1493,  // 深粉
        0xff69b4   // 粉红
    ];
    
    heartPoints.forEach((point, index) => {
        // 随机选择颜色
        const color = roseColors[Math.floor(Math.random() * roseColors.length)];
        const rose = createRose(color);
        rose.position.set(point.x, 0, point.z);
        rose.userData.swayPhase = Math.random() * Math.PI * 2;
        roseGarden.add(rose);
    });
    
    // 放在花园中央显眼位置（稍微偏左，避开建筑物）
    roseGarden.position.set(-5, 0, 5);
    scene.add(roseGarden);
    
    return roseGarden;
}

// 生成心形点位（参数方程）
function generateHeartPoints(count) {

    const points = [ ];

    const scale = 3;  // 心形大小
    
    for (let i = 0; i < count; i++) {
        const t = (i / count) * Math.PI * 2;
        
        // 心形参数方程
        const x = scale * 16 * Math.pow(Math.sin(t), 3);
        const y = scale * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        
        // 转换为3D坐标（y变成z，因为是平面）
        points.push({
            x: x / 16,  // 缩放到合适大小
            z: -y / 16  // 负号让心形正向
        });
    }
    
    return points;
}

// 创建单朵玫瑰
function createRose(color) {
    const rose = new THREE.Group();
    
    // 花茎（绿色）
    const stemMat = new THREE.MeshStandardMaterial({ 
        color: 0x2d5016,  // 深绿色
        roughness: 0.8 
    });
    const stem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.025, 0.8, 8),
        stemMat
    );
    stem.position.y = 0.4;
    stem.castShadow = true;
    rose.add(stem);
    
    // 叶子（2片）
    const leafMat = new THREE.MeshStandardMaterial({ 
        color: 0x228b22,
        roughness: 0.7 
    });
    
    [-0.3, 0.3].forEach((yPos, i) => {
        const leaf = new THREE.Mesh(
            new THREE.BoxGeometry(0.15, 0.08, 0.05),
            leafMat
        );
        leaf.position.set(i === 0 ? -0.08 : 0.08, yPos, 0);
        leaf.rotation.z = i === 0 ? -0.5 : 0.5;
        leaf.castShadow = true;
        rose.add(leaf);
    });
    
    // 玫瑰花苞（多层花瓣）
    const roseMat = new THREE.MeshStandardMaterial({ 
        color: color,
        roughness: 0.5,
        metalness: 0.1
    });
    
    // 外层花瓣（6瓣）
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const petal = new THREE.Mesh(
            new THREE.SphereGeometry(0.12, 8, 8),
            roseMat
        );
        petal.position.set(
            Math.cos(angle) * 0.12,
            0.82,
            Math.sin(angle) * 0.12
        );
        petal.scale.set(1, 0.6, 0.8);
        petal.rotation.y = angle;
        petal.castShadow = true;
        rose.add(petal);
    }
    
    // 中层花瓣（5瓣，稍小）
    for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2 + 0.3;
        const petal = new THREE.Mesh(
            new THREE.SphereGeometry(0.1, 8, 8),
            roseMat
        );
        petal.position.set(
            Math.cos(angle) * 0.08,
            0.88,
            Math.sin(angle) * 0.08
        );
        petal.scale.set(1, 0.6, 0.8);
        petal.rotation.y = angle;
        petal.castShadow = true;
        rose.add(petal);
    }
    
    // 内层花瓣（4瓣，最小）
    for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2;
        const petal = new THREE.Mesh(
            new THREE.SphereGeometry(0.08, 8, 8),
            roseMat
        );
        petal.position.set(
            Math.cos(angle) * 0.04,
            0.94,
            Math.sin(angle) * 0.04
        );
        petal.scale.set(1, 0.7, 0.8);
        petal.rotation.y = angle;
        petal.castShadow = true;
        rose.add(petal);
    }
    
    // 花心（深色）
    const centerMat = new THREE.MeshStandardMaterial({ 
        color: 0x4a0000,
        roughness: 0.8
    });
    const center = new THREE.Mesh(
        new THREE.SphereGeometry(0.05, 8, 8),
        centerMat
    );
    center.position.y = 0.98;
    center.castShadow = true;
    rose.add(center);
    
    return rose;
}

// 更新玫瑰花园动画（轻微摇摆）
function updateRoseGarden(elapsed) {
    const roseGarden = scene.getObjectByName('heartRoseGarden');
    if (!roseGarden) return;
    
    roseGarden.children.forEach(rose => {
        if (rose.userData.swayPhase !== undefined) {
            rose.userData.swayPhase += 0.015;
            rose.rotation.z = Math.sin(rose.userData.swayPhase) * 0.04;
            rose.rotation.x = Math.cos(rose.userData.swayPhase * 0.8) * 0.03;
        }
    });
}
