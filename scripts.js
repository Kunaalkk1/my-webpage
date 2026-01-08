document.addEventListener('DOMContentLoaded', () => {
  // --- Theme Toggle (Robust Fix) ---
  const themeBtn = document.getElementById('theme-toggle');
  const body = document.body;
  const icon = themeBtn.querySelector('i');

  function applyTheme(theme) {
    if (theme === 'dark') {
      body.classList.add('dark-mode');
      icon.classList.remove('fa-moon');
      icon.classList.add('fa-sun');
    } else {
      body.classList.remove('dark-mode');
      icon.classList.remove('fa-sun');
      icon.classList.add('fa-moon');
    }
    localStorage.setItem('theme', theme);
  }

  // Initial Load
  const savedTheme = localStorage.getItem('theme') || 'dark';
  applyTheme(savedTheme);

  themeBtn.addEventListener('click', () => {
    const currentTheme = body.classList.contains('dark-mode') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
  });

  // --- Interactive Constellation Background ---
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    // Configuration
    const particleCount = window.innerWidth < 768 ? 50 : 100;
    const connectionDistance = 150;
    const mouseDistance = 200;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = (Math.random() - 0.5) * 1.5;
        this.size = Math.random() * 2 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse Interaction
        if (window.mousePos) { // Assuming mousePos is tracked globally or locally
          const dx = this.x - window.mousePos.x;
          const dy = this.y - window.mousePos.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouseDistance) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (mouseDistance - distance) / mouseDistance;
            const directionX = forceDirectionX * force * 2;
            const directionY = forceDirectionY * force * 2;

            this.x += directionX;
            this.y += directionY;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        const isDark = body.classList.contains('dark-mode');
        ctx.fillStyle = isDark ? 'rgba(108, 92, 231, 0.8)' : 'rgba(45, 55, 72, 0.8)';
        ctx.fill();
      }
    }

    // Initialize Particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Mouse Tracking for Canvas
    window.mousePos = { x: null, y: null };
    window.addEventListener('mousemove', (e) => {
      window.mousePos.x = e.clientX;
      window.mousePos.y = e.clientY;
    });
    window.addEventListener('mouseleave', () => {
      window.mousePos.x = null;
      window.mousePos.y = null;
    });

    function animateCanvas() {
      ctx.clearRect(0, 0, width, height);

      const isDark = body.classList.contains('dark-mode');
      const lineColor = isDark ? 'rgba(162, 155, 254,' : 'rgba(45, 55, 72,';

      particles.forEach((p, index) => {
        p.update();
        p.draw();

        // Draw Connections
        for (let j = index; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            ctx.beginPath();
            const opacity = 1 - (distance / connectionDistance);
            ctx.strokeStyle = `${lineColor}${opacity * 0.5})`;
            ctx.lineWidth = 1;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      requestAnimationFrame(animateCanvas);
    }
    animateCanvas();
  }

  // --- Custom Cursor Logic (Restored) ---
  const cursor = document.getElementById('cursor');
  const cursorBlur = document.getElementById('cursor-blur');

  if (window.matchMedia("(pointer: fine)").matches) {
    document.addEventListener('mousemove', (e) => {
      const { clientX: x, clientY: y } = e;
      cursor.style.transform = `translate(${x}px, ${y}px)`;
      cursorBlur.animate({
        transform: `translate(${x}px, ${y}px)`
      }, { duration: 500, fill: "forwards" });
    });

    const interactiveElements = document.querySelectorAll('a, button, .project-card, .timeline-item');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.transform += ' scale(2)';
        cursor.style.mixBlendMode = 'normal';
        cursor.style.backgroundColor = 'rgba(0, 206, 201, 0.1)';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.transform = cursor.style.transform.replace(' scale(2)', '');
        cursor.style.mixBlendMode = 'difference';
        cursor.style.backgroundColor = 'transparent';
      });
    });
  }

  // --- Typing Effect (Restored) ---
  const words = ["ENGINEER", "DEVELOPER", "PROBLEM SOLVER"];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typeSpeed = 100;
  const deleteSpeed = 50;
  const delayBetweenWords = 2000;
  const typeTarget = document.getElementById('typing-text');

  function typeEffect() {
    const currentWord = words[wordIndex];

    // Update prefix at the start of a new word
    if (charIndex === 0 && !isDeleting) {
      const prefixTarget = document.getElementById('typing-prefix');
      if (prefixTarget) {
        prefixTarget.textContent = (currentWord === "ENGINEER") ? "I'm an " : "I'm a ";
      }
    }


    if (isDeleting) {
      typeTarget.textContent = currentWord.substring(0, charIndex--);
    } else {
      typeTarget.textContent = currentWord.substring(0, charIndex++);
    }

    let nextSpeed = isDeleting ? deleteSpeed : typeSpeed;

    if (!isDeleting && charIndex === currentWord.length + 1) {
      isDeleting = true;
      nextSpeed = delayBetweenWords;
    } else if (isDeleting && charIndex === -1) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      nextSpeed = 500;
    }

    setTimeout(typeEffect, nextSpeed);
  }
  typeEffect();

  // --- Scroll Animations ---
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));

  // --- Mobile Menu ---
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const closeBtn = document.getElementById('close-menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu');

  function toggleMenu() {
    mobileMenu.classList.toggle('active');
  }

  if (mobileBtn) mobileBtn.addEventListener('click', toggleMenu);
  if (closeBtn) closeBtn.addEventListener('click', toggleMenu);
  document.querySelectorAll('.mobile-nav-links a').forEach(link => {
    link.addEventListener('click', toggleMenu);
  });

  // --- 3D Tilt Effect ---
  if (window.matchMedia("(pointer: fine)").matches) {
    document.querySelectorAll('.tilt-element, .glass-card, .project-card').forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const xPct = (x / rect.width) - 0.5;
        const yPct = (y / rect.height) - 0.5;
        el.style.transform = `perspective(1000px) rotateX(${yPct * -10}deg) rotateY(${xPct * 10}deg) scale(1.02)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
      });
    });
  }
});
