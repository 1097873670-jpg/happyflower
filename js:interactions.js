// ==================== 交互逻辑（梦幻版）====================

let clawGameActive = false;
let clawX = 0;
let clawZ = 0;
let movingDown = false;
let holdingPrize = false;
let clawGroup = null;
let prize = null;
let originalCameraPos = null;

let hiddenObjects = [ ];


// ─────────────────────────────────────────────
// 鼠标移动
// ─────────────────────────────────────────────
function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

// ─────────────────────────────────────────────
// 点击事件
// ─────────────────────────────────────────────
function onCanvasClick(event) {
    if (clawGameActive) return;

    // 室内模式
    if (typeof insideHouse !== 'undefined' && insideHouse) {
        if (typeof handleIndoorClick === 'function') handleIndoorClick(event);
        return;
    }

    raycaster.setFromCamera(mouse, camera);
    // ✅ 新增：检测小狗和花园物件
    if (typeof tryClickDog === 'function' && tryClickDog(event)) return;
    if (typeof tryClickGardenObject === 'function' && tryClickGardenObject(event)) return;

    // ① 优先检测别墅
    // ... 后续代码不变

    // ① 优先检测别墅（进入房间）
    if (typeof house !== 'undefined' && house) {
        const houseHits = raycaster.intersectObject(house, true);
        if (houseHits.length > 0) {
            if (typeof enterHouse === 'function') enterHouse();
            return;
        }
    }

    // ② 检测已种的花（查看留言）
    if (typeof tryViewFlowerMessage === 'function' && tryViewFlowerMessage(event)) return;

    // ③ 点击地面（移动 / 种花）
    if (typeof scene !== 'undefined') {
        const ground = scene.getObjectByName('ground');
        if (ground) {
            const hits = raycaster.intersectObject(ground);
            if (hits.length > 0) {
                const point = hits[0].point;
                if (typeof detectTripleClick === 'function' && detectTripleClick(point)) {
                    if (typeof tryPlantFlower === 'function') tryPlantFlower(point);
                    return;
                }
                if (event.shiftKey) {
                    if (typeof tryPlantFlower === 'function') tryPlantFlower(point);
                } else {
                    moveCharacterTo(characters.mainGirl, point);
                }
            }
        }
    }
}

// ─────────────────────────────────────────────
// 键盘
// ─────────────────────────────────────────────
function onKeyDown(event) {
    if (clawGameActive) {
        if (event.key === 'ArrowLeft')  clawX = -0.08;
        if (event.key === 'ArrowRight') clawX =  0.08;
        if (event.key === 'ArrowUp')    clawZ = -0.08;
        if (event.key === 'ArrowDown')  clawZ =  0.08;
        if (event.key === ' ') {
            event.preventDefault();
            if (!movingDown && !holdingPrize) movingDown = true;
        }
        if (event.key === 'Escape') exitClawGame();
        return;
    }

    const key = event.key.toLowerCase();

    if (key === 'e' && characters.mainGirl) {
        if (typeof clawMachine === 'undefined') return;
        const dist = characters.mainGirl.position.distanceTo(clawMachine.position);
        if (dist < 3.5) enterClawGame();
    }

    if (key === 'f' && characters.mainGirl) {
        if (typeof ferrisWheel === 'undefined' || !ferrisWheel) return;
        const dist = characters.mainGirl.position.distanceTo(ferrisWheel.position);
        if (dist < 9) showFerrisWheel();
    }
}

function onKeyUp(event) {
    if (clawGameActive) {
        if (event.key === 'ArrowLeft'  || event.key === 'ArrowRight') clawX = 0;
        if (event.key === 'ArrowUp'    || event.key === 'ArrowDown')  clawZ = 0;
    }
}

// ─────────────────────────────────────────────
// 角色移动
// ─────────────────────────────────────────────
function moveCharacterTo(character, targetPos) {
    character.userData.isMoving = true;
    const dir = new THREE.Vector3()
        .subVectors(targetPos, character.position)
        .normalize();
    const targetRot = Math.atan2(dir.x, dir.z);

    new TWEEN.Tween(character.position)
        .to({ x: targetPos.x, z: targetPos.z }, 1800)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(() => { character.rotation.y = targetRot; })
        .onComplete(() => { character.userData.isMoving = false; })
        .start();
}

