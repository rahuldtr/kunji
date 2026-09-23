import React, { useEffect, useRef } from 'react';

// Flower palette definitions for multi-colored flying botanical particles
interface FlowerColorPalette {
  name: string;
  petalPrimary: string;
  petalSecondary: string;
  centerColor: string;
  shadowColor: string;
}

const FLOWER_PALETTES: FlowerColorPalette[] = [
  // 1. Cherry / Peach Blossom (Soft Rose Pink)
  {
    name: 'cherry-blossom',
    petalPrimary: '#fca5a5',
    petalSecondary: '#f43f5e',
    centerColor: '#fef08a',
    shadowColor: 'rgba(244, 63, 94, 0.3)',
  },
  // 2. Lavender / Lilac Wildflower (Delicate Violet)
  {
    name: 'lavender',
    petalPrimary: '#d8b4fe',
    petalSecondary: '#9333ea',
    centerColor: '#fef08a',
    shadowColor: 'rgba(147, 51, 234, 0.25)',
  },
  // 3. Buttercup / Marigold (Golden Amber)
  {
    name: 'buttercup',
    petalPrimary: '#fde047',
    petalSecondary: '#f59e0b',
    centerColor: '#b45309',
    shadowColor: 'rgba(245, 158, 11, 0.3)',
  },
  // 4. White Meadow Daisy (Pure White with Gold)
  {
    name: 'daisy',
    petalPrimary: '#ffffff',
    petalSecondary: '#f1f5f9',
    centerColor: '#f59e0b',
    shadowColor: 'rgba(100, 116, 139, 0.2)',
  },
  // 5. Coral Poppy / Sweetpea (Vibrant Coral Rose)
  {
    name: 'coral-rose',
    petalPrimary: '#fda4af',
    petalSecondary: '#e11d48',
    centerColor: '#fde047',
    shadowColor: 'rgba(225, 29, 72, 0.3)',
  },
  // 6. Sky Forget-Me-Not (Soft Azure)
  {
    name: 'forget-me-not',
    petalPrimary: '#93c5fd',
    petalSecondary: '#3b82f6',
    centerColor: '#fef08a',
    shadowColor: 'rgba(59, 130, 246, 0.25)',
  },
];

type ParticleType = 'whole-flower' | 'petal' | 'sun-mote';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseVx: number;
  baseVy: number;
  mass: number;
  size: number;
  type: ParticleType;
  palette: FlowerColorPalette;
  petalCount: number;
  // 3D Rotational angles & angular velocities
  rotation: number;          // In-plane spin (roll)
  vRotation: number;
  tilt: number;              // Out-of-plane flip (pitch / flutter)
  vTilt: number;
  flutterPhase: number;      // Aerodynamic oscillation phase
  flutterFreq: number;
  baseOpacity: number;
  currentOpacity: number;
  layer: number;             // 0 = background (small, slower), 1 = midground, 2 = foreground
}

interface SunRay {
  baseAngle: number;         // Angle in radians from sun origin
  width: number;             // Angular spread
  length: number;            // Reach in px
  intensity: number;         // 0 to 1
  pulseSpeed: number;        // Shimmer frequency
  phase: number;
}

interface CloudShadow {
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
  speed: number;
  opacity: number;
}

