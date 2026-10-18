/* =========================================================
   APP.JS — PREMIUM INTERACTIVE EXPERIENCE
   Features:
   • Animated number counters
   • Interactive charts
   • Smooth navigation
   • Mobile menu
   • Scroll reveal animations
   • Notification system
   • Theme toggle
   • Button interactions
   • Live clock
   • Custom cursor effects
   ========================================================= */

"use strict";

/* =========================================================
   1. GLOBAL UTILITIES
   ========================================================= */

const $ = (selector, parent = document) =>
  parent.querySelector(selector);

const $$ = (selector, parent = document) =>
  [...parent.querySelectorAll(selector)];

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

const random = (min, max) =>
  Math.random() * (max - min) + min;

const clamp = (value, min, max) =>
  Math.min(Math.max(value, min), max);


/* =========================================================
   2. PAGE INITIALIZATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initializeNavigation();
  initializeCounters();
  initializeScrollReveal();
  initializeCharts();
  initializeNotifications();
  initializeThemeToggle();
  initializeTabs();
  initializeInteractiveButtons();
  initializeLiveClock();
  initializeProgressBars();
  initializeTooltips();
  initializeKeyboardShortcuts();

  document.body.classList.add("app-ready");

  console.log(
    "%c✦ Experience initialized successfully",
    "color:#8b5cf6;font-size:14px;font-weight:bold;"
  );
});


/* =========================================================
   3. NAVIGATION
   ========================================================= */

function initializeNavigation() {
  const menuToggle = $(
    "#menuToggle, .menu-toggle, .hamburger"
  );

  const navigation = $(
    "#navigation, .navigation, .nav-links, .sidebar"
  );

  const navLinks = $$(
    ".nav-link, .navigation a, .nav-links a, .sidebar a"
  );

  if (menuToggle && navigation) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navigation.classList.toggle("active");

      menuToggle.classList.toggle("active", isOpen);

      menuToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
      );

      document.body.classList.toggle(
        "menu-open",
        isOpen
      );
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.forEach((item) => {
        item.classList.remove("active");
      });

      link.classList.add("active");

      if (navigation) {
        navigation.classList.remove("active");
      }

      if (menuToggle) {
        menuToggle.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
      }

      document.body.classList.remove("menu-open");
    });
  });

  // Smooth scrolling for in-page links.
  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = $(targetId);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start"
      });

      history.replaceState(null, "", targetId);
    });
  });

  // Highlight navigation links based on visible sections.
  const sections = $$("main section[id], section[id]");

  if ("IntersectionObserver" in window && sections.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const currentId = entry.target.id;

          navLinks.forEach((link) => {
            const href = link.getAttribute("href");

            link.classList.toggle(
              "active",
              href === `#${currentId}`
            );
          });
        });
      },
      {
        threshold: 0.25,
        rootMargin: "-15% 0px -55% 0px"
      }
    );

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }
}


/* =========================================================
   4. ANIMATED COUNTERS
   ========================================================= */

function animateCounter(element) {
  if (element.dataset.animated === "true") return;

  element.dataset.animated = "true";

  const rawTarget =
    element.dataset.target ||
    element.dataset.count ||
    element.textContent.replace(/,/g, "").trim();

  const target = Number(
    String(rawTarget).replace(/[^\d.-]/g, "")
  );

  if (!Number.isFinite(target)) return;

  const duration = prefersReducedMotion ? 0 : 1500;
  const startTime = performance.now();

  const prefix = element.dataset.prefix || "";
  const suffix = element.dataset.suffix || "";

  const decimals = Number(
    element.dataset.decimals || 0
  );

  const formatNumber = (value) =>
    value.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });

  if (duration === 0) {
    element.textContent =
      prefix + formatNumber(target) + suffix;

    return;
  }

  function updateCounter(currentTime) {
    const elapsed = currentTime - startTime;

    const progress = clamp(elapsed / duration, 0, 1);

    // Ease-out cubic animation.
    const easedProgress = 1 - Math.pow(1 - progress, 3);

    const currentValue = target * easedProgress;

    element.textContent =
      prefix + formatNumber(currentValue) + suffix;

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent =
        prefix + formatNumber(target) + suffix;
    }
  }

  requestAnimationFrame(updateCounter);
}

