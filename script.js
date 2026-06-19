(function () {
  "use strict";

  const navbar = document.getElementById("navbar");
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav-link");
  const cartCount = document.getElementById("cartCount");
  const toast = document.getElementById("toast");
  const newsletterForm = document.getElementById("newsletterForm");
  const newsletterMsg = document.getElementById("newsletterMsg");

  let cartItems = 0;
  let toastTimer;

  /* Sticky navbar scroll effect */
  function handleScroll() {
    navbar.classList.toggle("scrolled", window.scrollY > 20);
    updateActiveNavLink();
  }

  /* Highlight active nav link based on scroll position */
  function updateActiveNavLink() {
    const sections = document.querySelectorAll("section[id], footer[id]");
    const scrollPos = window.scrollY + 100;

    sections.forEach(function (section) {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute("id");

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(function (link) {
          link.classList.toggle("active", link.getAttribute("href") === "#" + id);
        });
      }
    });
  }

  /* Mobile menu toggle */
  navToggle.addEventListener("click", function () {
    const isOpen = navMenu.classList.toggle("open");
    navToggle.classList.toggle("active", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  /* Close mobile menu on nav click */
  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      navMenu.classList.remove("open");
      navToggle.classList.remove("active");
      navToggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    });
  });

  /* Add to cart */
  document.querySelectorAll(".add-to-cart").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const card = btn.closest(".product-card");
      const name = card.dataset.name;

      cartItems += 1;
      cartCount.textContent = cartItems;
      cartCount.classList.remove("bump");
      void cartCount.offsetWidth;
      cartCount.classList.add("bump");

      card.classList.add("added");
      btn.textContent = "Added ✓";

      showToast(name + " added to cart");

      setTimeout(function () {
        card.classList.remove("added");
        btn.textContent = "Add to Cart";
      }, 2000);
    });
  });

  /* Toast notification */
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove("show");
    }, 2800);
  }

  /* Newsletter form */
  newsletterForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = newsletterForm.querySelector('input[type="email"]').value;

    newsletterMsg.hidden = false;
    newsletterMsg.textContent = "Thank you! We'll keep you in the loop, " + email.split("@")[0] + ".";
    newsletterForm.reset();

    setTimeout(function () {
      newsletterMsg.hidden = true;
    }, 5000);
  });

  /* Scroll-triggered fade-in animations */
  const fadeElements = document.querySelectorAll(".fade-in");

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  fadeElements.forEach(function (el) {
    observer.observe(el);
  });

  /* Init */
  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();
})();