export const NatureCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = performance.now();
    let width = 0;
    let height = 0;
    let isVisible = !document.hidden;

    // Responsive Canvas Resizing with capped DPI for optimal performance
    const handleResize = () => {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible) {
        lastTime = performance.now();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Dynamic Sunlight Rays originating from the warm upper-left horizon
    const sunRays: SunRay[] = [
      { baseAngle: 0.85, width: 0.22, length: 1400, intensity: 0.45, pulseSpeed: 0.0006, phase: 0 },
      { baseAngle: 1.05, width: 0.18, length: 1500, intensity: 0.55, pulseSpeed: 0.0008, phase: 1.8 },
      { baseAngle: 1.28, width: 0.26, length: 1600, intensity: 0.40, pulseSpeed: 0.0005, phase: 3.4 },
      { baseAngle: 1.48, width: 0.20, length: 1350, intensity: 0.50, pulseSpeed: 0.0007, phase: 5.1 },
      { baseAngle: 0.65, width: 0.15, length: 1250, intensity: 0.35, pulseSpeed: 0.0009, phase: 2.3 },
    ];

    // Dynamic drifting cloud shadows creating natural light and shade play
    const cloudShadows: CloudShadow[] = [
      { x: -300, y: height * 0.4, radiusX: 520, radiusY: 280, speed: 18, opacity: 0.07 },
      { x: width * 0.4, y: height * 0.6, radiusX: 680, radiusY: 340, speed: 24, opacity: 0.09 },
      { x: width * 0.9, y: height * 0.3, radiusX: 460, radiusY: 240, speed: 14, opacity: 0.06 },
    ];

    // Create realistic botanical particles (flowers, petals, and golden sun motes)
    const PARTICLE_COUNT = 48; // Highly optimized for butter-smooth 60fps
    const MOTE_COUNT = 24;

    const createParticle = (spawnOffscreenLeft = false): Particle => {
      const typeRand = Math.random();
      const type: ParticleType = typeRand < 0.45 ? 'whole-flower' : 'petal';
      const palette = FLOWER_PALETTES[Math.floor(Math.random() * FLOWER_PALETTES.length)];
      const layer = Math.random() < 0.3 ? 0 : Math.random() < 0.7 ? 1 : 2;

      // Layer scaling: 0 = far background, 1 = mid, 2 = near
      const sizeMultiplier = layer === 0 ? 0.65 : layer === 1 ? 0.95 : 1.25;
      const baseSize = type === 'whole-flower' ? 10 + Math.random() * 6 : 7 + Math.random() * 4;
      const size = baseSize * sizeMultiplier;

      const baseSpeedX = (45 + Math.random() * 60) * (layer === 0 ? 0.75 : layer === 1 ? 1.0 : 1.25);
      const baseSpeedY = (15 + Math.random() * 30) * (layer === 0 ? 0.8 : 1.0);

      const spawnX = spawnOffscreenLeft ? -60 - Math.random() * 120 : Math.random() * (width + 100);
      const spawnY = -40 + Math.random() * (height * 0.95);

      return {
        x: spawnX,
        y: spawnY,
        vx: baseSpeedX,
        vy: baseSpeedY,
        baseVx: baseSpeedX,
        baseVy: baseSpeedY,
        mass: 0.8 + Math.random() * 0.6,
        size,
        type,
        palette,
        petalCount: Math.random() < 0.7 ? 5 : 8,
        rotation: Math.random() * Math.PI * 2,
        vRotation: (Math.random() - 0.5) * 2.8,
        tilt: Math.random() * Math.PI * 2,
        vTilt: 1.2 + Math.random() * 2.5,
        flutterPhase: Math.random() * Math.PI * 2,
        flutterFreq: 1.5 + Math.random() * 2.0,
        baseOpacity: layer === 0 ? 0.55 : layer === 1 ? 0.8 : 0.95,
        currentOpacity: 0.8,
        layer,
      };
    };

    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => createParticle(false));

    // Sun motes (golden pollen floating gently in rays)
    const sunMotes = Array.from({ length: MOTE_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: 15 + Math.random() * 25,
      vy: -5 + Math.random() * 18,
      size: 1.5 + Math.random() * 2.5,
      baseAlpha: 0.35 + Math.random() * 0.45,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 1.5 + Math.random() * 2.5,
    }));

    // Helper: Draw a delicate 5-petal or 8-petal miniature wildflower
    const drawFlower = (
      ctx: CanvasRenderingContext2D,
      p: Particle,
      cosTilt: number
    ) => {
      const radius = p.size;
      const petalCount = p.petalCount;
      const angleStep = (Math.PI * 2) / petalCount;
      const petalLength = radius * 0.95;
      const petalWidth = radius * (petalCount === 5 ? 0.58 : 0.42);

      ctx.save();
      // Apply 3D aerodynamic perspective tumble
      ctx.scale(1, cosTilt);

      // Petals
      for (let i = 0; i < petalCount; i++) {
        ctx.save();
        ctx.rotate(i * angleStep);

        const grad = ctx.createLinearGradient(0, 0, petalLength, 0);
        grad.addColorStop(0, p.palette.petalPrimary);
        grad.addColorStop(0.7, p.palette.petalPrimary);
        grad.addColorStop(1, p.palette.petalSecondary);

        ctx.fillStyle = grad;
        ctx.beginPath();
        // Organic rounded petal shape
        ctx.ellipse(petalLength * 0.55, 0, petalLength * 0.5, petalWidth * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Subtle petal spine highlight
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(2, 0);
        ctx.lineTo(petalLength * 0.8, 0);
        ctx.stroke();

        ctx.restore();
      }

      // Center Pistil / Golden Core
      const centerRadius = radius * 0.28;
      ctx.fillStyle = p.palette.centerColor;
      ctx.beginPath();
      ctx.arc(0, 0, centerRadius, 0, Math.PI * 2);
      ctx.fill();

      // Golden pollen highlight rim
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-centerRadius * 0.3, -centerRadius * 0.3, centerRadius * 0.4, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    // Helper: Draw an individual wind-blown petal
    const drawPetal = (
      ctx: CanvasRenderingContext2D,
      p: Particle,
      cosTilt: number
    ) => {
      const len = p.size * 1.35;
      const w = p.size * 0.75;

      ctx.save();
      ctx.scale(1, cosTilt);

      const grad = ctx.createLinearGradient(0, -len * 0.5, 0, len * 0.5);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.3, p.palette.petalPrimary);
      grad.addColorStop(1, p.palette.petalSecondary);

      ctx.fillStyle = grad;
      ctx.shadowColor = p.palette.shadowColor;
      ctx.shadowBlur = 4;

      ctx.beginPath();
      ctx.moveTo(0, -len * 0.5);
      ctx.bezierCurveTo(w * 0.85, -len * 0.2, w * 0.9, len * 0.35, 0, len * 0.5);
      ctx.bezierCurveTo(-w * 0.9, len * 0.35, -w * 0.85, -len * 0.2, 0, -len * 0.5);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    };

    // Main 60fps Physics & Render Loop
    const render = (currentTime: number) => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const dt = Math.min((currentTime - lastTime) / 1000, 0.05); // Capped at 50ms to prevent jumps
      lastTime = currentTime;
      const timeSec = currentTime * 0.001;

      // Clear Canvas
      ctx.clearRect(0, 0, width, height);

      // ==========================================
      // 1. DYNAMIC SUNLIGHT RAYS & GOD RAYS
      // ==========================================
      const sunOriginX = width * 0.15;
      const sunOriginY = -40;

      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      sunRays.forEach((ray) => {
        // Shimmering intensity wave
        const dynamicIntensity =
          ray.intensity * (0.65 + 0.35 * Math.sin(timeSec * 0.8 + ray.phase));
        // Slow gentle sweep of ray angles as clouds and atmosphere drift
        const currentAngle = ray.baseAngle + 0.04 * Math.sin(timeSec * 0.25 + ray.phase);

        const endX = sunOriginX + Math.cos(currentAngle) * ray.length;
        const endY = sunOriginY + Math.sin(currentAngle) * ray.length;

        const rayGrad = ctx.createRadialGradient(
          sunOriginX,
          sunOriginY,
          20,
          endX,
          endY,
          ray.length
        );

        rayGrad.addColorStop(0, `rgba(255, 255, 235, ${dynamicIntensity * 0.45})`);
        rayGrad.addColorStop(0.35, `rgba(254, 240, 190, ${dynamicIntensity * 0.25})`);
        rayGrad.addColorStop(0.75, `rgba(251, 207, 232, ${dynamicIntensity * 0.1})`);
        rayGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = rayGrad;
        ctx.beginPath();
        ctx.moveTo(sunOriginX, sunOriginY);
        ctx.arc(
          sunOriginX,
          sunOriginY,
          ray.length,
          currentAngle - ray.width * 0.5,
          currentAngle + ray.width * 0.5
        );
        ctx.closePath();
        ctx.fill();
      });

      ctx.restore();

      // ==========================================
      // 2. DYNAMIC SHADES / DRIFTING CLOUD CANOPY
      // ==========================================
      ctx.save();
      ctx.globalCompositeOperation = 'multiply';

      cloudShadows.forEach((shadow) => {
        // Move shadow slowly across the screen with wind
        shadow.x += shadow.speed * dt;
        if (shadow.x - shadow.radiusX > width) {
          shadow.x = -shadow.radiusX * 1.5;
          shadow.y = Math.random() * height;
        }

        const shadowGrad = ctx.createRadialGradient(
          shadow.x,
          shadow.y,
          0,
          shadow.x,
          shadow.y,
          shadow.radiusX
        );
        shadowGrad.addColorStop(0, `rgba(180, 160, 195, ${shadow.opacity * 1.2})`);
        shadowGrad.addColorStop(0.6, `rgba(195, 175, 205, ${shadow.opacity * 0.6})`);
        shadowGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = shadowGrad;
        ctx.beginPath();
        ctx.ellipse(shadow.x, shadow.y, shadow.radiusX, shadow.radiusY, 0.1, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();

      // ==========================================
      // 3. GOLDEN SUN MOTES / POLLEN DUST
      // ==========================================
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      sunMotes.forEach((mote) => {
        mote.x += mote.vx * dt;
        mote.y += (mote.vy + Math.sin(timeSec * 2 + mote.pulse) * 8) * dt;

        if (mote.x > width + 20) mote.x = -20;
        if (mote.y < -20) mote.y = height + 10;
        if (mote.y > height + 20) mote.y = -10;

        const alpha = mote.baseAlpha * (0.6 + 0.4 * Math.sin(timeSec * mote.pulseSpeed + mote.pulse));
        ctx.fillStyle = `rgba(255, 250, 215, ${alpha})`;
        ctx.beginPath();
        ctx.arc(mote.x, mote.y, mote.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();

      // ==========================================
      // 4. REAL PARTICLE PHYSICS FOR FLYING FLOWERS
      // ==========================================
      // Center coordinates & exclusion radius for the central miTmood flower:
      // Petals smoothly deflect around or pass unobtrusively behind without clustering!
      const flowerCenterX = width * 0.5;
      const flowerCenterY = height * 0.5;
      const flowerExclusionRadius = Math.min(width, height) * 0.32;

      // Dynamic wind vector with turbulent micro-eddies
      const baseWindX = 85;
      const windTurbulence = Math.sin(timeSec * 0.7) * 25 + Math.cos(timeSec * 1.4) * 12;

      particles.forEach((p) => {
        // Wind field force at particle height
        const localWindX = baseWindX + windTurbulence + Math.sin(p.y * 0.008 + timeSec) * 15;
        const localWindY = 18 + Math.cos(p.x * 0.006 + timeSec * 0.9) * 12;

        // Aerodynamic drag force: F_drag = -0.5 * Cd * (v - v_wind)^2
        const relVx = p.vx - localWindX;
        const relVy = p.vy - localWindY;
        const dragCoeff = 1.4 / p.mass;

        p.vx -= relVx * dragCoeff * dt;
        p.vy -= relVy * dragCoeff * dt;

        // Aerodynamic flutter / lift oscillation (falling petal glide phenomenon)
        p.flutterPhase += p.flutterFreq * dt;
        const flutterLift = Math.sin(p.flutterPhase) * 16;
        p.vy += (flutterLift - 8) * dt; // Gentle downward gravity bias

        // Central flower avoidance: gentle streamline deflection
        const dx = p.x - flowerCenterX;
        const dy = p.y - flowerCenterY;
        const distFromCenter = Math.hypot(dx, dy);

        if (distFromCenter < flowerExclusionRadius && distFromCenter > 1) {
          const proximity = 1 - distFromCenter / flowerExclusionRadius;
          const pushForce = proximity * 65;
          // Smoothly guide flow around the flower
          p.vx += (dx / distFromCenter) * pushForce * dt;
          p.vy += (dy / distFromCenter) * pushForce * dt;
          // Soften opacity so it never obstructs petal interaction or numbers
          p.currentOpacity = p.baseOpacity * (0.35 + 0.65 * (distFromCenter / flowerExclusionRadius));
        } else {
          // Normal opacity
          p.currentOpacity = p.baseOpacity;
        }

        // Integrate positions
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        // 3D Rotational physics: spin (roll) and tumble (pitch)
        p.rotation += p.vRotation * dt;
        p.tilt += p.vTilt * dt;

        // Boundary wrap: recycle particle smoothly to the left/top
        if (p.x > width + 80 || p.y > height + 80) {
          const fresh = createParticle(true);
          Object.assign(p, fresh);
        }

        // ==========================================
        // 5. RENDER PARTICLE
        // ==========================================
        const cosTilt = Math.abs(Math.cos(p.tilt)) * 0.75 + 0.25; // 3D perspective flip

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.currentOpacity;

        if (p.type === 'whole-flower') {
          drawFlower(ctx, p, cosTilt);
        } else {
          drawPetal(ctx, p, cosTilt);
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none select-none z-0"
      style={{
        // Hardware accelerated composite layer
        willChange: 'transform',
      }}
    />
  );
};
