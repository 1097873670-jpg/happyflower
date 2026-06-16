// ==================== 互动留言花园（Supabase多人版）====================

// ✅ 填入你的 Supabase 配置
const SUPABASE_URL = 'https://grtvkhynvnzktjbwdiir.supabase.co/rest/v1/';      // 如 https://xxx.supabase.co
const SUPABASE_KEY = 'sb_publishable_9WSmB5E23b7C_XmyMGoi1A_zaBv8XSP';  // eyJ 开头


let clickHistory = [ ];

const TRIPLE_CLICK_THRESHOLD = 800;
const CLICK_DISTANCE_THRESHOLD = 2;

// ─────────────────────────────────────────────
// Supabase 请求封装
// ─────────────────────────────────────────────
async function supabaseFetch(path, options) {
    try {
        const res = await fetch(SUPABASE_URL + path, {
            ...options,
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': 'Bearer ' + SUPABASE_KEY,
                'Content-Type': 'application/json',
                ...(options && options.headers)
            }
        });
        if (res.status === 204) return null;
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    } catch(e) {
        throw e;
    }
}

// ─────────────────────────────────────────────
// 加载所有花朵（优先云端，降级本地）
// ─────────────────────────────────────────────
async function loadPlantedFlowers() {
    try {
        const data = await supabaseFetch(
            '/rest/v1/planted_flowers?select=*&order=created_at.asc&limit=500'
        );
        if (data && data.length) {
            data.forEach(row => createPlantedFlower({
                x: row.x, z: row.z,
                name: row.name, message: row.message,
                color: row.color,
                timestamp: new Date(row.created_at).getTime()
            }));
            console.log(`✅ 云端加载了 ${data.length} 朵花`);
        }
    } catch(e) {
        console.warn('云端加载失败，使用本地数据：', e.message);
        _loadLocalFlowers();
    }
}

// ─────────────────────────────────────────────
// 保存花朵（优先云端，降级本地）
// ─────────────────────────────────────────────
async function savePlantedFlowers(flowerData) {
    try {
        await supabaseFetch('/rest/v1/planted_flowers', {
            method: 'POST',
            headers: { 'Prefer': 'return=minimal' },
            body: JSON.stringify({
                x: flowerData.x,
                z: flowerData.z,
                name: flowerData.name,
                message: flowerData.message,
                color: flowerData.color
            })
        });
        console.log('✅ 花朵已保存到云端');
    } catch(e) {
        console.warn('云端保存失败，改用本地：', e.message);
        _saveLocalFlower(flowerData);
    }
}

// ─────────────────────────────────────────────
// 本地降级
// ─────────────────────────────────────────────
function _loadLocalFlowers() {
    try {

        const saved = JSON.parse(localStorage.getItem('plantedFlowers') || '[ ]');

        saved.forEach(f => createPlantedFlower(f));
        console.log(`📦 本地加载了 ${saved.length} 朵花`);
    } catch(e) {}
}

function _saveLocalFlower(flowerData) {
    try {

        const saved = JSON.parse(localStorage.getItem('plantedFlowers') || '[ ]');

        saved.push(flowerData);
        localStorage.setItem('plantedFlowers', JSON.stringify(saved));
    } catch(e) {}
}

// ─────────────────────────────────────────────
// 创建花朵 3D 模型
// ─────────────────────────────────────────────
function createPlantedFlower(flowerData) {
    const flower = new THREE.Group();
    flower.userData = {
        isPlantedFlower: true,
        name: flowerData.name,
        message: flowerData.message,
        color: flowerData.color,
        timestamp: flowerData.timestamp,
        swayPhase: Math.random() * Math.PI * 2
    };

    // 花茎
    const stemMat = new THREE.MeshStandardMaterial({ color: 0x228b22 });
    const stem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.03, 0.04, 1.2, 8),
        stemMat
    );
    stem.position.y = 0.6;
    flower.add(stem);

    // 花瓣（5瓣）
    const petalMat = new THREE.MeshStandardMaterial({ color: flowerData.color, roughness: 0.6 });
    for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2;
        const petal = new THREE.Mesh(new THREE.SphereGeometry(0.24, 10, 10), petalMat);
        petal.position.set(Math.cos(angle) * 0.2, 1.24, Math.sin(angle) * 0.2);
        petal.scale.y = 0.4;
        flower.add(petal);
    }

    // 花心
    const center = new THREE.Mesh(
        new THREE.SphereGeometry(0.16, 10, 10),
        new THREE.MeshStandardMaterial({ color: 0xffee00, emissive: 0xffee00, emissiveIntensity: 0.3 })
    );
    center.position.y = 1.24;
    flower.add(center);

    flower.position.set(flowerData.x, 0, flowerData.z);
    flower.castShadow = true;

    // 生长动画
    flower.scale.set(0.01, 0.01, 0.01);
    new TWEEN.Tween(flower.scale)
        .to({ x: 1, y: 1, z: 1 }, 800)
        .easing(TWEEN.Easing.Back.Out)
        .start();

    scene.add(flower);
}