function initializeCounters() {
  const counters = $$(
    "[data-target], [data-count], .counter, .stat-number"
  );

  if (!counters.length) return;

  if (!("IntersectionObserver" in window)) {
    counters.forEach(animateCounter);
    return;
  }

  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.35
    }
  );

  counters.forEach((counter) => {
    counterObserver.observe(counter);
  });
}


/* =========================================================
   5. SCROLL REVEAL ANIMATIONS
   ========================================================= */

function initializeScrollReveal() {
  const revealElements = $$(
    ".reveal, .fade-in, .slide-up, .animate-on-scroll"
  );

  if (!revealElements.length) return;

  if (
    prefersReducedMotion ||
    !("IntersectionObserver" in window)
  ) {
    revealElements.forEach((element) => {
      element.classList.add("visible", "revealed");
    });

    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add(
          "visible",
          "revealed"
        );

        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  revealElements.forEach((element, index) => {
    element.style.setProperty(
      "--reveal-delay",
      `${Math.min(index % 6, 5) * 80}ms`
    );

    revealObserver.observe(element);
  });
}


/* =========================================================
   6. CHART SYSTEM
   Uses Chart.js when available.
   Includes a native Canvas fallback.
   ========================================================= */

const chartInstances = new Map();

const chartPalette = {
  purple: "#8b5cf6",
  blue: "#3b82f6",
  cyan: "#06b6d4",
  green: "#10b981",
  orange: "#f59e0b",
  pink: "#ec4899",
  red: "#ef4444",
  grid: "rgba(148, 163, 184, 0.14)",
  text: "#94a3b8"
};

function getChartTheme() {
  const dark =
    document.documentElement.dataset.theme === "dark" ||
    document.body.classList.contains("dark-mode");

  return {
    text: dark ? "#cbd5e1" : "#64748b",
    grid: dark
      ? "rgba(148,163,184,0.13)"
      : "rgba(100,116,139,0.12)"
  };
}

function makeGradient(context, color) {
  const gradient = context.createLinearGradient(
    0,
    0,
    0,
    320
  );

  gradient.addColorStop(0, `${color}55`);
  gradient.addColorStop(1, `${color}00`);

  return gradient;
}

function initializeCharts() {
  // Chart.js canvases.
  $$("canvas[data-chart]").forEach((canvas) => {
    const type = canvas.dataset.chart;

    const labels = (
      canvas.dataset.labels ||
      "Mon,Tue,Wed,Thu,Fri,Sat,Sun"
    ).split(",");

    const values = (
      canvas.dataset.values ||
      "18,28,23,39,32,48,42"
    )
      .split(",")
      .map(Number);

    const color =
      canvas.dataset.color ||
      chartPalette.purple;

    createChart(canvas, {
      type,
      labels,
      values,
      color
    });
  });

  // Automatically initialize common chart IDs.
  const defaultCharts = [
    {
      selectors: ["#revenueChart", "#mainChart"],
      type: "line",
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      values: [24, 38, 31, 52, 43, 67, 58],
      color: chartPalette.purple
    },
    {
      selectors: ["#activityChart"],
      type: "bar",
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      values: [35, 52, 43, 68, 57, 82],
      color: chartPalette.blue
    },
    {
      selectors: ["#trafficChart"],
      type: "doughnut",
      labels: ["Direct", "Social", "Search", "Referral"],
      values: [35, 25, 28, 12],
      color: chartPalette.purple
    }
  ];

  defaultCharts.forEach((config) => {
    for (const selector of config.selectors) {
      const canvas = $(selector);

      if (!canvas || chartInstances.has(canvas)) continue;

      createChart(canvas, config);
      break;
    }
  });
}

function createChart(canvas, config) {
  if (!canvas || chartInstances.has(canvas)) return;

  if (typeof Chart !== "undefined") {
    createChartJS(canvas, config);
  } else {
    drawNativeChart(canvas, config);
  }
}

function createChartJS(canvas, config) {
  const context = canvas.getContext("2d");

  const theme = getChartTheme();

  const isDoughnut = config.type === "doughnut";
  const isBar = config.type === "bar";

  const dataset = {
    label: config.label || "Performance",
    data: config.values,
    borderColor: config.color,
    backgroundColor: isDoughnut
      ? [
          chartPalette.purple,
          chartPalette.blue,
          chartPalette.cyan,
          chartPalette.green
        ]
      : isBar
        ? `${config.color}cc`
        : makeGradient(context, config.color),
    borderWidth: isDoughnut ? 0 : 2.5,
    borderRadius: isBar ? 8 : 0,
    fill: !isBar && !isDoughnut,
    tension: 0.4,
    pointRadius: isDoughnut ? 0 : 3,
    pointHoverRadius: 6,
    pointBackgroundColor: config.color,
    pointBorderColor: "#ffffff",
    pointBorderWidth: 2
  };

  const chart = new Chart(context, {
    type: config.type,
    data: {
      labels: config.labels,
      datasets: [dataset]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: prefersReducedMotion ? 0 : 1200,
        easing: "easeOutQuart"
      },
      interaction: {
        intersect: false,
        mode: "index"
      },
      plugins: {
        legend: {
          display: isDoughnut,
          position: "bottom",
          labels: {
            color: theme.text,
            usePointStyle: true,
            pointStyle: "circle",
            padding: 18
          }
        },
        tooltip: {
          backgroundColor: "#111827",
          titleColor: "#ffffff",
          bodyColor: "#e5e7eb",
          padding: 12,
          cornerRadius: 10,
          displayColors: true
        }
      },
      scales: isDoughnut
        ? {}
        : {
            x: {
              grid: {
                display: false
              },
              border: {
                display: false
              },
              ticks: {
                color: theme.text
              }
            },
            y: {
              beginAtZero: true,
              border: {
                display: false,
                dash: [4, 4]
              },
              grid: {
                color: theme.grid
              },
              ticks: {
                color: theme.text,
                padding: 10
              }
            }
          }
    }
  });

  chartInstances.set(canvas, chart);
}

