import { CandleSystem } from '../src/components/CandleSystem.js';
import { ConfettiSystem } from '../src/components/ConfettiSystem.js';
import { setupAudio } from './audio.js';

class BirthdayApp {
    constructor() {
        this.canvas = document.getElementById('birthdayCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.candleSystem = new CandleSystem(5); // 5 candles
        this.confettiSystem = new ConfettiSystem();
        this.audio = setupAudio();
        this.resize();
        
        window.addEventListener('resize', this.resize.bind(this));
        document.getElementById('resetBtn').addEventListener('click', this.reset.bind(this));
        
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.candleSystem.resize(this.canvas.width, this.canvas.height);
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw cake and decorations
        this.drawCake();
        
        // Update systems
        this.candleSystem.update(this.audio.blowIntensity);
        this.candleSystem.draw(this.ctx);
        
        if (this.candleSystem.allCandlesOut) {
            this.confettiSystem.update();
            this.confettiSystem.draw(this.ctx);
        }
        
        requestAnimationFrame(this.animate.bind(this));
    }

    drawCake() {
        const { width, height } = this.canvas;
        const cakeWidth = 400;
        const cakeHeight = 200;
        
        this.ctx.fillStyle = '#f8c8dc';
        this.ctx.roundRect(
            width/2 - cakeWidth/2, 
            height/2 - cakeHeight/2, 
            cakeWidth, 
            cakeHeight, 
            20
        ).fill();
        
        // Cake decorations
        this.ctx.fillStyle = '#ff69b4';
        this.ctx.beginPath();
        for (let i = 0; i < 10; i++) {
            this.ctx.arc(
                width/2 - cakeWidth/2 + 40 * i, 
                height/2 - cakeHeight/2, 
                10, 
                0, 
                Math.PI * 2
            );
        }
        this.ctx.fill();
    }

    reset() {
        this.candleSystem.reset();
        this.confettiSystem.reset();
        this.audio.playRelightSound();
    }
}

new BirthdayApp();
