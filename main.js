const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

class Particle {
    constructor(type = 'star') {
        this.type = type;
        this.reset();
    }

    reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;

        if (this.type === 'star') {
            this.size = Math.random() * 2;
            this.speedX = (Math.random() - 0.5) * 0.2;
            this.speedY = (Math.random() - 0.5) * 0.2;
            this.opacity = Math.random() * 0.8;
            this.color = `rgba(255, 255, 255, ${this.opacity})`;
        } else {
            // Nebula cloud
            this.size = Math.random() * 100 + 50;
            this.speedX = (Math.random() - 0.5) * 0.1;
            this.speedY = (Math.random() - 0.5) * 0.1;
            this.opacity = Math.random() * 0.03;
            const colors = ['rgba(10, 10, 10,', 'rgba(20, 20, 20,', 'rgba(5, 5, 5,'];
            this.color = colors[Math.floor(Math.random() * colors.length)] + ` ${this.opacity})`;
        }
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < -100 || this.x > width + 100 || this.y < -100 || this.y > height + 100) {
            this.reset();
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        if (this.type === 'star') {
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        } else {
            // Soft glow for nebula
            const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
            grad.addColorStop(0, this.color);
            grad.addColorStop(1, 'transparent');
            ctx.fillStyle = grad;
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        }
        ctx.fill();
    }
}

// Solar System Data
const planetsData = [
    { id: 'btc', label: 'BTC', orbit: 180, speed: 0.012, size: 36, image: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitcoin/info/logo.png' },
    { id: 'eth', label: 'ETH', orbit: 280, speed: 0.010, size: 32, image: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png' },
    { id: 'sol', label: 'SOL', orbit: 380, speed: 0.015, size: 30, image: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png' },
    { id: 'bnb', label: 'BNB', orbit: 480, speed: 0.008, size: 34, image: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/info/logo.png' },
    { id: 'pepe', label: 'PEPE', orbit: 600, speed: 0.006, size: 28, image: 'https://cryptologos.cc/logos/pepe-pepe-logo.png' },
    { id: 'doge', label: 'DOGE', orbit: 750, speed: 0.005, size: 30, image: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/doge/info/logo.png' },
    { id: 'atom', label: 'ATOM', orbit: 950, speed: 0.003, size: 45, image: 'bot_pfp.jpg' }
];

class Planet {
    constructor(data) {
        this.data = data;
        this.angle = Math.random() * Math.PI * 2;
        this.element = document.createElement('div');
        this.element.className = `planet planet-${data.id}`;

        const img = document.createElement('img');
        img.src = data.image;
        img.alt = data.label;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.borderRadius = '50%';
        img.style.objectFit = 'cover';

        this.element.appendChild(img);

        this.element.style.width = `${data.size}px`;
        this.element.style.height = `${data.size}px`;
        const solarSystem = document.getElementById('solar-system');
        if (solarSystem) solarSystem.appendChild(this.element);
    }

    update() {
        this.angle += this.data.speed;
        const x = Math.cos(this.angle) * this.data.orbit;
        const y = Math.sin(this.angle) * (this.data.orbit * 0.5);

        const z = Math.sin(this.angle);
        const scale = 1 + z * 0.3;
        const brightness = 1 + z * 0.5;
        const zIndex = Math.floor((z + 1) * 10);

        this.element.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${scale})`;
        this.element.style.zIndex = zIndex;
        this.element.style.filter = `brightness(${brightness}) drop-shadow(0 0 10px rgba(255,255,255,0.2))`;
    }
}

let orbits = [];

function init() {
    resize();
    particles = [];
    for (let i = 0; i < 200; i++) particles.push(new Particle('star'));
    for (let i = 0; i < 15; i++) particles.push(new Particle('nebula'));

    orbits = planetsData.map(data => new Planet(data));
}

function drawOrbits() {
    planetsData.forEach(p => {
        ctx.beginPath();
        ctx.ellipse(width / 2, height / 2, p.orbit, p.orbit * 0.5, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        ctx.stroke();
    });
}

function drawConnections() {
    const stars = particles.filter(p => p.type === 'star');
    for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
            const dx = stars[i].x - stars[j].x;
            const dy = stars[i].y - stars[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(255, 255, 255, ${0.08 * (1 - distance / 100)})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(stars[i].x, stars[i].y);
                ctx.lineTo(stars[j].x, stars[j].y);
                ctx.stroke();
            }
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.filter(p => p.type === 'nebula').forEach(p => { p.update(); p.draw(); });
    drawOrbits();
    particles.filter(p => p.type === 'star').forEach(p => { p.update(); p.draw(); });
    drawConnections();
    orbits.forEach(o => o.update());
    requestAnimationFrame(animate);
}

window.addEventListener('resize', resize);
init();
animate();

// Mobile Menu Close on Click
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
        const toggle = document.getElementById('nav-toggle');
        if (toggle) toggle.checked = false;
    });
});

// Intersection Observer for scroll animations
const observerOptions = { threshold: 0.1 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (entry.target.classList.contains('features-sync')) {
                Array.from(entry.target.children).forEach((child, index) => {
                    setTimeout(() => {
                        child.style.opacity = '1';
                        child.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            } else {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        }
    });
}, observerOptions);

document.querySelectorAll('.features-sync, .dex-preview').forEach(el => {
    if (el.classList.contains('features-sync')) {
        Array.from(el.children).forEach(child => {
            child.style.opacity = '0';
            child.style.transform = 'translateY(30px)';
            child.style.transition = 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)';
        });
    } else {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)';
    }
    observer.observe(el);
});

// DEX Price Flickering
const priceLabel = document.querySelector('.dex-price-label');
if (priceLabel) {
    setInterval(() => {
        const basePrice = 142.50;
        const change = (Math.random() - 0.5) * 0.5;
        const newPrice = (basePrice + change).toFixed(2);
        priceLabel.textContent = `$${newPrice}`;
        priceLabel.style.color = change > 0 ? '#4ade80' : '#f87171';
        setTimeout(() => { priceLabel.style.color = '#fff'; }, 500);
    }, 2000);
}