/*
  Native Canvas chart fallback.
  This keeps basic charts working without Chart.js.
*/

function drawNativeChart(canvas, config) {
  const context = canvas.getContext("2d");

  if (!context) return;

  const ratio = window.devicePixelRatio || 1;

  const bounds = canvas.getBoundingClientRect();

  const width = Math.max(bounds.width, 280);
  const height = Math.max(bounds.height, 180);

  canvas.width = width * ratio;
  canvas.height = height * ratio;

  context.scale(ratio, ratio);

  const padding = {
    top: 24,
    right: 18,
    bottom: 34,
    left: 38
  };

  const chartWidth =
    width - padding.left - padding.right;

  const chartHeight =
    height - padding.top - padding.bottom;

  const values = config.values;
  const maxValue = Math.max(...values, 1) * 1.15;

  const theme = getChartTheme();

  context.clearRect(0, 0, width, height);

  // Horizontal grid lines.
  context.strokeStyle = theme.grid;
  context.lineWidth = 1;

  for (let i = 0; i <= 4; i++) {
    const y =
      padding.top + (chartHeight / 4) * i;

    context.beginPath();
    context.moveTo(padding.left, y);
    context.lineTo(width - padding.right, y);
    context.stroke();
  }

  if (config.type === "doughnut") {
    const total = values.reduce(
      (sum, value) => sum + value,
      0
    );

    const colors = [
      chartPalette.purple,
      chartPalette.blue,
      chartPalette.cyan,
      chartPalette.green
    ];

    let angle = -Math.PI / 2;

    const centerX = width / 2;
    const centerY = height / 2 - 8;
    const radius = Math.min(width, height) * 0.32;

    values.forEach((value, index) => {
      const slice = (value / total) * Math.PI * 2;

      context.beginPath();
      context.arc(
        centerX,
        centerY,
        radius,
        angle,
        angle + slice
      );

      context.strokeStyle = colors[index % colors.length];
      context.lineWidth = radius * 0.38;
      context.stroke();

      angle += slice;
    });

    chartInstances.set(canvas, {
      config,
      redraw: () => drawNativeChart(canvas, config)
    });

    return;
  }

  const points = values.map((value, index) => {
    const x =
      padding.left +
      (values.length === 1
        ? chartWidth / 2
        : (chartWidth / (values.length - 1)) * index);

    const y =
      padding.top +
      chartHeight -
      (value / maxValue) * chartHeight;

    return { x, y };
  });

  if (config.type === "bar") {
    const slotWidth = chartWidth / values.length;
    const barWidth = slotWidth * 0.55;

    points.forEach((point, index) => {
      const barHeight =
        padding.top + chartHeight - point.y;

      context.fillStyle = config.color;

      context.beginPath();

      context.roundRect(
        point.x - barWidth / 2,
        point.y,
        barWidth,
        barHeight,
        5
      );

      context.fill();
    });
  } else {
    // Fill the area beneath the line.
    context.beginPath();
    context.moveTo(points[0].x, padding.top + chartHeight);

    points.forEach((point) => {
      context.lineTo(point.x, point.y);
    });

    context.lineTo(
      points[points.length - 1].x,
      padding.top + chartHeight
    );

    context.closePath();

    const gradient = context.createLinearGradient(
      0,
      padding.top,
      0,
      padding.top + chartHeight
    );

    gradient.addColorStop(0, `${config.color}45`);
    gradient.addColorStop(1, `${config.color}00`);

    context.fillStyle = gradient;
    context.fill();

    // Smooth line.
    context.beginPath();

    points.forEach((point, index) => {
      if (index === 0) {
        context.moveTo(point.x, point.y);
      } else {
        const previous = points[index - 1];

        const midX = (previous.x + point.x) / 2;
        const midY = (previous.y + point.y) / 2;

        context.quadraticCurveTo(
          previous.x,
          previous.y,
          midX,
          midY
        );
      }
    });

    const last = points[points.length - 1];

    context.lineTo(last.x, last.y);

    context.strokeStyle = config.color;
    context.lineWidth = 3;
    context.lineJoin = "round";
    context.stroke();

    // Data points.
    points.forEach((point) => {
      context.beginPath();
      context.arc(point.x, point.y, 3.5, 0, Math.PI * 2);

      context.fillStyle = config.color;
      context.fill();
    });
  }

  // X-axis labels.
  context.fillStyle = theme.text;
  context.font = "11px system-ui, sans-serif";
  context.textAlign = "center";

  config.labels.forEach((label, index) => {
    const x =
      padding.left +
      (values.length === 1
        ? chartWidth / 2
        : (chartWidth / (values.length - 1)) * index);

    context.fillText(
      label.trim(),
      x,
      height - 10
    );
  });

  chartInstances.set(canvas, {
    config,
    redraw: () => drawNativeChart(canvas, config)
  });
}


