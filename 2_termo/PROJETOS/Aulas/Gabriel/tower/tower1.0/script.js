const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Estado do Jogo
let baseHp = 20;
let wave = 1;
let enemiesLeftInWave = 5;
let spawnTimer = 0;

const p1 = { gold: 100, cost: 50, color: "#0066cc", type: "fast" };
const p2 = { gold: 100, cost: 75, color: "#cc0033", type: "heavy" };

const towers = [];
const enemies = [];
const projectiles = [];

// Guarda a posição atual do mouse no canvas
let mouseX = 0;
let mouseY = 0;

canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
});

// Escuta comandos do teclado para colocar torres
window.addEventListener("keydown", (e) => {
    if (e.key === "1") { // Jogador 1 compra
        if (p1.gold >= p1.cost) {
            towers.push({ x: mouseX, y: mouseY, range: 120, fireRate: 30, cooldown: 0, damage: 1, color: p1.color, type: 'p1' });
            p1.gold -= p1.cost;
            document.getElementById("p1-gold").innerText = p1.gold;
        }
    }
    if (e.key === "2") { // Jogador 2 compra
        if (p2.gold >= p2.cost) {
            towers.push({ x: mouseX, y: mouseY, range: 180, fireRate: 60, cooldown: 0, damage: 3, color: p2.color, type: 'p2' });
            p2.gold -= p2.cost;
            document.getElementById("p2-gold").innerText = p2.gold;
        }
    }
});

// Loop principal do jogo
function gameLoop() {
    if (baseHp <= 0) {
        ctx.fillStyle = "rgba(0,0,0,0.8)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "red";
        ctx.font = "40px Arial";
        ctx.fillText("FIM DE JOGO!", canvas.width/2 - 120, canvas.height/2);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhar "Estrada" / Caminho simples da esquerda para a direita
    ctx.fillStyle = "#444";
    ctx.fillRect(0, 180, canvas.width, 40);

    // Sistema de Waves / Inimigos
    spawnTimer++;
    if (spawnTimer > 90 && enemiesLeftInWave > 0) {
        enemies.push({ x: 0, y: 200, hp: 3 + wave * 2, maxHp: 3 + wave * 2, speed: 1.5 + (wave * 0.1) });
        enemiesLeftInWave--;
        spawnTimer = 0;
    }

    // Se limpar a horda, começa a próxima
    if (enemies.length === 0 && enemiesLeftInWave === 0) {
        wave++;
        enemiesLeftInWave = 5 + wave * 2;
        p1.gold += 50; // Bônus de horda
        p2.gold += 50;
        document.getElementById("p1-gold").innerText = p1.gold;
        document.getElementById("p2-gold").innerText = p2.gold;
        document.getElementById("wave-counter").innerText = wave;
    }

    // Atualizar e Desenhar Inimigos
    for (let i = enemies.length - 1; i >= 0; i--) {
        let e = enemies[i];
        e.x += e.speed;

        // Desenha inimigo
        ctx.fillStyle = "#2ecc71";
        ctx.beginPath();
        ctx.arc(e.x, e.y, 12, 0, Math.PI * 2);
        ctx.fill();

        // Barra de vida do inimigo
        ctx.fillStyle = "red";
        ctx.fillRect(e.x - 12, e.y - 20, 24, 4);
        ctx.fillStyle = "green";
        ctx.fillRect(e.x - 12, e.y - 20, (e.hp / e.maxHp) * 24, 4);

        // Chegou no fim da linha (Dano na Base)
        if (e.x >= canvas.width) {
            baseHp--;
            document.getElementById("base-hp").innerText = baseHp;
            enemies.splice(i, 1);
        }
    }

    // Atualizar e Desenhar Torres
    towers.forEach(t => {
        ctx.fillStyle = t.color;
        ctx.fillRect(t.x - 15, t.y - 15, 30, 30);

        if (t.cooldown > 0) t.cooldown--;

        // Procurar alvo mais próximo
        let target = null;
        let minDist = t.range;

        enemies.forEach(e => {
            let dist = Math.hypot(e.x - t.x, e.y - t.y);
            if (dist < minDist) {
                minDist = dist;
                target = e;
            }
        });

        // Atirar se tiver alvo pronto
        if (target && t.cooldown === 0) {
            projectiles.push({ x: t.x, y: t.y, target: target, damage: t.damage, color: t.color, speed: 5 });
            t.cooldown = t.fireRate;
        }
    });

    // Atualizar e Desenhar Projéteis
    for (let i = projectiles.length - 1; i >= 0; i--) {
        let p = projectiles[i];
        
        // Verifica se o alvo ainda existe
        if (!enemies.includes(p.target)) {
            projectiles.splice(i, 1);
            continue;
        }

        // Mover em direção ao alvo
        let angle = Math.atan2(p.target.y - p.y, p.target.x - p.x);
        p.x += Math.cos(angle) * p.speed;
        p.y += Math.sin(angle) * p.speed;

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
        ctx.fill();

        // Colisão com o alvo
        if (Math.hypot(p.target.x - p.x, p.target.y - p.y) < 10) {
            p.target.hp -= p.damage;
            
            // Se matou o inimigo, recompensa quem causou o dano / matou
            if (p.target.hp <= 0) {
                let index = enemies.indexOf(p.target);
                if (index > -1) {
                    enemies.splice(index, 1);
                    // Divide o ouro do monstro para ambos os jogadores de forma cooperativa
                    p1.gold += 15;
                    p2.gold += 15;
                    document.getElementById("p1-gold").innerText = p1.gold;
                    document.getElementById("p2-gold").innerText = p2.gold;
                }
            }
            projectiles.splice(i, 1);
        }
    }

    // Desenhar indicador visual de onde a torre vai ser colocada
    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.beginPath();
    ctx.arc(mouseX, mouseY, 20, 0, Math.PI * 2);
    ctx.stroke();

    requestAnimationFrame(gameLoop);
}

// Iniciar o jogo
gameLoop();