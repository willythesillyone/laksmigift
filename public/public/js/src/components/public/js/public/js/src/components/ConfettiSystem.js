import { Vector2 } from '../utils/math.js';

export class ConfettiSystem {
    constructor() {
        this.particles = [];
        this.colors = [
            '#ff0000', '#00ff00', '#0000ff', '#ffff00', 
            '#ff00ff', '#00ffff', '#ff9900', '#9900ff'
        ];
        this.reset();
    }

    reset() {
        this.particles = [];
    }

    update() {
        // Add new particles
        if (this.particles.length < 500 && Math.random() < 0.3) {
            this.particles.push(this.createParticle());
        }
        
        // Update existing particles
        this.particles.forEach(particle => {
            particle.position.add(particle.velocity);
            particle.velocity.y += 0.1; // gravity
            particle.velocity.x *= 0.99; // air resistance
            particle.rotation += particle.rotationSpeed;
            particle.life--;
        });
        
        // Remove dead particles
        this.particles = this.particles.filter(p => p.life > 0);
    }

    createParticle() {
        return {
            position: new Vector2(
                Math.random() * window.innerWidth,
                -20
            ),
            velocity: new Vector2(
                Math.random() * 4 - 2,
                Math.random() * -3 - 1
            ),
            size: Math.random() * 10 + 5,
            color: this.colors[Math.floor(Math.random() * this.colors.length)],
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.2,
            life: Math.random() * 100 + 100,
            shape: Math.random() > 0.5 ? 'rect' : 'circle'
        };
    }

    draw(ctx) {
        this.particles.forEach(particle => {
            ctx.save();
            ctx.translate(particle.position.x, particle.position.y);
            ctx.rotate(particle.rotation);
            ctx.globalAlpha = Math.min(1, particle.life / 50);
            
            ctx.fillStyle = particle.color;
            
            if (particle.shape === 'rect') {
                ctx.fillRect(
                    -particle.size/2, 
                    -particle.size/2, 
                    particle.size, 
                    particle.size
                );
            } else {
                ctx.beginPath();
                ctx.arc(0, 0, particle.size/2, 0, Math.PI * 2);
                ctx.fill();
            }
            
            ctx.restore();
        });
    }
}