/* =========================================================
   7. CHART PERIOD SWITCHER
   Add buttons with:
   data-chart-period="week"
   data-chart-period="month"
   data-chart-period="year"
   ========================================================= */

document.addEventListener("click", (event) => {
  const button = event.target.closest(
    "[data-chart-period]"
  );

  if (!button) return;

  const group = button.closest(
    "[data-chart-controls], .chart-controls"
  );

  if (group) {
    $$("button", group).forEach((item) => {
      item.classList.toggle(
        "active",
        item === button
      );
    });
  }

  const canvasSelector =
    button.dataset.chartTarget || "#revenueChart";

  const canvas = $(canvasSelector);

  if (!canvas) return;

  const period = button.dataset.chartPeriod;

  const datasets = {
    week: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      values: [24, 38, 31, 52, 43, 67, 58]
    },
    month: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      values: [120, 175, 148, 230]
    },
    year: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      values: [320, 410, 375, 520, 470, 680]
    }
  };

  const data = datasets[period];

  if (!data) return;

  const instance = chartInstances.get(canvas);

  if (
    instance &&
    typeof instance.update === "function"
  ) {
    instance.data.labels = data.labels;
    instance.data.datasets[0].data = data.values;

    instance.update();
  } else {
    if (instance) {
      chartInstances.delete(canvas);
    }

    createChart(canvas, {
      type: canvas.dataset.chart || "line",
      labels: data.labels,
      values: data.values,
      color: canvas.dataset.color || chartPalette.purple
    });
  }
});


