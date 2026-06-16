// ==================== 多人种花 - Supabase版 ====================

const SUPABASE_URL = '你的Project URL';         // 如 https://xxx.supabase.co
const SUPABASE_KEY = '你的anon public key';     // eyJ开头的字符串

// ── 通用请求函数 ──
async function supabaseFetch(path, options) {
    const res = await fetch(SUPABASE_URL + path, {
        ...options,
        headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': 'Bearer ' + SUPABASE_KEY,
            'Content-Type': 'application/json',
            ...(options && options.headers)
        }
    });
    if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
    }
    // 204 No Content 不解析 JSON
    if (res.status === 204) return null;
    return res.json();
}

// ── 加载所有花朵 ──
async function loadPlantedFlowers() {
    try {
        const data = await supabaseFetch('/rest/v1/planted_flowers?select=*&order=created_at.asc&limit=500');
        if (data && data.length) {
            data.forEach(row => {
                createFlowerAt(row.x, row.z, row.name, row.message, row.color);
            });
            console.log(`✅ 加载了 ${data.length} 朵花`);
        }
    } catch(e) {
        console.warn('加载花朵失败，使用本地模式：', e.message);
        // 降级：从 localStorage 加载
        loadLocalFlowers();
    }
}

// ── 保存新花到云端 ──
async function savePlantedFlower(x, z, name, message, color) {
    try {
        await supabaseFetch('/rest/v1/planted_flowers', {
            method: 'POST',
            headers: { 'Prefer': 'return=minimal' },
            body: JSON.stringify({ x, z, name, message, color })
        });
        console.log('✅ 花朵已保存到云端');
    } catch(e) {
        console.warn('云端保存失败，改用本地：', e.message);
        // 降级：保存到 localStorage
        saveLocalFlower(x, z, name, message, color);
    }
}

// ── 本地降级方案 ──
function loadLocalFlowers() {
    try {

        const flowers = JSON.parse(localStorage.getItem('plantedFlowers') || '[ ]');

        flowers.forEach(f => createFlowerAt(f.x, f.z, f.name, f.message, f.color));
        console.log(`📦 本地加载了 ${flowers.length} 朵花`);
    } catch(e) {}
}

function saveLocalFlower(x, z, name, message, color) {
    try {

        const flowers = JSON.parse(localStorage.getItem('plantedFlowers') || '[ ]');

        flowers.push({ x, z, name, message, color, time: new Date().toLocaleString('zh-CN') });
        localStorage.setItem('plantedFlowers', JSON.stringify(flowers));
    } catch(e) {}
}

// ── 创建花朵3D模型 ──
function createFlowerAt(x, z, name, message, color) {
    if (typeof scene === 'undefined') return;

    const flower = new THREE.Group();
    flower.userData = { isPlantedFlower: true, name, message };

    const stemMat = new THREE.MeshStandardMaterial({ color: 0x228b22 });
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.035, 1.1, 6), stemMat);
    stem.position.y = 0.55;
    flower.add(stem);

    const petalMat = new THREE.MeshStandardMaterial({ color: color || 0xff69b4 });
    for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2;
        const petal = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 8), petalMat);
        petal.position.set(Math.cos(angle) * 0.18, 1.16, Math.sin(angle) * 0.18);
        petal.scale.y = 0.38;
        flower.add(petal);
    }

    const center = new THREE.Mesh(
        new THREE.SphereGeometry(0.14, 8, 8),
        new THREE.MeshStandardMaterial({ color: 0xffee00 })
    );
    center.position.y = 1.16;
    flower.add(center);

    flower.position.set(x, 0, z);
    flower.userData.swayPhase = Math.random() * Math.PI * 2;
    scene.add(flower);


    if (!window._plantedFlowers) window._plantedFlowers = [ ];

    window._plantedFlowers.push(flower);
}

// ── 摇摆动画 ──
function updatePlantedFlowers(elapsed) {
    if (!window._plantedFlowers) return;
    window._plantedFlowers.forEach(f => {
        if (typeof f.userData.swayPhase !== 'undefined') {
            f.rotation.z = Math.sin(elapsed * 1.5 + f.userData.swayPhase) * 0.08;
            f.position.y = Math.abs(Math.sin(elapsed * 2 + f.userData.swayPhase)) * 0.03;
        }
    });
}
