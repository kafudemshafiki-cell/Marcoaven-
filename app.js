"use strict";

/* =========================================
   NEXODRA - MAIN JAVASCRIPT
   Clean, responsive and Acode-friendly
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================
       1. MOBILE NAVIGATION
    ===================================== */

    const menuButton = document.querySelector(
        ".mobile-menu-btn, .menu-toggle, #menuToggle"
    );

    const navigation = document.querySelector(
        ".nav-links, .navbar-links, #navLinks"
    );

    if (menuButton && navigation) {
        menuButton.addEventListener("click", function () {
            const isOpen = navigation.classList.toggle("active");

            menuButton.classList.toggle("active", isOpen);
            menuButton.setAttribute("aria-expanded", String(isOpen));
        });

        const navLinks = navigation.querySelectorAll("a");

        navLinks.forEach(function (link) {
            link.addEventListener("click", function () {
                navigation.classList.remove("active");
                menuButton.classList.remove("active");
                menuButton.setAttribute("aria-expanded", "false");
            });
        });

        document.addEventListener("click", function (event) {
            const clickedInsideMenu = navigation.contains(event.target);
            const clickedButton = menuButton.contains(event.target);

            if (!clickedInsideMenu && !clickedButton) {
                navigation.classList.remove("active");
                menuButton.classList.remove("active");
                menuButton.setAttribute("aria-expanded", "false");
            }
        });
    }


    /* =====================================
       2. SMOOTH SCROLLING
    ===================================== */

    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(function (link) {
        link.addEventListener("click", function (event) {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                event.preventDefault();

                targetElement.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });


    /* =====================================
       3. HEADER SCROLL EFFECT
    ===================================== */

    const header = document.querySelector(
        ".site-header, header, .navbar"
    );

    function updateHeader() {
        if (!header) {
            return;
        }

        if (window.scrollY > 30) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    }

    window.addEventListener("scroll", updateHeader, {
        passive: true
    });

    updateHeader();


    /* =====================================
       4. ANIMATED NUMBER COUNTERS
    ===================================== */

    const counters = document.querySelectorAll(
        "[data-count], .counter"
    );

    function animateCounter(counter) {
        if (counter.dataset.animated === "true") {
            return;
        }

        counter.dataset.animated = "true";

        const targetValue = Number(
            counter.getAttribute("data-count") ||
            counter.textContent.replace(/[^0-9.]/g, "")
        );

        if (!Number.isFinite(targetValue)) {
            return;
        }

        const duration = 1500;
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const progress = Math.min(
                (currentTime - startTime) / duration,
                1
            );

            const easedProgress = 1 - Math.pow(1 - progress, 3);
            const currentValue = targetValue * easedProgress;

            if (Number.isInteger(targetValue)) {
                counter.textContent = Math.round(currentValue).toLocaleString();
            } else {
                counter.textContent = currentValue.toFixed(1);
            }

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }

        requestAnimationFrame(updateCounter);
    }

    if ("IntersectionObserver" in window && counters.length > 0) {
        const counterObserver = new IntersectionObserver(
            function (entries, observer) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.3
            }
        );

        counters.forEach(function (counter) {
            counterObserver.observe(counter);
        });
    }


    /* =====================================
       5. SCROLL REVEAL ANIMATIONS
    ===================================== */

    const revealElements = document.querySelectorAll(
        ".reveal, .reveal-up, .fade-in"
    );

    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver(
            function (entries, observer) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12
            }
        );

        revealElements.forEach(function (element) {
            revealObserver.observe(element);
        });
    } else {
        revealElements.forEach(function (element) {
            element.classList.add("visible");
        });
    }


    /* =====================================
       6. PRODUCT SEARCH AND FILTERING
    ===================================== */

    const searchInput = document.querySelector(
        "#productSearch, .product-search"
    );

    const productCards = document.querySelectorAll(
        ".product-card, [data-product]"
    );

    const filterButtons = document.querySelectorAll(
        "[data-filter]"
    );

    let activeFilter = "all";

    function filterProducts() {
        const searchTerm = searchInput
            ? searchInput.value.trim().toLowerCase()
            : "";

        productCards.forEach(function (card) {
            const searchableText = card.textContent.toLowerCase();

            const category = (
                card.getAttribute("data-category") || "all"
            ).toLowerCase();

            const matchesSearch = searchableText.includes(searchTerm);

            const matchesCategory =
                activeFilter === "all" ||
                category === activeFilter;

            card.style.display =
                matchesSearch && matchesCategory ? "" : "none";
        });
    }

    if (searchInput) {
        searchInput.addEventListener("input", filterProducts);
    }

    filterButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            activeFilter = (
                button.getAttribute("data-filter") || "all"
            ).toLowerCase();

            filterButtons.forEach(function (item) {
                item.classList.remove("active");
                item.setAttribute("aria-pressed", "false");
            });

            button.classList.add("active");
            button.setAttribute("aria-pressed", "true");

            filterProducts();
        });
    });


    /* =====================================
       7. FAQ ACCORDION
    ===================================== */

    const faqQuestions = document.querySelectorAll(
        ".faq-question, .accordion-button"
    );

    faqQuestions.forEach(function (question) {
        question.addEventListener("click", function () {
            const answer = question.nextElementSibling;

            if (!answer) {
                return;
            }

            const isExpanded =
                question.getAttribute("aria-expanded") === "true";

            question.setAttribute(
                "aria-expanded",
                String(!isExpanded)
            );

            answer.classList.toggle("active", !isExpanded);

            if (answer.hasAttribute("hidden")) {
                answer.hidden = false;
            } else {
                answer.hidden = isExpanded;
            }
        });
    });


    /* =====================================
       8. NEWSLETTER FORM
    ===================================== */

    const newsletterForm = document.querySelector(
        "#newsletterForm, .newsletter-form"
    );

    if (newsletterForm) {
        newsletterForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const emailInput = newsletterForm.querySelector(
                'input[type="email"]'
            );

            const message = newsletterForm.querySelector(
                ".form-message"
            );

            if (!emailInput) {
                return;
            }

            const email = emailInput.value.trim();

            if (!emailInput.checkValidity() || email === "") {
                emailInput.focus();

                if (message) {
                    message.textContent =
                        "Please enter a valid email address.";
                }

                return;
            }

            if (message) {
                message.textContent =
                    "Thanks! Your email has been validated.";
            }

            /*
             * This is a front-end demonstration.
             * Connect a backend or newsletter service
             * to actually save email subscriptions.
             */

            newsletterForm.reset();
        });
    }


    /* =====================================
       9. CURRENT YEAR IN FOOTER
    ===================================== */

    const yearElements = document.querySelectorAll(
        "#currentYear, .current-year"
    );

    yearElements.forEach(function (element) {
        element.textContent = new Date().getFullYear();
    });


    /* =====================================
       10. BACK TO TOP BUTTON
    ===================================== */

    const backToTopButton = document.querySelector(
        "#backToTop, .back-to-top"
    );

    function updateBackToTop() {
        if (!backToTopButton) {
            return;
        }

        if (window.scrollY > 400) {
            backToTopButton.classList.add("visible");
        } else {
            backToTopButton.classList.remove("visible");
        }
    }

    if (backToTopButton) {
        backToTopButton.addEventListener("click", function () {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });

        window.addEventListener("scroll", updateBackToTop, {
            passive: true
        });

        updateBackToTop();
    }


    /* =====================================
       11. BUTTON CLICK FEEDBACK
    ===================================== */

    const interactiveButtons = document.querySelectorAll(
        ".btn, .button"
    );

    interactiveButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            button.classList.add("button-clicked");

            window.setTimeout(function () {
                button.classList.remove("button-clicked");
            }, 180);
        });
    });


    /* =====================================
       12. CONSOLE MESSAGE
    ===================================== */

    console.log("Nexodra website initialized successfully.");

});