/* =========================================================
   8. NOTIFICATION SYSTEM
   ========================================================= */

function showNotification(
  message,
  type = "success",
  duration = 3500
) {
  let container = $("#notificationContainer");

  if (!container) {
    container = document.createElement("div");

    container.id = "notificationContainer";
    container.className = "notification-container";

    container.setAttribute(
      "aria-live",
      "polite"
    );

    container.setAttribute(
      "aria-atomic",
      "false"
    );

    document.body.appendChild(container);
  }

  const icons = {
    success: "✓",
    error: "!",
    warning: "⚠",
    info: "i"
  };

  const notification = document.createElement("div");

  notification.className =
    `notification notification-${type}`;

  const icon = document.createElement("span");
  icon.className = "notification-icon";
  icon.textContent = icons[type] || icons.info;

  const text = document.createElement("span");
  text.className = "notification-message";
  text.textContent = message;

  const closeButton = document.createElement("button");

  closeButton.type = "button";
  closeButton.className = "notification-close";
  closeButton.textContent = "×";
  closeButton.setAttribute(
    "aria-label",
    "Dismiss notification"
  );

  notification.append(icon, text, closeButton);
  container.appendChild(notification);

  requestAnimationFrame(() => {
    notification.classList.add("show");
  });

  let timeout;

  function dismiss() {
    clearTimeout(timeout);

    notification.classList.remove("show");
    notification.classList.add("hide");

    setTimeout(() => {
      notification.remove();

      if (!container.children.length) {
        container.remove();
      }
    }, 250);
  }

  closeButton.addEventListener("click", dismiss);

  timeout = setTimeout(dismiss, duration);

  return dismiss;
}

function initializeNotifications() {
  $$("[data-notification]").forEach((button) => {
    button.addEventListener("click", () => {
      showNotification(
        button.dataset.notification ||
          "Everything is up to date.",
        button.dataset.notificationType || "success"
      );
    });
  });

  const notificationButton = $(
    "#notificationButton, .notification-button"
  );

  if (notificationButton) {
    notificationButton.addEventListener("click", () => {
      showNotification(
        "You're all caught up!",
        "info"
      );
    });
  }
}


/* =========================================================
   9. DARK / LIGHT THEME
   ========================================================= */

function initializeThemeToggle() {
  const toggle = $(
    "#themeToggle, .theme-toggle, [data-theme-toggle]"
  );

  const savedTheme = safeStorageGet("site-theme");

  const preferredTheme =
    savedTheme ||
    (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
    );

  applyTheme(preferredTheme);

  if (toggle) {
    toggle.addEventListener("click", () => {
      const isDark =
        document.documentElement.dataset.theme === "dark";

      const nextTheme = isDark ? "light" : "dark";

      applyTheme(nextTheme);

      safeStorageSet("site-theme", nextTheme);

      showNotification(
        `${nextTheme === "dark" ? "Dark" : "Light"} mode enabled`,
        "info",
        2000
      );
    });
  }
}