// ─────────────────────────────────────────────
// 进入 / 退出娃娃机游戏
// ─────────────────────────────────────────────
function enterClawGame() {
    clawGameActive = true;

    document.getElementById('claw-ui').style.display = 'none';
    document.getElementById('hint').style.display = 'none';

    const gameHint = document.createElement('div');
    gameHint.id = 'claw-game-hint';
    gameHint.className = 'hint';
    gameHint.innerHTML = '⬅️➡️⬆️⬇️ 移动 | 空格 抓取 | ESC 退出';
    gameHint.style.top = '20px';
    gameHint.style.fontSize = '18px';
    gameHint.style.background = 'linear-gradient(135deg,#ff9ed8,#d896ff)';
    document.body.appendChild(gameHint);

    originalCameraPos = {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z,
        lookAt: new THREE.Vector3(0, 0, 0)
    };


    hiddenObjects = [ ];

    scene.children.forEach(obj => {
        if (obj !== clawMachine &&
            obj.type !== 'DirectionalLight' &&
            obj.type !== 'AmbientLight' &&
            obj.type !== 'HemisphereLight') {
            obj.visible = false;
            hiddenObjects.push(obj);
        }
    });

    scene.background = new THREE.Color(0xffd4f0);
    scene.fog = null;

    new TWEEN.Tween(camera.position)
        .to({
            x: clawMachine.position.x,
            y: clawMachine.position.y + 4,
            z: clawMachine.position.z + 5
        }, 1000)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(() => {
            camera.lookAt(clawMachine.position.x, clawMachine.position.y + 1.5, clawMachine.position.z);
        })
        .start();

    createClawForGame();
    createPrizeForGame();
}

function exitClawGame() {
    clawGameActive = false;

    const gameHint = document.getElementById('claw-game-hint');
    if (gameHint) gameHint.remove();

    document.getElementById('hint').style.display = 'block';

    hiddenObjects.forEach(obj => { obj.visible = true; });
    hiddenObjects = [];

    // ✅ 关键修复：恢复后强制把室内场景隐藏（室内场景只有进入别墅时才显示）
    const interior = scene.getObjectByName('houseInterior');
    if (interior) interior.visible = false;

    scene.background = new THREE.Color(0x87CEEB);
    scene.fog = new THREE.FogExp2(0x87CEEB, 0.011);

    if (clawGroup) { scene.remove(clawGroup); clawGroup = null; }
    if (prize)     { scene.remove(prize);     prize = null;     }

    if (originalCameraPos) {
        new TWEEN.Tween(camera.position)
            .to({ x: originalCameraPos.x, y: originalCameraPos.y, z: originalCameraPos.z }, 1000)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate(() => { camera.lookAt(originalCameraPos.lookAt); })
            .start();
    }

    clawX = 0; clawZ = 0;
    movingDown = false;
    holdingPrize = false;
}

// ─────────────────────────────────────────────
// 创建爪子
// ─────────────────────────────────────────────
function createClawForGame() {
    clawGroup = new THREE.Group();
    clawGroup.position.set(
        clawMachine.position.x,
        clawMachine.position.y + 3.5,
        clawMachine.position.z
    );

    const clawMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.9, roughness: 0.2 });
    const clawBody = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.8, 8), clawMat);
    clawBody.position.y = -0.4;
    clawGroup.add(clawBody);

    const prongMat = new THREE.MeshStandardMaterial({ color: 0xff9ed8, metalness: 0.7, roughness: 0.3 });
    for (let i = 0; i < 3; i++) {
        const angle = i * (2 * Math.PI / 3);
        const prong = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.6, 0.08), prongMat);
        prong.position.x = 0.25 * Math.cos(angle);
        prong.position.z = 0.25 * Math.sin(angle);
        prong.position.y = -1.0;
        prong.rotation.z = Math.cos(angle) * 0.3;
        prong.rotation.x = Math.sin(angle) * 0.3;
        clawGroup.add(prong);
    }

    scene.add(clawGroup);
}

