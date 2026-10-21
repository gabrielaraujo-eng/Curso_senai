// ===== Arena Fire 3D =====
const ARENA = 45, NUM_ENEMIES = 8;
const $ = id => document.getElementById(id);

const WEAPONS = [
  { name:'Pistola', dmg:24, rate:.28, mag:12, reserve:60,  reload:1.1, spread:.006, pellets:1, auto:false, color:0x888888, size:[.1,.15,.45], recoil:.04 },
  { name:'Rifle',   dmg:20, rate:.1,  mag:30, reserve:120, reload:1.6, spread:.014, pellets:1, auto:true,  color:0x3e5c2e, size:[.1,.14,.85], recoil:.05 },
  { name:'Shotgun', dmg:11, rate:.85, mag:6,  reserve:24,  reload:2.0, spread:.07,  pellets:9, auto:false, color:0x7a4a22, size:[.13,.15,.8],  recoil:.15 },
];
WEAPONS.forEach(w => { w.ammo = w.mag; w.res = w.reserve; });

// ---- cena ----
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x8fc8f0);
scene.fog = new THREE.Fog(0x8fc8f0, 25, 110);
const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, .05, 200);
camera.rotation.order = 'YXZ';
scene.add(camera);
const renderer = new THREE.WebGLRenderer({ antialias:true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xffffff, 0x556633, .85));
const sun = new THREE.DirectionalLight(0xfff2cc, .8);
sun.position.set(30, 50, 20);
sun.castShadow = true;
sun.shadow.camera.left = sun.shadow.camera.bottom = -60;
sun.shadow.camera.right = sun.shadow.camera.top = 60;
sun.shadow.mapSize.set(1024, 1024);
scene.add(sun);

const ground = new THREE.Mesh(new THREE.PlaneGeometry(ARENA*2, ARENA*2), new THREE.MeshLambertMaterial({ color:0x5a8f3c }));
ground.rotation.x = -Math.PI/2; ground.receiveShadow = true;
scene.add(ground);
const grid = new THREE.GridHelper(ARENA*2, 45, 0x4a7a30, 0x4a7a30); grid.position.y = .01; scene.add(grid);

// ---- obstáculos ----
const boxes = [];      // colisão: {x0,x1,z0,z1,h}
const obstacles = [];  // meshes (bloqueiam tiros)
function addBox(x, z, w, d, h, color) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshLambertMaterial({ color }));
  m.position.set(x, h/2, z); m.castShadow = m.receiveShadow = true;
  scene.add(m); obstacles.push(m);
  boxes.push({ x0:x-w/2, x1:x+w/2, z0:z-d/2, z1:z+d/2, h });
}
const rnd = (a, b) => a + Math.random()*(b-a);
// paredes da arena
addBox(0,-ARENA,ARENA*2,1,4,0x555a66); addBox(0,ARENA,ARENA*2,1,4,0x555a66);
addBox(-ARENA,0,1,ARENA*2,4,0x555a66); addBox(ARENA,0,1,ARENA*2,4,0x555a66);
// casas
[[-20,-20],[22,-15],[-15,22],[20,20],[0,-30]].forEach(([x,z]) => {
  addBox(x-4,z,.6,8,4,0xc9a66b); addBox(x+4,z,.6,8,4,0xc9a66b);
  addBox(x,z-4,8,.6,4,0xc9a66b); addBox(x-2.5,z+4,3,.6,4,0xc9a66b); addBox(x+2.5,z+4,3,.6,4,0xc9a66b);
});
// caixotes
for (let i = 0; i < 40; i++) {
  const s = rnd(1.5, 3), x = rnd(-ARENA+4, ARENA-4), z = rnd(-ARENA+4, ARENA-4);
  if (Math.hypot(x, z) < 6) continue;
  addBox(x, z, s, s, rnd(1, 2.2), [0x8d6e3f,0x6d4c2a,0x3f6f8d][i%3]);
}

// ---- jogador ----
const player = { x:0, z:0, y:0, vy:0, yaw:0, pitch:0, hp:100, ground:true, radius:.45, kills:0, alive:false };
const keys = {};
let cur = 0, firing = false, lastShot = 0, reloading = 0, recoil = 0, bob = 0;