function applyTheme(theme) {
  const isDark = theme === "dark";

  document.documentElement.dataset.theme =
    isDark ? "dark" : "light";

  document.documentElement.style.colorScheme =
    isDark ? "dark" : "light";

  document.body.classList.toggle(
    "dark-mode",
    isDark
  );

  document.body.classList.toggle(
    "light-mode",
    !isDark
  );

  const toggle = $(
    "#themeToggle, .theme-toggle, [data-theme-toggle]"
  );

  if (toggle) {
    toggle.setAttribute(
      "aria-label",
      isDark ? "Switch to light mode" : "Switch to dark mode"
    );

    toggle.setAttribute(
      "aria-pressed",
      String(isDark)
    );
  }

  // Refresh charts to match the selected theme.
  chartInstances.forEach((instance, canvas) => {
    if (typeof instance.update === "function") {
      instance.options.scales &&
        Object.values(instance.options.scales).forEach((scale) => {
          if (scale.ticks) {
            scale.ticks.color = getChartTheme().text;
          }

          if (scale.grid) {
            scale.grid.color = getChartTheme().grid;
          }
        });

      instance.update("none");
    } else if (instance.redraw) {
      instance.redraw();
    }
  });
}


/* =========================================================
   10. TABS
   ========================================================= */

function initializeTabs() {
  $$("[data-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.dataset.tab;
      const scope =
        button.closest("[data-tabs]") ||
        button.parentElement.parentElement;

      if (!scope) return;

      const buttons = $$("[data-tab]", scope);

      buttons.forEach((item) => {
        const active = item === button;

        item.classList.toggle("active", active);

        item.setAttribute(
          "aria-selected",
          String(active)
        );
      });

      const panels = $$("[data-tab-panel]", scope);

      panels.forEach((panel) => {
        const active =
          panel.dataset.tabPanel === targetId;

        panel.hidden = !active;
        panel.classList.toggle("active", active);
      });
    });
  });
}


/* =========================================================
   11. INTERACTIVE BUTTONS
   ========================================================= */

function initializeInteractiveButtons() {
  // Demo action buttons.
  $$("[data-action]").forEach((button) => {
    button.addEventListener("click", async () => {
      const action = button.dataset.action;

      switch (action) {
        case "refresh": {
          const originalText = button.textContent;

          button.classList.add("loading");
          button.disabled = true;

          await new Promise((resolve) =>
            setTimeout(resolve, 700)
          );

          button.classList.remove("loading");
          button.disabled = false;

          showNotification(
            "Data refreshed successfully.",
            "success"
          );

          button.textContent = originalText;
          break;
        }

        case "export":
          exportDashboardData();
          break;

        case "fullscreen":
          toggleFullscreen();
          break;

        case "greeting":
          showNotification(
            "Welcome! Your dashboard is ready.",
            "success"
          );
          break;

        default:
          showNotification(
            button.dataset.message ||
              "Action completed.",
            "info"
          );
      }
    });
  });

  // Ripple effect for buttons.
  $$("button, .button, .btn").forEach((button) => {
    button.addEventListener("pointerdown", (event) => {
      if (prefersReducedMotion) return;

      const rect = button.getBoundingClientRect();

      const ripple = document.createElement("span");

      ripple.className = "button-ripple";

      ripple.style.left =
        `${event.clientX - rect.left}px`;

      ripple.style.top =
        `${event.clientY - rect.top}px`;

      button.appendChild(ripple);

      setTimeout(() => ripple.remove(), 650);
    });
  });
}


/* =========================================================
   12. EXPORT DASHBOARD DATA
   ========================================================= */

