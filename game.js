const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Ekran ölçülərinə uyğunlaşdır
canvas.width = 400;
canvas.height = 600;

// Oyun dəyişənləri
let score = 0;
let gameActive = true;
let frames = 0;

// Paket (Bizim Qəhrəman)
const packet = {
    x: 50,
    y: 150,
    w: 30,
    h: 30,
    gravity: 0.6,
    velocity: 0,
    jump: -8,
    draw: function() {
        ctx.fillStyle = "#00ff41";
        ctx.fillRect(this.x, this.y, this.w, this.h);
        // Kiber effekt üçün kənarlara işıq
        ctx.strokeStyle = "#fff";
        ctx.strokeRect(this.x, this.y, this.w, this.h);
    },
    update: function() {
        this.velocity += this.gravity;
        this.y += this.velocity;
        
        if (this.y + this.h > canvas.height) {
            this.y = canvas.height - this.h;
            stopGame();
        }
    }
};

// Firewall Maneələri
const obstacles = [];
function createObstacle() {
    let gap = 150;
    let minH = 50;
    let h = Math.floor(Math.random() * (canvas.height - gap - (minH * 2))) + minH;
    obstacles.push({ x: canvas.width, top: h, bottom: canvas.height - h - gap });
}

function updateObstacles() {
    if (frames % 100 === 0) createObstacle();
    
    obstacles.forEach((obs, index) => {
        obs.x -= 3;
        
        // Toqquşma yoxlanışı (Sənin kiber-məntiqin)
        if (packet.x + packet.w > obs.x && packet.x < obs.x + 50) {
            if (packet.y < obs.top || packet.y + packet.h > canvas.height - obs.bottom) {
                stopGame();
            }
        }

        if (obs.x + 50 < 0) {
            obstacles.splice(index, 1);
            score++;
        }

        // Maneələri çək
        ctx.fillStyle = "#ff003c"; // Təhlükəli Firewall rəngi
        ctx.fillRect(obs.x, 0, 50, obs.top);
        ctx.fillRect(obs.x, canvas.height - obs.bottom, 50, obs.bottom);
    });
}

function stopGame() {
    gameActive = false;
    alert("SYSTEM CRASHED! Score: " + score);
    location.reload(); // Yenidən başlat
}

function loop() {
    if (!gameActive) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    packet.update();
    packet.draw();
    updateObstacles();
    
    frames++;
    requestAnimationFrame(loop);
}

// İdarəetmə
window.addEventListener('keydown', (e) => {
    if (e.code === "Space") packet.velocity = packet.jump;
});

window.addEventListener('touchstart', () => {
    packet.velocity = packet.jump;
});

// Oyunu başlat
loop();
console.log("RootEscape Engine v1.0 Initialized...");