// viewmodel da arma
const gunGroup = new THREE.Group();
camera.add(gunGroup);
let gunMesh;
function buildGun() {
  if (gunMesh) gunGroup.remove(gunMesh);
  const w = WEAPONS[cur];
  gunMesh = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(...w.size), new THREE.MeshLambertMaterial({ color:w.color }));
  body.position.z = -w.size[2]/2;
  const grip = new THREE.Mesh(new THREE.BoxGeometry(.08,.2,.1), new THREE.MeshLambertMaterial({ color:0x222222 }));
  grip.position.set(0,-.14,-.12);
  const flash = new THREE.Mesh(new THREE.SphereGeometry(.08,8,8), new THREE.MeshBasicMaterial({ color:0xffcc33 }));
  flash.position.z = -w.size[2]-.05; flash.visible = false; flash.name = 'flash';
  gunMesh.add(body, grip, flash);
  gunGroup.add(gunMesh);
  gunGroup.position.set(.28, -.26, -.35);
}

// ---- inimigos ----
const enemies = [], enemyParts = [];
function makeEnemy() {
  const g = new THREE.Group();
  const col = new THREE.Color().setHSL(Math.random(), .5, .4);
  const mat = new THREE.MeshLambertMaterial({ color:col });
  const skin = new THREE.MeshLambertMaterial({ color:0xf0c8a0 });
  const part = (geo, m, y, head) => {
    const p = new THREE.Mesh(geo, m); p.position.y = y; p.castShadow = true;
    p.userData.enemy = g; p.userData.head = !!head; g.add(p); enemyParts.push(p); return p;
  };
  part(new THREE.BoxGeometry(.28,.8,.3), new THREE.MeshLambertMaterial({ color:0x222233 }), .4).position.x = 0;
  part(new THREE.BoxGeometry(.6,.7,.35), mat, 1.15);
  part(new THREE.BoxGeometry(.35,.35,.35), skin, 1.7, true);
  const gun = new THREE.Mesh(new THREE.BoxGeometry(.08,.1,.6), new THREE.MeshLambertMaterial({ color:0x111111 }));
  gun.position.set(.3,1.2,-.3); g.add(gun);
  g.userData = { hp:100, cd:rnd(1,2), strafe:Math.random()<.5?1:-1, st:rnd(1,3), r:.45 };
  let x, z; do { x = rnd(-ARENA+4, ARENA-4); z = rnd(-ARENA+4, ARENA-4); } while (Math.hypot(x-player.x, z-player.z) < 22 || hitsBox(x, z, .6, 0));
  g.position.set(x, 0, z);
  scene.add(g); enemies.push(g);
}
function hitsBox(x, z, r, feet) { return boxes.some(b => feet < b.h-.3 && x > b.x0-r && x < b.x1+r && z > b.z0-r && z < b.z1+r); }
function pushOut(o, r, feet) {
  for (const b of boxes) {
    if (feet >= b.h-.3) continue;
    if (o.x > b.x0-r && o.x < b.x1+r && o.z > b.z0-r && o.z < b.z1+r) {
      const dl = o.x-(b.x0-r), dr = (b.x1+r)-o.x, dt = o.z-(b.z0-r), db = (b.z1+r)-o.z;
      const m = Math.min(dl, dr, dt, db);
      if (m === dl) o.x = b.x0-r; else if (m === dr) o.x = b.x1+r; else if (m === dt) o.z = b.z0-r; else o.z = b.z1+r;
    }
  }
}

// ---- áudio ----
let actx;
function sfx(freq, dur, type='square', vol=.12, slide=0) {
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const o = actx.createOscillator(), g = actx.createGain();
    o.type = type; o.frequency.value = freq;
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq+slide), actx.currentTime+dur);
    g.gain.setValueAtTime(vol, actx.currentTime); g.gain.exponentialRampToValueAtTime(.001, actx.currentTime+dur);
    o.connect(g); g.connect(actx.destination); o.start(); o.stop(actx.currentTime+dur);
  } catch(e) {}
}