function exportDashboardData() {
  const data = {
    exportedAt: new Date().toISOString(),
    title: document.title,
    statistics: $$(".stat-number, [data-target], [data-count]")
      .map((element) => ({
        label:
          element.dataset.label ||
          element.getAttribute("aria-label") ||
          element.parentElement?.querySelector("h2, h3, p")
            ?.textContent?.trim() ||
          "Statistic",
        value: element.textContent.trim()
      })),
    charts: [...chartInstances.entries()].map(
      ([canvas, instance]) => {
        const chartData =
          instance.data ||
          instance.config;

        return {
          chart: canvas.id || "chart",
          labels:
            chartData.labels ||
            chartData.data?.labels ||
            [],
          values:
            chartData.datasets?.[0]?.data ||
            chartData.values ||
            []
        };
      }
    )
  };

  const blob = new Blob(
    [JSON.stringify(data, null, 2)],
    {
      type: "application/json"
    }
  );

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download =
    `dashboard-export-${new Date().toISOString().slice(0, 10)}.json`;

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);

  showNotification(
    "Your dashboard export is ready.",
    "success"
  );
}


/* =========================================================
   13. FULLSCREEN MODE
   ========================================================= */

async function toggleFullscreen() {
  try {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();

      showNotification(
        "Fullscreen enabled.",
        "info",
        2000
      );
    } else {
      await document.exitFullscreen();

      showNotification(
        "Fullscreen closed.",
        "info",
        2000
      );
    }
  } catch (error) {
    showNotification(
      "Fullscreen is not available in this browser.",
      "warning"
    );
  }
}


/* =========================================================
   14. LIVE CLOCK
   ========================================================= */

function initializeLiveClock() {
  const clock = $(
    "#liveClock, .live-clock, [data-live-clock]"
  );

  const dateDisplay = $(
    "#currentDate, .current-date, [data-current-date]"
  );

  if (!clock && !dateDisplay) return;

  function updateClock() {
    const now = new Date();

    if (clock) {
      clock.textContent = now.toLocaleTimeString(
        undefined,
        {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        }
      );
    }

    if (dateDisplay) {
      dateDisplay.textContent = now.toLocaleDateString(
        undefined,
        {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric"
        }
      );
    }
  }

  updateClock();

  setInterval(updateClock, 1000);
}


/* =========================================================
   15. ANIMATED PROGRESS BARS
   ========================================================= */

function initializeProgressBars() {
  const progressBars = $$(
    "[data-progress], .progress-bar-fill"
  );

  progressBars.forEach((bar) => {
    const value = clamp(
      Number(
        bar.dataset.progress ||
        bar.dataset.value ||
        0
      ),
      0,
      100
    );

    bar.style.width = "0%";

    bar.setAttribute("role", "progressbar");
    bar.setAttribute("aria-valuemin", "0");
    bar.setAttribute("aria-valuemax", "100");
    bar.setAttribute("aria-valuenow", String(value));

    const animate = () => {
      bar.style.transition = prefersReducedMotion
        ? "none"
        : "width 1s cubic-bezier(.2,.8,.2,1)";

      bar.style.width = `${value}%`;
    };

    if (
      "IntersectionObserver" in window &&
      !prefersReducedMotion
    ) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            animate();
            observer.unobserve(bar);
          });
        },
        {
          threshold: 0.2
        }
      );

      observer.observe(bar);
    } else {
      animate();
    }
  });
}


/* =========================================================
   16. TOOLTIPS
   ========================================================= */

function initializeTooltips() {
  $$("[data-tooltip]").forEach((element) => {
    element.setAttribute(
      "aria-label",
      element.getAttribute("aria-label") ||
        element.dataset.tooltip
    );

    element.classList.add("has-tooltip");
  });
}


/* =========================================================
   17. KEYBOARD SHORTCUTS
   ========================================================= */