// ─────────────────────────────────────────────
// 种花表单弹窗
// ─────────────────────────────────────────────
function showPlantFlowerForm(x, z) {
    const modal = document.createElement('div');
    modal.id = 'plant-flower-modal';
    modal.className = 'modal';
    modal.style.display = 'block';

    modal.innerHTML = `
        <div class="modal-content card" style="max-width:500px;">
            <span class="close">&times;</span>
            <div style="padding:40px 30px;text-align:center;">
                <h2 style="color:#2c2c2c;margin-bottom:10px;">🌸 种下一朵花</h2>
                <p style="color:#666;margin-bottom:30px;">留下你的名字和祝福</p>

                <div style="text-align:left;margin-bottom:20px;">
                    <label style="display:block;color:#555;margin-bottom:8px;font-weight:600;">你的名字</label>
                    <input type="text" id="flower-name" placeholder="请输入你的名字"
                        style="width:100%;padding:12px;border:2px solid #e0e0e0;border-radius:8px;font-size:15px;box-sizing:border-box;">
                </div>

                <div style="text-align:left;margin-bottom:20px;">
                    <label style="display:block;color:#555;margin-bottom:8px;font-weight:600;">祝福语</label>
                    <textarea id="flower-message" placeholder="写下你的祝福..."
                        style="width:100%;padding:12px;border:2px solid #e0e0e0;border-radius:8px;font-size:15px;min-height:80px;resize:vertical;box-sizing:border-box;"></textarea>
                </div>

                <div style="text-align:left;margin-bottom:25px;">
                    <label style="display:block;color:#555;margin-bottom:12px;font-weight:600;">选择花的颜色</label>
                    <div id="color-picker" style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center;">
                        <div class="color-option" data-color="0xff69b4" style="background:#ff69b4;" title="粉色"></div>
                        <div class="color-option" data-color="0xff6347" style="background:#ff6347;" title="红色"></div>
                        <div class="color-option" data-color="0xffd700" style="background:#ffd700;" title="黄色"></div>
                        <div class="color-option" data-color="0x9370db" style="background:#9370db;" title="紫色"></div>
                        <div class="color-option" data-color="0x6bddff" style="background:#6bddff;" title="蓝色"></div>
                        <div class="color-option" data-color="0xffa500" style="background:#ffa500;" title="橙色"></div>
                        <div class="color-option" data-color="0xffffff" style="background:#ffffff;border:2px solid #ddd;" title="白色"></div>
                    </div>
                </div>

                <button id="plant-btn" style="width:100%;padding:14px;background:linear-gradient(135deg,#667eea,#764ba2);color:white;border:none;border-radius:10px;font-size:16px;font-weight:600;cursor:pointer;">
                    🌸 种下这朵花
                </button>
            </div>
        </div>
        <style>
            .color-option { width:45px;height:45px;border-radius:50%;cursor:pointer;transition:all 0.2s;border:3px solid transparent; }
            .color-option:hover { transform:scale(1.15); }
            .color-option.selected { border-color:#2c2c2c;box-shadow:0 0 0 3px rgba(102,126,234,0.3); }
            #plant-btn:hover { opacity:0.9; }
        </style>
    `;

    document.body.appendChild(modal);

    // 颜色选择
    let selectedColor = 0xff69b4;
    const colorOptions = modal.querySelectorAll('.color-option');
    colorOptions[0].classList.add('selected');
    colorOptions.forEach(option => {
        option.addEventListener('click', () => {
            colorOptions.forEach(o => o.classList.remove('selected'));
            option.classList.add('selected');
            selectedColor = parseInt(option.dataset.color);
        });
    });

    // 种花
    document.getElementById('plant-btn').onclick = async () => {
        const name    = document.getElementById('flower-name').value.trim();
        const message = document.getElementById('flower-message').value.trim();
        if (!name)    { alert('请输入你的名字 😊'); return; }
        if (!message) { alert('请写下你的祝福 💕'); return; }

        const btn = document.getElementById('plant-btn');
        btn.textContent = '种植中...';
        btn.disabled = true;

        const flowerData = { x, z, name, message, color: selectedColor, timestamp: Date.now() };

        // 先在场景里创建（即时响应）
        createPlantedFlower(flowerData);

        // 再保存到云端（异步）
        await savePlantedFlowers(flowerData);

        modal.remove();
        showSuccessMessage(name);
    };

    modal.querySelector('.close').onclick = () => modal.remove();
    modal.onclick = e => { if (e.target === modal) modal.remove(); };

    setTimeout(() => { document.getElementById('flower-name')?.focus(); }, 100);
}

