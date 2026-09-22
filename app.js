/* =========================================
   NOVA BUSINESS — JAVASCRIPT
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =========================================
     MOBILE NAVIGATION
     ========================================= */

  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");

      const isOpen = navLinks.classList.contains("active");

      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close menu" : "Open menu"
      );

      menuToggle.textContent = isOpen ? "✕" : "☰";
    });

    // Close menu when clicking a navigation link
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");

        menuToggle.setAttribute(
          "aria-label",
          "Open menu"
        );

        menuToggle.textContent = "☰";
      });
    });

    // Close menu when clicking outside
    document.addEventListener("click", (event) => {
      const clickedInsideMenu =
        navLinks.contains(event.target);

      const clickedToggle =
        menuToggle.contains(event.target);

      if (
        !clickedInsideMenu &&
        !clickedToggle &&
        navLinks.classList.contains("active")
      ) {
        navLinks.classList.remove("active");

        menuToggle.setAttribute(
          "aria-label",
          "Open menu"
        );

        menuToggle.textContent = "☰";
      }
    });
  }


  /* =========================================
     DARK MODE
     ========================================= */

  const themeToggle =
    document.getElementById("themeToggle");

  const savedTheme =
    localStorage.getItem("nova-theme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark");

    if (themeToggle) {
      themeToggle.textContent = "☀";
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark");

      const isDark =
        document.body.classList.contains("dark");

      localStorage.setItem(
        "nova-theme",
        isDark ? "dark" : "light"
      );

      themeToggle.textContent =
        isDark ? "☀" : "☾";

      themeToggle.setAttribute(
        "aria-label",
        isDark
          ? "Switch to light mode"
          : "Switch to dark mode"
      );
    });
  }


  /* =========================================
     FOOTER YEAR
     ========================================= */

  const yearElement =
    document.getElementById("year");

  if (yearElement) {
    yearElement.textContent =
      new Date().getFullYear();
  }


  /* =========================================
     SCROLL REVEAL ANIMATION
     ========================================= */

  const revealElements =
    document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {

    const revealObserver =
      new IntersectionObserver(
        (entries, observer) => {

          entries.forEach((entry) => {

            if (entry.isIntersecting) {

              entry.target.classList.add("active");

              observer.unobserve(entry.target);
            }

          });

        },
        {
          threshold: 0.12,
          rootMargin: "0px 0px -40px 0px"
        }
      );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });

  } else {

    // Fallback for older browsers
    revealElements.forEach((element) => {
      element.classList.add("active");
    });

  }


  /* =========================================
     CONTACT FORM
     ========================================= */

  const contactForm =
    document.getElementById("contactForm");

  const formMessage =
    document.getElementById("formMessage");

  if (contactForm && formMessage) {

    contactForm.addEventListener("submit", (event) => {

      event.preventDefault();

      const name =
        document.getElementById("name").value.trim();

      const email =
        document.getElementById("email").value.trim();

      const service =
        document.getElementById("service").value;

      const message =
        document.getElementById("message").value.trim();


      /* Basic validation */

      if (!name || !email || !message) {

        formMessage.textContent =
          "Please fill in all required fields.";

        formMessage.className =
          "form-message error";

        return;
      }


      /* Email validation */

      const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(email)) {

        formMessage.textContent =
          "Please enter a valid email address.";

        formMessage.className =
          "form-message error";

        return;
      }


      /* Simulated submission */

      const submitButton =
        contactForm.querySelector(
          ".form-submit"
        );

      const originalText =
        submitButton.textContent;

      submitButton.disabled = true;

      submitButton.textContent =
        "Sending...";

      formMessage.textContent = "";

      setTimeout(() => {

        formMessage.textContent =
          "Thanks! Your message has been received. We'll be in touch soon.";

        formMessage.className =
          "form-message success";

        submitButton.disabled = false;

        submitButton.textContent =
          originalText;

        contactForm.reset();

      }, 1200);

    });
  }


  /* =========================================
     ACTIVE NAVIGATION LINK
     ========================================= */

  const sections =
    document.querySelectorAll("main section[id]");

  const navItems =
    document.querySelectorAll(
      '.nav-links a[href^="#"]'
    );

  if (
    sections.length &&
    navItems.length &&
    "IntersectionObserver" in window
  ) {

    const sectionObserver =
      new IntersectionObserver(
        (entries) => {

          entries.forEach((entry) => {

            if (entry.isIntersecting) {

              const currentId =
                entry.target.getAttribute("id");

              navItems.forEach((link) => {

                link.classList.remove("active");

                if (
                  link.getAttribute("href") ===
                  `#${currentId}`
                ) {
                  link.classList.add("active");
                }

              });

            }

          });

        },
        {
          threshold: 0.25,
          rootMargin: "-80px 0px -45% 0px"
        }
      );

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });

  }


  /* =========================================
     NAVBAR SCROLL EFFECT
     ========================================= */

  const navbar =
    document.querySelector(".navbar");

  if (navbar) {

    const handleNavbarScroll = () => {

      if (window.scrollY > 20) {

        navbar.style.boxShadow =
          "0 8px 30px rgba(17, 24, 39, 0.07)";

      } else {

        navbar.style.boxShadow = "none";

      }

    };

    window.addEventListener(
      "scroll",
      handleNavbarScroll,
      { passive: true }
    );

    handleNavbarScroll();
  }


  /* =========================================
     SMOOTH SCROLL
     ========================================= */

  document
    .querySelectorAll('a[href^="#"]')
    .forEach((link) => {

      link.addEventListener("click", (event) => {

        const targetId =
          link.getAttribute("href");

        if (
          !targetId ||
          targetId === "#"
        ) {
          return;
        }

        const target =
          document.querySelector(targetId);

        if (!target) {
          return;
        }

        event.preventDefault();

        const navbarHeight =
          navbar
            ? navbar.offsetHeight
            : 0;

        const targetPosition =
          target.getBoundingClientRect().top +
          window.scrollY -
          navbarHeight +
          5;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth"
        });

      });

    });


  /* =========================================
     BUTTON RIPPLE EFFECT
     ========================================= */

  document
    .querySelectorAll(".btn")
    .forEach((button) => {

      button.addEventListener(
        "click",
        function (event) {

          const ripple =
            document.createElement("span");

          const rect =
            this.getBoundingClientRect();

          const size =
            Math.max(
              rect.width,
              rect.height
            );

          ripple.style.width =
            `${size}px`;

          ripple.style.height =
            `${size}px`;

          ripple.style.position =
            "absolute";

          ripple.style.borderRadius =
            "50%";

          ripple.style.background =
            "rgba(255,255,255,0.25)";

          ripple.style.transform =
            "translate(-50%, -50%) scale(0)";

          ripple.style.left =
            `${event.clientX - rect.left}px`;

          ripple.style.top =
            `${event.clientY - rect.top}px`;

          ripple.style.pointerEvents =
            "none";

          ripple.style.animation =
            "rippleEffect 0.6s ease-out";

          this.style.position = "relative";
          this.style.overflow = "hidden";

          this.appendChild(ripple);

          setTimeout(() => {
            ripple.remove();
          }, 600);

        }
      );

    });


  /* =========================================
     KEYBOARD ACCESSIBILITY
     ========================================= */

  document.addEventListener(
    "keydown",
    (event) => {

      // Close mobile menu with Escape
      if (
        event.key === "Escape" &&
        navLinks &&
        navLinks.classList.contains("active")
      ) {

        navLinks.classList.remove("active");

        if (menuToggle) {
          menuToggle.textContent = "☰";
          menuToggle.setAttribute(
            "aria-label",
            "Open menu"
          );
        }

      }

    }
  );

});


/* =========================================
   RIPPLE ANIMATION
   ========================================= */

const rippleStyle =
  document.createElement("style");

rippleStyle.textContent = `
  @keyframes rippleEffect {
    to {
      transform: translate(-50%, -50%) scale(2.5);
      opacity: 0;
    }
  }
`;

document.head.appendChild(rippleStyle);