// ─────────────────────────────────────────────
// 创建奖品球（颜色对应 CONFIG.gifts 里的 color）
// ─────────────────────────────────────────────
function createPrizeForGame() {
    // 用可用礼物的颜色列表，让球颜色有意义

    const gifts = (typeof CONFIG !== 'undefined ' && CONFIG.gifts) ? CONFIG.gifts : [ ];

    const available = getAvailableGifts();
    const colors = available.length > 0
        ? available.map(g => g.color)
        : [0xff6b9d, 0xffd700, 0x9d6bff, 0x6bddff, 0x6bff9d];

    const color = colors[Math.floor(Math.random() * colors.length)];

    const prizeMat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.2,
        metalness: 0.7,
        emissive: color,
        emissiveIntensity: 0.3
    });

    prize = new THREE.Mesh(new THREE.SphereGeometry(0.25, 32, 32), prizeMat);
    prize.position.set(
        clawMachine.position.x + (Math.random() - 0.5) * 1.2,
        clawMachine.position.y + 0.5,
        clawMachine.position.z + (Math.random() - 0.5) * 1.2
    );
    prize.castShadow = true;
    scene.add(prize);
}

// ─────────────────────────────────────────────
// 每帧更新抓取逻辑
// ─────────────────────────────────────────────
function updateClawGame() {
    if (!clawGameActive || !clawGroup) return;

    // 水平移动
    clawGroup.position.x += clawX;
    clawGroup.position.z += clawZ;
    clawGroup.position.x = THREE.MathUtils.clamp(
        clawGroup.position.x,
        clawMachine.position.x - 1.0,
        clawMachine.position.x + 1.0
    );
    clawGroup.position.z = THREE.MathUtils.clamp(
        clawGroup.position.z,
        clawMachine.position.z - 1.0,
        clawMachine.position.z + 1.0
    );

    // 下降
    if (movingDown && clawGroup.position.y > clawMachine.position.y + 0.6) {
        clawGroup.position.y -= 0.08;
    } else if (movingDown && clawGroup.position.y <= clawMachine.position.y + 0.6) {
        movingDown = false;
    }

    // 上升
    if (!movingDown && clawGroup.position.y < clawMachine.position.y + 3.5) {
        clawGroup.position.y += 0.06;
    }

    // 抓取检测
    if (!holdingPrize && prize && clawGroup.position.distanceTo(prize.position) < 0.5) {
        holdingPrize = true;
    }

    // 奖品跟随爪子
    if (holdingPrize && prize) {
        prize.position.copy(clawGroup.position).add(new THREE.Vector3(0, -0.9, 0));

        // 到顶触发礼物弹窗 ✅ 接入去重系统
        if (clawGroup.position.y >= clawMachine.position.y + 3.4) {
            onClawSuccess();  // ← 核心：用新系统替换老的 playClawMachine()
            exitClawGame();
        }
    }
}

// ─────────────────────────────────────────────
// 抓取成功入口（去重 + 弹窗）
// ─────────────────────────────────────────────
function onClawSuccess() {
    const gift = drawGift();
    if (!gift) return;
    recordGift(gift);
    showClawSuccessPopup(gift);
}

// ─────────────────────────────────────────────
// 摩天轮弹窗
// ─────────────────────────────────────────────
function showFerrisWheel() {
    if (typeof CONFIG === 'undefined' || !CONFIG.ferrisWheel) return;
    const fw = CONFIG.ferrisWheel;
    const modal = document.getElementById('ferris-modal');
    if (!modal) return;
    document.getElementById('ferris-image').src = fw.image;
    document.getElementById('ferris-title').textContent = fw.title;
    document.getElementById('ferris-description').textContent = fw.description;
    document.getElementById('ferris-message').textContent = fw.message;
    modal.style.display = 'block';
    const close = modal.querySelector('.close');
    close.onclick = () => { modal.style.display = 'none'; };
    modal.onclick = e => { if (e.target === modal) modal.style.display = 'none'; };
}