// ─────────────────────────────────────────────
// 成功提示
// ─────────────────────────────────────────────
function showSuccessMessage(name) {
    const toast = document.createElement('div');
    toast.style.cssText = 'position:fixed;top:100px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,#667eea,#764ba2);color:white;padding:16px 30px;border-radius:30px;font-size:16px;z-index:10000;box-shadow:0 8px 25px rgba(102,126,234,0.4);white-space:nowrap;';
    toast.textContent = `🌸 ${name} 种下了一朵花！`;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.transition = 'opacity 0.3s';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

// ─────────────────────────────────────────────
// 查看花朵留言
// ─────────────────────────────────────────────
function showFlowerMessage(flower) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';

    const colorHex = '#' + (flower.userData.color || 0xff69b4).toString(16).padStart(6, '0');
    const dateStr  = flower.userData.timestamp
        ? new Date(flower.userData.timestamp).toLocaleDateString('zh-CN', { year:'numeric', month:'long', day:'numeric' })
        : '';

    modal.innerHTML = `
        <div class="modal-content card" style="max-width:450px;">
            <span class="close">&times;</span>
            <div style="padding:40px 30px;text-align:center;">
                <div style="width:80px;height:80px;background:${colorHex};border-radius:50%;margin:0 auto 20px;box-shadow:0 8px 20px rgba(0,0,0,0.15);"></div>
                <h2 style="color:#2c2c2c;margin-bottom:8px;">${flower.userData.name || '匿名'}</h2>
                <p style="color:#999;font-size:13px;margin-bottom:25px;">${dateStr}</p>
                <div style="background:#f8f9fa;padding:20px;border-radius:12px;border-left:4px solid ${colorHex};">
                    <p style="color:#555;font-size:16px;line-height:1.6;margin:0;font-style:italic;">"${flower.userData.message || ''}"</p>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    modal.querySelector('.close').onclick = () => modal.remove();
    modal.onclick = e => { if (e.target === modal) modal.remove(); };
}

// ─────────────────────────────────────────────
// 摇摆动画
// ─────────────────────────────────────────────
function updatePlantedFlowers(elapsed) {
    scene.children.forEach(obj => {
        if (obj.userData && obj.userData.isPlantedFlower) {
            obj.rotation.z = Math.sin(elapsed * 1.5 + (obj.userData.swayPhase || 0)) * 0.05;
            obj.rotation.x = Math.cos(elapsed * 1.0 + (obj.userData.swayPhase || 0)) * 0.03;
        }
    });
}

// ─────────────────────────────────────────────
// 连续三击检测
// ─────────────────────────────────────────────
function detectTripleClick(point) {
    const now = Date.now();
    clickHistory.push({ x: point.x, z: point.z, time: now });
    clickHistory = clickHistory.filter(c => now - c.time < TRIPLE_CLICK_THRESHOLD);

    if (clickHistory.length >= 3) {
        const recent3 = clickHistory.slice(-3);
        const allClose = recent3.every((c, i) => {
            if (i === 0) return true;
            const dist = Math.sqrt(Math.pow(c.x - recent3[i-1].x, 2) + Math.pow(c.z - recent3[i-1].z, 2));
            return dist < CLICK_DISTANCE_THRESHOLD;
        });

        if (allClose) { clickHistory = [ ]; return true; }

    }
    return false;
}

// ─────────────────────────────────────────────
// 种花入口
// ─────────────────────────────────────────────
function tryPlantFlower(point) {
    const x = point.x, z = point.z;

    // 排除建筑物附近
    if (typeof clawMachine !== 'undefined' && Math.abs(x - clawMachine.position.x) < 3 && Math.abs(z - clawMachine.position.z) < 3) return false;
    if (typeof ferrisWheel !== 'undefined' && Math.abs(x - ferrisWheel.position.x) < 10 && Math.abs(z - ferrisWheel.position.z) < 10) return false;
    if (typeof house !== 'undefined' && Math.abs(x - house.position.x) < 8 && Math.abs(z - house.position.z) < 8) return false;

    showPlantFlowerForm(x, z);
    return true;
}

// ─────────────────────────────────────────────
// 点击花朵查看留言
// ─────────────────────────────────────────────
function tryViewFlowerMessage(event) {
    raycaster.setFromCamera(mouse, camera);

    const flowers = scene.children.filter(obj => obj.userData && obj.userData.isPlantedFlower);
    if (!flowers.length) return false;

    const hits = raycaster.intersectObjects(flowers, true);
    if (!hits.length) return false;

    let obj = hits[0].object;
    while (obj.parent && !obj.userData.isPlantedFlower) obj = obj.parent;
    if (obj.userData && obj.userData.isPlantedFlower) {
        showFlowerMessage(obj);
        return true;
    }
    return false;
}