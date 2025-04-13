import { Flame } from '../../public/js/flame.js';
import { Candle } from '../../public/js/candle.js';
import { Vector2 } from '../utils/math.js';

export class CandleSystem {
    constructor(count) {
        this.candles = [];
        this.allCandlesOut = false;
        this.candleCount = count;
        this.reset();
    }

    reset() {
        this.candles = [];
        this.allCandlesOut = false;
        
        for (let i = 0; i < this.candleCount; i++) {
            this.candles.push(new Candle(
                new Vector2(
                    (i - (this.candleCount - 1) / 2) * 60,
                    -80
                )
            ));
        }
    }

    resize(width, height) {
        this.width = width;
        this.height = height;
    }

    update(blowIntensity) {
        let extinguishedCount = 0;
        
        this.candles.forEach(candle => {
            candle.update(blowIntensity);
            if (!candle.flame.isAlive) extinguishedCount++;
        });
        
        this.allCandlesOut = extinguishedCount === this.candles.length;
    }

    draw(ctx) {
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        
        ctx.save();
        ctx.translate(centerX, centerY);
        
        this.candles.forEach(candle => {
            candle.draw(ctx);
        });
        
        ctx.restore();
    }
}
