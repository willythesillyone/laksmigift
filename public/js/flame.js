export class Flame {
    constructor(position) {
        this.position = position;
        this.isAlive = true;
        this.size = 30;
        this.flickerSpeed = 0.1;
        this.flickerAmount = 5;
        this.time = 0;
        this.baseColor = '#ff9900';
        this.tipColor = '#ffffff';
        this.opacity = 1;
        this.windEffect = 0;
    }

    update(blowIntensity) {
        this.time += this.flickerSpeed;
        
        // Apply blow effect
        if (blowIntensity > 0.5) {
            this.windEffect = blowIntensity * 10;
            this.opacity -= 0.05;
            
            if (this.opacity <= 0) {
                this.isAlive = false;
                this.opacity = 0;
            }
        } else {
            this.windEffect = Math.max(0, this.windEffect - 0.5);
            
            if (this.opacity < 1) {
                this.opacity += 0.01;
            }
        }
        
        // Random flicker
        this.size = 30 + Math.sin(this.time) * this.flickerAmount;
    }

    draw(ctx) {
        if (!this.isAlive) return;
        
        const x = this.position.x;
        const y = this.position.y;
        
        // Flame gradient
        const gradient = ctx.createRadialGradient(
            x, y - this.size/3, this.size * 0.2,
            x, y - this.size/2, this.size
        );
        gradient.addColorStop(0, this.tipColor);
        gradient.addColorStop(0.5, this.baseColor);
        gradient.addColorStop(1, 'transparent');
        
        ctx.save();
        ctx.globalAlpha = this.opacity;
        
        // Draw flame with wind effect
        ctx.beginPath();
        ctx.moveTo(x - this.size/4, y);
        ctx.quadraticCurveTo(
            x - this.size/4 + this.windEffect, 
            y - this.size/2, 
            x, 
            y - this.size
        );
        ctx.quadraticCurveTo(
            x + this.size/4 + this.windEffect, 
            y - this.size/2, 
            x + this.size/4, 
            y
        );
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Flame core
        ctx.beginPath();
        ctx.ellipse(
            x, 
            y - this.size/2, 
            this.size/8, 
            this.size/2, 
            0, 
            0, 
            Math.PI * 2
        );
        ctx.fillStyle = this.tipColor;
        ctx.fill();
        
        ctx.restore();
    }
}