function initializeKeyboardShortcuts() {
  document.addEventListener("keydown", (event) => {
    const target = event.target;

    const isTyping =
      target instanceof HTMLElement &&
      (
        target.isContentEditable ||
        ["INPUT", "TEXTAREA", "SELECT"].includes(
          target.tagName
        )
      );

    if (isTyping) return;

    // Press "/" to focus the search box.
    if (event.key === "/") {
      const search = $(
        "#searchInput, .search-input, input[type='search']"
      );

      if (search) {
        event.preventDefault();
        search.focus();
      }
    }

    // Press "Escape" to close menus and overlays.
    if (event.key === "Escape") {
      $$(".active").forEach((element) => {
        if (
          element.matches(
            ".navigation, .nav-links, .sidebar"
          )
        ) {
          element.classList.remove("active");
        }
      });

      document.body.classList.remove("menu-open");
    }
  });
}


/* =========================================================
   18. SEARCH FILTER
   ========================================================= */

const searchInput = $(
  "#searchInput, .search-input, input[type='search']"
);

if (searchInput) {
  searchInput.addEventListener("input", () => {
    const query = searchInput.value
      .toLowerCase()
      .trim();

    const items = $$(
      "[data-searchable], .searchable-item, .dashboard-card"
    );

    items.forEach((item) => {
      const text = (
        item.dataset.searchable ||
        item.textContent
      ).toLowerCase();

      const matches = text.includes(query);

      item.hidden = !matches;

      item.classList.toggle(
        "search-match",
        matches && query.length > 0
      );
    });
  });
}


/* =========================================================
   19. CARD HOVER EFFECTS
   ========================================================= */

function initializeCardEffects() {
  if (prefersReducedMotion) return;

  $$(".dashboard-card, .stat-card, .feature-card").forEach(
    (card) => {
      card.addEventListener("pointermove", (event) => {
        if (event.pointerType !== "mouse") return;

        const rect = card.getBoundingClientRect();

        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;

        card.style.setProperty("--mouse-x", `${x * 100}%`);
        card.style.setProperty("--mouse-y", `${y * 100}%`);
      });

      card.addEventListener("pointerleave", () => {
        card.style.removeProperty("--mouse-x");
        card.style.removeProperty("--mouse-y");
      });
    }
  );
}

initializeCardEffects();


/* =========================================================
   20. SAFE LOCAL STORAGE HELPERS
   ========================================================= */

function safeStorageGet(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeStorageSet(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // The application continues if storage is unavailable.
  }
}


/* =========================================================
   21. CONNECTION STATUS
   ========================================================= */

function updateConnectionStatus() {
  const status = $(
    "#connectionStatus, .connection-status"
  );

  if (!status) return;

  const online = navigator.onLine;

  status.textContent = online
    ? "Online"
    : "Offline";

  status.classList.toggle("online", online);
  status.classList.toggle("offline", !online);

  status.setAttribute(
    "aria-label",
    online
      ? "Internet connection available"
      : "No internet connection"
  );
}

window.addEventListener(
  "online",
  updateConnectionStatus
);

window.addEventListener(
  "offline",
  updateConnectionStatus
);

updateConnectionStatus();


/* =========================================================
   22. RESIZE HANDLER
   ========================================================= */

let resizeTimer;

window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);

  resizeTimer = setTimeout(() => {
    chartInstances.forEach((instance) => {
      if (typeof instance.resize === "function") {
        instance.resize();
      } else if (instance.redraw) {
        instance.redraw();
      }
    });
  }, 150);
});


/* =========================================================
   23. GLOBAL APP API
   Makes selected functions available to HTML.
   ========================================================= */

window.App = {
  notify: showNotification,
  applyTheme,
  exportData: exportDashboardData,
  refreshCharts: () => {
    chartInstances.forEach((instance) => {
      if (typeof instance.update === "function") {
        instance.update();
      } else if (instance.redraw) {
        instance.redraw();
      }
    });
  }
};


/* =========================================================
   END OF APP.JS
   ========================================================= */