// ─────────────────────────────────────────────
// 背景音乐
// ─────────────────────────────────────────────
function setupBackgroundMusic() {
    const bgMusic = new Audio(CONFIG.music.url);
    bgMusic.loop = true;
    bgMusic.volume = CONFIG.music.volume;
    const btn = document.getElementById('music-control');
    let playing = false;
    btn.addEventListener('click', () => {
        if (playing) {
            bgMusic.pause();
            btn.textContent = '🎵 点击播放音乐';
        } else {
            bgMusic.play().catch(() => {});
            btn.textContent = '🔇 点击暂停音乐';
        }
        playing = !playing;
    });
}

// ══════════════════════════════════════════════
// 礼物去重系统
// ══════════════════════════════════════════════

const CLAW_STORAGE_KEY = 'clawGiftRecord';

function getClawRecord() {
    try {

        return JSON.parse(localStorage.getItem(CLAW_STORAGE_KEY) || '[ ]');


    } catch(e) { return [ ]; }

}

function saveClawRecord(record) {
    localStorage.setItem(CLAW_STORAGE_KEY, JSON.stringify(record));
}

function getAvailableGifts() {

    const gifts = (typeof CONFIG !== 'undefined ' && CONFIG.gifts) ? CONFIG.gifts : [ ];

    const gotIds = getClawRecord().map(r => r.id);
    const available = gifts.filter(g => !gotIds.includes(g.id));
    // 全部抓完则重置（所有礼物重新可用）
    return available.length > 0 ? available : [...gifts];
}

function drawGift() {
    const available = getAvailableGifts();
    if (!available.length) return null;

    const rc = (typeof CONFIG !== 'undefined' && CONFIG.rarityConfig) ? CONFIG.rarityConfig : {
        legendary: { chance: 0.10 },
        rare:      { chance: 0.30 },
        common:    { chance: 0.60 },
    };

    const rand = Math.random();
    let rarity;
    if (rand < rc.legendary.chance)                        rarity = 'legendary';
    else if (rand < rc.legendary.chance + rc.rare.chance)  rarity = 'rare';
    else                                                    rarity = 'common';

    let pool = available.filter(g => g.rarity === rarity);
    if (!pool.length) pool = available; // 该稀有度没有则从全部可用里选

    return pool[Math.floor(Math.random() * pool.length)];
}

function recordGift(gift) {
    const record = getClawRecord();
    if (!record.find(r => r.id === gift.id)) {
        record.push({
            id: gift.id,
            name: gift.name,
            emoji: gift.emoji,
            rarity: gift.rarity,
            time: new Date().toLocaleString('zh-CN'),
        });
        saveClawRecord(record);
    }
}