// ---- armas ----
const ray = new THREE.Raycaster();
function updateHUD() {
  const w = WEAPONS[cur];
  $('wname').textContent = reloading > 0 ? w.name+' (recarregando...)' : w.name;
  $('ammo').textContent = w.ammo+' / '+w.res;
  $('hpbar').style.width = Math.max(0, player.hp)+'%';
  $('hptxt').textContent = Math.max(0, Math.ceil(player.hp));
  $('alive').textContent = enemies.length+1;
  $('kills').textContent = player.kills;
  $('wlist').innerHTML = WEAPONS.map((x,i) => `<span class="${i===cur?'sel':''}">${i+1} ${x.name}</span>`).join('');
}
function say(t, ms=1800) { $('msg').textContent = t; setTimeout(() => { if ($('msg').textContent === t) $('msg').textContent = ''; }, ms); }
function switchWeapon(i) { if (i === cur || i < 0 || i >= WEAPONS.length) return; cur = i; reloading = 0; buildGun(); updateHUD(); }
function reload() {
  const w = WEAPONS[cur];
  if (reloading > 0 || w.ammo === w.mag || w.res <= 0) return;
  reloading = w.reload; sfx(200, .15, 'sawtooth', .08); updateHUD();
}
function shoot() {
  const w = WEAPONS[cur], now = performance.now()/1000;
  if (reloading > 0 || now-lastShot < w.rate) return;
  if (w.ammo <= 0) { reload(); return; }
  lastShot = now; w.ammo--; recoil = w.recoil;
  sfx(cur===2?90:cur===1?140:180, .12, 'sawtooth', .18, -80);
  gunMesh.getObjectByName('flash').visible = true;
  setTimeout(() => gunMesh && (gunMesh.getObjectByName('flash').visible = false), 40);
  player.pitch += w.recoil*.12;
  let hitType = 0;
  for (let i = 0; i < w.pellets; i++) {
    const d = new THREE.Vector3((Math.random()-.5)*2*w.spread, (Math.random()-.5)*2*w.spread, -1).normalize();
    ray.set(camera.position, d.applyQuaternion(camera.quaternion));
    const wall = ray.intersectObjects(obstacles)[0];
    const e = ray.intersectObjects(enemyParts)[0];
    if (e && (!wall || e.distance < wall.distance)) {
      const head = e.object.userData.head, en = e.object.userData.enemy;
      en.userData.hp -= w.dmg * (head ? 2.5 : 1);
      hitType = Math.max(hitType, head ? 2 : 1);
      if (en.userData.hp <= 0 && enemies.includes(en)) killEnemy(en);
    }
  }
  if (hitType) { const h = $('hitmarker'); h.className = 'on'+(hitType===2?' head':''); setTimeout(() => h.className = '', 90); sfx(900, .05, 'sine', .1); }
  if (w.ammo === 0) reload();
  updateHUD();
}
function killEnemy(en) {
  enemies.splice(enemies.indexOf(en), 1);
  for (let i = enemyParts.length-1; i >= 0; i--) if (enemyParts[i].userData.enemy === en) enemyParts.splice(i, 1);
  scene.remove(en); player.kills++;
  const w = WEAPONS[cur]; w.res += Math.ceil(w.mag/2);
  player.hp = Math.min(100, player.hp+10);
  sfx(300, .25, 'triangle', .15, -200);
  if (!enemies.length) endGame(true); else say('Abate! Restam '+(enemies.length)+' inimigos');
  updateHUD();
}
function hurt(d) {
  player.hp -= d; sfx(120, .15, 'sawtooth', .15);
  const e = $('damage'); e.style.transition = 'none'; e.style.opacity = .9;
  requestAnimationFrame(() => { e.style.transition = 'opacity .4s'; e.style.opacity = 0; });
  updateHUD();
  if (player.hp <= 0) endGame(false);
}

// ---- controle ----
addEventListener('keydown', e => {
  keys[e.code] = true;
  if (!player.alive) return;
  if (e.code === 'KeyR') reload();
  if (e.code.startsWith('Digit')) switchWeapon(+e.code.slice(5)-1);
});
addEventListener('keyup', e => keys[e.code] = false);
addEventListener('mousemove', e => {
  if (document.pointerLockElement !== renderer.domElement) return;
  player.yaw -= e.movementX*.0022;
  player.pitch = Math.max(-1.45, Math.min(1.45, player.pitch - e.movementY*.0022));
});
addEventListener('mousedown', e => { if (player.alive && document.pointerLockElement) { firing = true; shoot(); } });
addEventListener('mouseup', () => firing = false);
addEventListener('wheel', e => { if (player.alive) switchWeapon((cur + (e.deltaY>0?1:-1) + WEAPONS.length) % WEAPONS.length); });
addEventListener('resize', () => { camera.aspect = innerWidth/innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); });
document.addEventListener('pointerlockchange', () => {
  if (!document.pointerLockElement && player.alive) { player.alive = false; paused = true; $('menu').classList.remove('hidden'); $('sub').textContent = 'Jogo pausado.'; $('play').textContent = 'CONTINUAR'; }
});

