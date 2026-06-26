document.addEventListener("DOMContentLoaded", () => {
      // 1. Entrance Fade-in Animations
      const textCol = document.getElementById("hero-text-col");
      const visualCol = document.getElementById("hero-visual-col");
      
      // Delay visual and text column animation slightly for high-end feel
      setTimeout(() => {
        textCol.classList.add("fade-in-active");
      }, 200);

      setTimeout(() => {
        visualCol.classList.add("fade-in-active");
      }, 500);

      // 2. Video remains muted to comply with browser autoplay policies
      const video = document.getElementById("hero-video");

      // 3. Header styling on scroll
      const header = document.getElementById("main-header");
      window.addEventListener("scroll", () => {
        if (window.scrollY > 40) {
          header.classList.add("scrolled");
        } else {
          header.classList.remove("scrolled");
        }
      });

      // 4. Subtle mouse-move depth parallax effect
      // Targeted elements: Background Blobs, Video Frame, and the Floating Cards
      const blob1 = document.getElementById("blob-1");
      const blob2 = document.getElementById("blob-2");
      const blob3 = document.getElementById("blob-3");
      const videoFrame = document.getElementById("video-frame");
      const card2 = document.getElementById("card-2");
      const card3 = document.getElementById("card-3");

      let mouseX = 0;
      let mouseY = 0;
      let targetX = 0;
      let targetY = 0;

      // Listen for mousemove at document level
      document.addEventListener("mousemove", (e) => {
        // Calculate normalized coordinate from center of screen (-0.5 to 0.5)
        targetX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
        targetY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      });

      // Smooth interpolation function
      function lerp(start, end, amt) {
        return (1 - amt) * start + amt * end;
      }

      // Parallax update loop
      function updateParallax() {
        mouseX = lerp(mouseX, targetX, 0.08); // 8% interpolation for high fluid damping
        mouseY = lerp(mouseY, targetY, 0.08);

        // Apply transformations (subtle translate values to avoid user sickness)
        // Blobs move in direction of mouse (creates backing glow depth)
        if (blob1) blob1.style.transform = `translate(${mouseX * 40}px, ${mouseY * 40}px)`;
        if (blob2) blob2.style.transform = `translate(${mouseX * -30}px, ${mouseY * -30}px)`;
        if (blob3) blob3.style.transform = `translate(${mouseX * 25}px, ${mouseY * -25}px)`;

        // Video container tilts or shifts slightly in opposite direction
        if (videoFrame) {
          videoFrame.style.transform = `translate(${mouseX * -8}px, ${mouseY * -8}px) rotateY(${mouseX * 2}deg) rotateX(${mouseY * -2}deg)`;
        }

        // Floating cards move at varied rates to create parallax separation
        if (card2) {
          // Card 2 floats right/down
          card2.style.transform = `translate(${mouseX * -18}px, ${mouseY * -18}px)`;
        }
        if (card3) {
          // Card 3 moves differently
          card3.style.transform = `translate(${mouseX * 12}px, ${mouseY * -12}px)`;
        }

        requestAnimationFrame(updateParallax);
      }

      
            // 5. Testimonials Marquee Intersection Observer
      const animHeader = document.getElementById("testimonials-header");
      const animCards = document.querySelectorAll(".testimonial-card");

      const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
      };

      const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animated");
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);

      if (animHeader) scrollObserver.observe(animHeader);
      animCards.forEach(card => scrollObserver.observe(card));

      // 6. Especialidades Section Intersection Observer (staggered reveal)
      const specialtiesHeader = document.getElementById("specialties-header");
      const specialtyItems = document.querySelectorAll(".specialty-item");

      if (specialtiesHeader) scrollObserver.observe(specialtiesHeader);

      specialtyItems.forEach((item, index) => {
        // Stagger each row slightly for an editorial cascading reveal
        item.style.transitionDelay = `${(index % 3) * 0.12}s`;
        scrollObserver.observe(item);
      });

      // 6b. Sobre a Dra. Simone - Visual & Content reveal
      const aboutVisual = document.getElementById("about-visual-col");
      const aboutContent = document.getElementById("about-content-col");

      if (aboutVisual) scrollObserver.observe(aboutVisual);
      if (aboutContent) scrollObserver.observe(aboutContent);

      // Launch mouse parallax only if on desktop (avoid touch device recalculations)
// Launch mouse parallax only if on desktop (avoid touch device recalculations)
      if (window.innerWidth > 1024) {
        updateParallax();
      }

      // 7. Nav Menu - smooth scroll to sections (in DOM order) + active link highlight
      const navLinks = document.querySelectorAll(".nav-link");
      const navSections = Array.from(navLinks)
        .map(link => document.querySelector(link.getAttribute("href")))
        .filter(Boolean);

      // Smooth-scroll each nav link to its target section, compensating for the fixed header
      navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
          const target = document.querySelector(link.getAttribute("href"));
          if (!target) return;
          e.preventDefault();
          const headerOffset = header.classList.contains("scrolled") ? 75 : 90;
          const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerOffset;
          window.scrollTo({ top: targetPosition, behavior: "smooth" });
        });
      });

      // Highlight the nav link of the section currently in view while scrolling through them
      const navSpyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            navLinks.forEach(link => link.classList.remove("active"));
            const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
            if (activeLink) activeLink.classList.add("active");
          }
        });
      }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });

      navSections.forEach(section => navSpyObserver.observe(section));
    });