function showClawSuccessPopup(gift) {
    const old = document.getElementById('claw-result-modal');
    if (old) old.remove();

    const rarityConfig = (typeof CONFIG !== 'undefined' && CONFIG.rarityConfig) ? CONFIG.rarityConfig : {};
    const rc = rarityConfig[gift.rarity] || { label: '普通', color: '#aaaaaa' };
    const isLegendary = gift.rarity === 'legendary';

    const modal = document.createElement('div');
    modal.id = 'claw-result-modal';
    modal.style.cssText = 'position:fixed;inset:0;display:flex;align-items:center;justify-content:center;z-index:30000;background:rgba(0,0,0,0.55);animation:fadeIn 0.3s ease;';
    modal.innerHTML = `
        <div style="
            background:${isLegendary ? 'linear-gradient(135deg,#1a0533,#3d1460,#1a0533)' : 'linear-gradient(135deg,#fff0f5,#ffe4f0)'};
            border:3px solid ${rc.color};border-radius:24px;padding:40px 50px;
            text-align:center;max-width:360px;width:88%;
            box-shadow:0 0 40px ${rc.color}88;
            animation:popIn 0.5s cubic-bezier(0.34,1.56,0.64,1);
            position:relative;overflow:hidden;">
            ${isLegendary ? '<div style="position:absolute;inset:0;background:radial-gradient(circle at 50% 30%,rgba(255,215,0,0.15),transparent 70%);pointer-events:none;"></div>' : ''}
            <div style="font-size:14px;font-weight:700;color:${rc.color};letter-spacing:3px;margin-bottom:12px;">✦ ${rc.label}品质 ✦</div>
            <div style="font-size:72px;margin:10px 0;filter:drop-shadow(0 0 12px ${rc.color});">${gift.emoji}</div>
            <div style="font-size:22px;font-weight:800;color:${isLegendary ? '#ffd700' : '#c0306a'};margin:12px 0 6px;">${gift.name}</div>
            <div style="font-size:13px;color:${isLegendary ? '#ccaaff' : '#999'};margin-bottom:24px;">恭喜获得！已加入礼物收藏 🎁</div>
            <div style="display:flex;gap:12px;justify-content:center;">
                <button onclick="showClawRecord();document.getElementById('claw-result-modal').remove();"
                    style="padding:10px 22px;background:transparent;color:${rc.color};border:2px solid ${rc.color};border-radius:20px;cursor:pointer;font-size:14px;font-weight:600;">查看收藏</button>
                <button onclick="document.getElementById('claw-result-modal').remove();"
                    style="padding:10px 22px;background:${rc.color};color:white;border:none;border-radius:20px;cursor:pointer;font-size:14px;font-weight:600;">继续玩 🎮</button>
            </div>
        </div>`;
    document.body.appendChild(modal);
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });

    // 传说品质烟花
    if (isLegendary && typeof _spawnFirework === 'function') {
        [0xffd700, 0xff6bcd, 0x88eeff, 0xffd700].forEach((color, i) => {
            setTimeout(() => _spawnFirework(
                (Math.random() - 0.5) * 10,
                3 + Math.random() * 2,
                (Math.random() - 0.5) * 8,
                color
            ), i * 300);
        });
    }
}

function showClawRecord() {
    const record = getClawRecord();
    const old = document.getElementById('claw-record-modal');
    if (old) old.remove();

    const rarityConfig = (typeof CONFIG !== 'undefined' && CONFIG.rarityConfig) ? CONFIG.rarityConfig : {};
    const totalGifts = (typeof CONFIG !== 'undefined' && CONFIG.gifts) ? CONFIG.gifts.length : 0;

    const listHTML = record.length === 0
        ? '<div style="color:#999;padding:30px;text-align:center;">还没有抓到任何礼物，快去试试！🎮</div>'
        : record.map(r => {
            const rc2 = rarityConfig[r.rarity] || { label: '普通', color: '#aaa' };
            return `<div style="display:flex;align-items:center;gap:12px;padding:12px 16px;border-radius:12px;margin-bottom:8px;background:rgba(255,255,255,0.7);border:1px solid ${rc2.color}44;">
                <span style="font-size:28px;">${r.emoji}</span>
                <div style="flex:1;text-align:left;">
                    <div style="font-weight:700;color:#333;font-size:15px;">${r.name}</div>
                    <div style="font-size:12px;color:#999;">${r.time}</div>
                </div>
                <span style="font-size:11px;font-weight:700;color:${rc2.color};border:1px solid ${rc2.color};padding:2px 8px;border-radius:10px;">${rc2.label}</span>
            </div>`;
        }).join('');

    const modal = document.createElement('div');
    modal.id = 'claw-record-modal';
    modal.style.cssText = 'position:fixed;inset:0;display:flex;align-items:center;justify-content:center;z-index:30000;background:rgba(0,0,0,0.55);';
    modal.innerHTML = `
        <div style="background:linear-gradient(135deg,#fff0f5,#ffe4f0);border:2px solid #ff6b9d;border-radius:24px;padding:30px;max-width:420px;width:90%;max-height:80vh;display:flex;flex-direction:column;box-shadow:0 0 40px rgba(255,107,157,0.3);">
            <div style="text-align:center;margin-bottom:20px;">
                <div style="font-size:22px;font-weight:800;color:#c0306a;">🎁 我的礼物收藏</div>
                <div style="font-size:13px;color:#999;margin-top:6px;">已收集 ${record.length} / ${totalGifts} 件 ${record.length === totalGifts && totalGifts > 0 ? '🎉 全部收集！' : ''}</div>
                <div style="margin:10px auto;width:80%;height:6px;background:#ffd0e0;border-radius:3px;overflow:hidden;">
                    <div style="height:100%;width:${totalGifts ? (record.length / totalGifts * 100) : 0}%;background:linear-gradient(90deg,#ff6b9d,#ffd700);border-radius:3px;"></div>
                </div>
            </div>
            <div style="overflow-y:auto;flex:1;padding-right:4px;">${listHTML}</div>
            <div style="display:flex;gap:10px;margin-top:16px;">
                <button onclick="clearClawRecord()" style="flex:1;padding:10px;background:transparent;color:#ff6b9d;border:2px solid #ff6b9d;border-radius:16px;cursor:pointer;font-size:13px;">清空记录</button>
                <button onclick="document.getElementById('claw-record-modal').remove()" style="flex:2;padding:10px;background:linear-gradient(135deg,#ff6b9d,#ffd700);color:white;border:none;border-radius:16px;cursor:pointer;font-size:14px;font-weight:700;">关闭</button>
            </div>
        </div>`;
    document.body.appendChild(modal);
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
}