let paused = false, started = false;
function startGame() {
  renderer.domElement.requestPointerLock();
  $('menu').classList.add('hidden'); $('hud').classList.remove('hidden');
  if (paused) { paused = false; player.alive = true; return; }
  enemies.forEach(e => scene.remove(e)); enemies.length = 0; enemyParts.length = 0;
  Object.assign(player, { x:0, z:0, y:0, vy:0, yaw:0, pitch:0, hp:100, kills:0, alive:true });
  WEAPONS.forEach(w => { w.ammo = w.mag; w.res = w.reserve; });
  cur = 0; reloading = 0; buildGun();
  for (let i = 0; i < NUM_ENEMIES; i++) makeEnemy();
  updateHUD(); say('Elimine todos os inimigos!', 2500);
}
function endGame(win) {
  player.alive = false; firing = false; document.exitPointerLock();
  $('hud').classList.add('hidden'); $('menu').classList.remove('hidden');
  $('sub').innerHTML = win ? '🏆 <b>BOOYAH!</b> Você é o último sobrevivente!<br>Abates: '+player.kills : '💀 Você foi eliminado.<br>Abates: '+player.kills;
  $('play').textContent = 'JOGAR NOVAMENTE'; paused = false;
}
$('play').onclick = startGame;

// ---- loop ----
const clock = new THREE.Clock();
const tmp = new THREE.Vector3();
function update(dt) {
  if (!player.alive) return;
  // movimento
  const f = (keys.KeyW?1:0) - (keys.KeyS?1:0), s = (keys.KeyD?1:0) - (keys.KeyA?1:0);
  const sp = (keys.ShiftLeft ? 10 : 6.5) * dt, len = Math.hypot(f, s) || 1;
  const sin = Math.sin(player.yaw), cos = Math.cos(player.yaw);
  player.x += ((-sin*f + cos*s)/len) * sp;
  player.z += ((-cos*f - sin*s)/len) * sp;
  // chão / pulo
  let gh = 0;
  for (const b of boxes) if (player.x > b.x0 && player.x < b.x1 && player.z > b.z0 && player.z < b.z1 && player.y >= b.h-.35) gh = Math.max(gh, b.h);
  if (keys.Space && player.ground) { player.vy = 7.5; player.ground = false; }
  player.vy -= 20*dt; player.y += player.vy*dt;
  if (player.y <= gh) { player.y = gh; player.vy = 0; player.ground = true; } else if (player.y > gh+.05) player.ground = false;
  pushOut(player, player.radius, player.y);
  player.x = Math.max(-ARENA+1, Math.min(ARENA-1, player.x)); player.z = Math.max(-ARENA+1, Math.min(ARENA-1, player.z));
  if (f || s) bob += dt*(keys.ShiftLeft?14:10);
  camera.position.set(player.x, player.y+1.7+Math.sin(bob)*.03*(f||s?1:0), player.z);
  camera.rotation.set(player.pitch, player.yaw, 0);
  // arma
  recoil = Math.max(0, recoil - dt*.5);
  gunGroup.position.z = -.35 + recoil*2;
  gunGroup.position.y = -.26 + Math.sin(bob*.5)*.008 - (reloading>0?.15:0);
  if (reloading > 0) { reloading -= dt; if (reloading <= 0) { const w = WEAPONS[cur], n = Math.min(w.mag-w.ammo, w.res); w.ammo += n; w.res -= n; updateHUD(); } }
  if (firing && WEAPONS[cur].auto) shoot();
  // inimigos
  const pp = new THREE.Vector3(player.x, 0, player.z);
  for (const e of enemies) {
    const u = e.userData, dx = pp.x-e.position.x, dz = pp.z-e.position.z, dist = Math.hypot(dx, dz);
    e.rotation.y = Math.atan2(-dx, -dz);
    u.st -= dt; if (u.st <= 0) { u.strafe *= -1; u.st = rnd(1, 3); }
    let mx = 0, mz = 0;
    if (dist > 12) { mx = dx/dist; mz = dz/dist; } else if (dist < 6) { mx = -dx/dist; mz = -dz/dist; }
    mx += -dz/dist*u.strafe*.6; mz += dx/dist*u.strafe*.6;
    e.position.x += mx*2.6*dt; e.position.z += mz*2.6*dt;
    pushOut(e.position, u.r, 0);
    e.position.x = Math.max(-ARENA+1, Math.min(ARENA-1, e.position.x)); e.position.z = Math.max(-ARENA+1, Math.min(ARENA-1, e.position.z));
    u.cd -= dt;
    if (u.cd <= 0 && dist < 35) {
      tmp.set(e.position.x, 1.5, e.position.z);
      const dir = camera.position.clone().sub(tmp), d = dir.length();
      ray.set(tmp, dir.normalize());
      const wall = ray.intersectObjects(obstacles)[0];
      if (!wall || wall.distance > d) {
        sfx(220, .08, 'square', .06);
        if (Math.random() < Math.max(.12, .5 - dist/70)) hurt(rnd(6, 11));
      }
      u.cd = rnd(.7, 1.5);
    }
  }
}
function loop() {
  requestAnimationFrame(loop);
  update(Math.min(clock.getDelta(), .05));
  renderer.render(scene, camera);
}
buildGun(); loop();
