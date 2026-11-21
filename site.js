/* Contact email used by every "Email" link on the site. */
const CONTACT_EMAIL = "shant-99@hotmail.com";

(function () {
  document.querySelectorAll("[data-email]").forEach((el) => {
    el.href = "mailto:" + CONTACT_EMAIL;
    if (el.hasAttribute("data-email-text")) el.textContent = CONTACT_EMAIL;
  });
  document.querySelectorAll("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });

  // Film: swap the poster for the Vimeo player on click
  document.querySelectorAll(".film-poster").forEach((btn) => {
    btn.addEventListener("click", () => {
      const iframe = document.createElement("iframe");
      iframe.src = "https://player.vimeo.com/video/" + btn.dataset.vimeo + "?autoplay=1&title=0&byline=0&portrait=0&dnt=1";
      iframe.allow = "autoplay; fullscreen; picture-in-picture";
      iframe.allowFullscreen = true;
      iframe.title = btn.getAttribute("aria-label") || "Film";
      btn.replaceWith(iframe);
      iframe.focus();
    });
  });

  // Process switch: D5 render / ComfyUI / Final
  document.querySelectorAll(".stage-fig").forEach((fig) => {
    const imgs = fig.querySelectorAll(".stage-frame img");
    const btns = Array.from(fig.querySelectorAll(".stage-btn"));
    const cap = fig.querySelector(".stage-cap");
    function select(i) {
      btns.forEach((b, n) => { b.setAttribute("aria-selected", n === i ? "true" : "false"); b.tabIndex = n === i ? 0 : -1; });
      imgs.forEach((im, n) => im.classList.toggle("on", n === i));
      cap.textContent = btns[i].dataset.caption;
    }
    btns.forEach((b, i) => {
      b.addEventListener("click", () => select(i));
      b.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          const n = (i + (e.key === "ArrowRight" ? 1 : btns.length - 1)) % btns.length;
          select(n); btns[n].focus();
        }
      });
    });
  });

  // Lightbox for stills
  const items = Array.from(document.querySelectorAll("[data-full]"));
  if (!items.length) return;
  const dlg = document.createElement("dialog");
  dlg.className = "lightbox";
  dlg.setAttribute("aria-label", "Still viewer");
  dlg.innerHTML =
    '<div class="lb-bar"><span class="lb-count"></span><button class="lb-btn lb-close" type="button">Close</button></div>' +
    '<div class="lb-stage"><img alt=""></div>' +
    '<div class="lb-foot"><button class="lb-btn lb-prev" type="button">Previous</button>' +
    '<span class="lb-cap"></span><button class="lb-btn lb-next" type="button">Next</button></div>';
  document.body.appendChild(dlg);
  const img = dlg.querySelector("img"), cap = dlg.querySelector(".lb-cap"), count = dlg.querySelector(".lb-count");
  let i = 0;
  function show(n) {
    i = (n + items.length) % items.length;
    const it = items[i];
    img.src = it.dataset.full;
    img.alt = it.querySelector("img") ? it.querySelector("img").alt : "";
    cap.textContent = it.dataset.caption || "";
    count.textContent = (i + 1) + " of " + items.length;
  }
  items.forEach((it, n) => it.addEventListener("click", () => {
    show(n);
    if (typeof dlg.showModal === "function") dlg.showModal(); else dlg.setAttribute("open", "");
  }));
  dlg.querySelector(".lb-close").addEventListener("click", () => dlg.close());
  dlg.querySelector(".lb-prev").addEventListener("click", () => show(i - 1));
  dlg.querySelector(".lb-next").addEventListener("click", () => show(i + 1));
  dlg.addEventListener("click", (e) => { if (e.target === dlg || e.target.classList.contains("lb-stage")) dlg.close(); });
  dlg.addEventListener("keydown", (e) => { if (e.key === "ArrowRight") show(i + 1); if (e.key === "ArrowLeft") show(i - 1); });
})();