function clearClawRecord() {
    if (confirm('确定要清空所有礼物记录吗？')) {
        localStorage.removeItem(CLAW_STORAGE_KEY);
        document.getElementById('claw-record-modal')?.remove();
        showClawRecord();
    }
}

// ── 隐藏管理员入口：连续点击左上角5次清空记录 ──
(function setupSecretReset() {
    let clickCount = 0;
    let clickTimer = null;
    document.addEventListener('click', e => {
        if (e.clientX < 60 && e.clientY < 60) {
            clickCount++;
            clearTimeout(clickTimer);
            clickTimer = setTimeout(() => { clickCount = 0; }, 1500);
            if (clickCount >= 5) {
                clickCount = 0;
                if (confirm('🔧 管理员模式：确定清空所有礼物记录？')) {
                    localStorage.removeItem(CLAW_STORAGE_KEY);
                    alert('✅ 记录已清空，刷新页面生效！');
                }
            }
        }
    });
})();

// CSS 动画
(function addClawStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes popIn  { from{transform:scale(0.5);opacity:0} to{transform:scale(1);opacity:1} }
    `;
    document.head.appendChild(style);
})();
// ─────────────────────────────────────────────
// 通用说话气泡（3D对象头顶浮现）
// ─────────────────────────────────────────────
function showSpeechBubble(text, worldObject, duration) {
    duration = duration || 3000;
    const old = document.getElementById('speech-bubble');
    if (old) old.remove();

    const bubble = document.createElement('div');
    bubble.id = 'speech-bubble';
    bubble.style.cssText = [
        'position:fixed',
        'background:white',
        'border:2px solid #ff6b9d',
        'border-radius:18px',
        'padding:10px 18px',
        'font-size:15px',
        'font-weight:600',
        'color:#333',
        'pointer-events:none',
        'z-index:9999',
        'box-shadow:0 4px 16px rgba(255,107,157,0.3)',
        'transform:translate(-50%,-100%)',
        'white-space:nowrap',
        'transition:opacity 0.3s',
    ].join(';');
    bubble.innerHTML = text + '<div style="position:absolute;bottom:-10px;left:50%;transform:translateX(-50%);width:0;height:0;border-left:8px solid transparent;border-right:8px solid transparent;border-top:10px solid #ff6b9d;"></div>';
    document.body.appendChild(bubble);

    // 每帧更新气泡位置（跟随3D对象）
    let animId;
    function updatePos() {
        if (!bubble.parentNode) return;
        const pos = new THREE.Vector3();
        worldObject.getWorldPosition(pos);
        pos.y += 1.8; // 头顶上方
        const projected = pos.project(camera);
        const x = (projected.x * 0.5 + 0.5) * window.innerWidth;
        const y = (-projected.y * 0.5 + 0.5) * window.innerHeight;
        bubble.style.left = x + 'px';
        bubble.style.top  = y + 'px';
        animId = requestAnimationFrame(updatePos);
    }
    updatePos();

    setTimeout(() => {
        bubble.style.opacity = '0';
        setTimeout(() => {
            bubble.remove();
            cancelAnimationFrame(animId);
        }, 300);
    }, duration);
}