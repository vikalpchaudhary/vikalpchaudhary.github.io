// Interactive 2D Liquid Gradient Blob Engine for Portfolio Backdrop
// Replaces Three.js WebGL rendering with a highly performant and stable 2D canvas context

document.addEventListener('DOMContentLoaded', () => {
    // 1. Select Canvas and context
    const canvas = document.getElementById('webgl-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // 2. State & Interpolation variables
    let currentScrollPercent = 0;
    let targetScrollPercent = 0;
    
    let mouseX = 0;
    let mouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    // Track window dimensions
    let width = window.innerWidth;
    let height = window.innerHeight;

    // 3. Resize Handler
    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        
        // Compensate for Retina displays (double pixels)
        const dpr = Math.min(window.devicePixelRatio, 2);
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
    }
    resize();
    window.addEventListener('resize', resize);

    // 4. Mouse movement handler (Normalized coordinates -1 to 1)
    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / width) * 2 - 1;
        mouseY = (e.clientY / height) * 2 - 1;
    });

    // 5. Scroll progress tracker
    window.addEventListener('scroll', () => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollHeight > 0) {
            targetScrollPercent = window.scrollY / scrollHeight;
        }
    });

    // 6. Define Blob Colors (matching our warm sage/coral design system)
    const COLORS = {
        sageGreen: 'rgba(127, 163, 146, 0.7)',
        peachCoral: 'rgba(226, 147, 117, 0.7)',
        warmLinen: 'rgba(228, 226, 220, 0.7)'
    };

    // 7. Define Blob Position States per section (Hero, About, Projects, Resume, Contact)
    // Coords are represented as percentages of viewport size (0 to 1)
    const blobStates = [
        // Section 0: Hero (Blobs grouped towards the right / center)
        [
            { x: 0.75, y: 0.3, radius: 280, color: COLORS.sageGreen },
            { x: 0.85, y: 0.75, radius: 320, color: COLORS.peachCoral },
            { x: 0.5, y: 0.5, radius: 250, color: COLORS.warmLinen }
        ],
        // Section 1: About (Blobs grouped towards the left side to highlight text on right)
        [
            { x: 0.2, y: 0.5, radius: 300, color: COLORS.sageGreen },
            { x: 0.3, y: 0.85, radius: 260, color: COLORS.peachCoral },
            { x: 0.15, y: 0.2, radius: 320, color: COLORS.warmLinen }
        ],
        // Section 2: Projects (Spread out to act as horizontal background dividers)
        [
            { x: 0.8, y: 0.2, radius: 280, color: COLORS.sageGreen },
            { x: 0.2, y: 0.8, radius: 300, color: COLORS.peachCoral },
            { x: 0.7, y: 0.6, radius: 350, color: COLORS.warmLinen }
        ],
        // Section 3: Resume (Spotlight on the right with a diagonal layout)
        [
            { x: 0.2, y: 0.3, radius: 260, color: COLORS.warmLinen },
            { x: 0.85, y: 0.5, radius: 320, color: COLORS.sageGreen },
            { x: 0.5, y: 0.8, radius: 280, color: COLORS.peachCoral }
        ],
        // Section 4: Contact (Centered glow spots)
        [
            { x: 0.5, y: 0.75, radius: 340, color: COLORS.sageGreen },
            { x: 0.5, y: 0.25, radius: 280, color: COLORS.peachCoral },
            { x: 0.3, y: 0.5, radius: 300, color: COLORS.warmLinen }
        ]
    ];

    // Initialize Blobs at Section 0 positions
    const blobs = [
        { x: width * 0.75, y: height * 0.3, radius: 280, color: COLORS.sageGreen, angle: 0, speed: 0.015 },
        { x: width * 0.85, y: height * 0.75, radius: 320, color: COLORS.peachCoral, angle: Math.PI / 3, speed: 0.012 },
        { x: width * 0.5, y: height * 0.5, radius: 250, color: COLORS.warmLinen, angle: Math.PI * 2 / 3, speed: 0.01 }
    ];

    // 8. Interpolate values between sections based on scroll
    function getInterpolatedState(percent) {
        const segments = blobStates.length - 1;
        const scaledVal = percent * segments;
        const index = Math.floor(scaledVal);
        const fraction = scaledVal - index;

        if (index >= segments) {
            return blobStates[segments];
        }

        const start = blobStates[index];
        const end = blobStates[index + 1];

        return start.map((startBlob, i) => {
            const endBlob = end[i];
            return {
                x: startBlob.x + (endBlob.x - startBlob.x) * fraction,
                y: startBlob.y + (endBlob.y - startBlob.y) * fraction,
                radius: startBlob.radius + (endBlob.radius - startBlob.radius) * fraction,
                color: startBlob.color
            };
        });
    }

    // 9. Main Animation Loop
    let time = 0;
    function draw() {
        time += 0.05;
        ctx.clearRect(0, 0, width, height);

        // A. Interpolate scroll position with easing
        currentScrollPercent += (targetScrollPercent - currentScrollPercent) * 0.08;
        const targetState = getInterpolatedState(currentScrollPercent);

        // B. Eased mouse parallax offset
        currentMouseX += (mouseX - currentMouseX) * 0.06;
        currentMouseY += (mouseY - currentMouseY) * 0.06;

        // C. Update and render each blob
        blobs.forEach((blob, i) => {
            const targetBlob = targetState[i];
            
            // Calculate base target position in pixels based on current scroll state
            let tx = targetBlob.x * width;
            let ty = targetBlob.y * height;

            // Add mouse parallax displacement (blobs shift up to 80px based on mouse)
            tx += currentMouseX * 60;
            ty += currentMouseY * 60;

            // Add a subtle, organic float noise using trigonometric waves
            blob.angle += blob.speed;
            const floatX = Math.sin(blob.angle + i * 2) * 35;
            const floatY = Math.cos(blob.angle * 0.8 + i) * 35;

            tx += floatX;
            ty += floatY;

            // Smoothly move blob to final target
            blob.x += (tx - blob.x) * 0.08;
            blob.y += (ty - blob.y) * 0.08;
            
            // Interpolate radius size
            blob.radius += (targetBlob.radius - blob.radius) * 0.08;

            // Draw Blob circle with gradient fill
            const gradient = ctx.createRadialGradient(
                blob.x, blob.y, 0,
                blob.x, blob.y, blob.radius
            );
            gradient.addColorStop(0, blob.color);
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

            ctx.beginPath();
            ctx.fillStyle = gradient;
            ctx.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2);
            ctx.fill();
        });

        requestAnimationFrame(draw);
    }

    // Start drawing
    draw();
});
