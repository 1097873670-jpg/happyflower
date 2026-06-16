// ==================== 粒子系统 ====================

function createPetalParticles() {
    const count = 500;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const velocities = [];

    for (let i = 0; i < count; i++) {
        positions[i * 3]     = (Math.random() - 0.5) * 60;
        positions[i * 3 + 1] = Math.random() * 28 + 5;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 60;
        velocities.push({
            x: (Math.random() - 0.5) * 0.028,
            y: -(Math.random() * 0.035 + 0.018),
            z: (Math.random() - 0.5) * 0.028
        });
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
        color: 0xffb6c1,
        size: 0.22,
        transparent: true,
        opacity: 0.75,
        sizeAttenuation: true
    });

    const ps = new THREE.Points(geo, mat);
    ps.userData.velocities = velocities;
    return ps;
}

function createFireflyParticles() {
    const count = 120;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const velocities = [];

    for (let i = 0; i < count; i++) {
        positions[i * 3]     = (Math.random() - 0.5) * 50;
        positions[i * 3 + 1] = Math.random() * 6 + 0.5;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
        velocities.push({
            x: (Math.random() - 0.5) * 0.018,
            y: (Math.random() - 0.5) * 0.008,
            z: (Math.random() - 0.5) * 0.018,
            phase: Math.random() * Math.PI * 2
        });
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
        color: 0xeeff44,
        size: 0.14,
        transparent: true,
        opacity: 0.85,
        sizeAttenuation: true
    });

    const ps = new THREE.Points(geo, mat);
    ps.userData.velocities = velocities;
    return ps;
}

function updateParticles(ps, bounds = 30) {
    const pos = ps.geometry.attributes.position.array;
    const vel = ps.userData.velocities;
    const elapsed = performance.now() * 0.001;

    for (let i = 0; i < vel.length; i++) {
        pos[i * 3]     += vel[i].x;
        pos[i * 3 + 1] += vel[i].y;
        pos[i * 3 + 2] += vel[i].z;

        // 萤火虫有相位飘动
        if (vel[i].phase !== undefined) {
            pos[i * 3 + 1] += Math.sin(elapsed + vel[i].phase) * 0.005;
        }

        if (pos[i * 3 + 1] < 0) pos[i * 3 + 1] = 28;
        if (pos[i * 3]     >  bounds) pos[i * 3]     = -bounds;
        if (pos[i * 3]     < -bounds) pos[i * 3]     =  bounds;
        if (pos[i * 3 + 2] >  bounds) pos[i * 3 + 2] = -bounds;
        if (pos[i * 3 + 2] < -bounds) pos[i * 3 + 2] =  bounds;
    }

    ps.geometry.attributes.position.needsUpdate = true;
}