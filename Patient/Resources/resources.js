// Educational resources. Edit this list to add, remove or re-point links.
// type: "Video" or "Website" | tone: y, g, b, s, p (card colours)
const RESOURCES = [
  {
    cat: "Daily care", tone: "g", type: "Website", time: "3 min read", source: "MouthHealthy (ADA)",
    title: "Brushing your teeth: the right technique",
    text: "The American Dental Association's step-by-step advice on brushing, plus what else belongs in your daily routine.",
    url: "https://www.mouthhealthy.org/all-topics-a-z/brushing-your-teeth/"
  },
  {
    cat: "Daily care", tone: "s", type: "Video", time: "Watch", source: "YouTube",
    title: "Tips for good dental health",
    text: "A short video on everyday habits that keep your teeth and gums healthy.",
    url: "https://www.youtube.com/watch?v=fv-EGsNvNzc"
  },
  {
    cat: "Treatments", tone: "b", type: "Website", time: "5 min read", source: "Delta Dental",
    title: "What to expect at your filling",
    text: "A walk-through of getting a cavity filled, from numbing to the finishing touches.",
    url: "https://www1.deltadentalins.com/wellness/conditions-and-treatments/articles/cavities-fillings-treatment.html"
  },
  {
    cat: "Treatments", tone: "b", type: "Website", time: "5 min read", source: "American Association of Endodontists",
    title: "What to expect at your root canal",
    text: "How a root canal feels, what soreness is normal afterward and when to call your dentist.",
    url: "https://www.aae.org/patients/root-canal-treatment/root-canal-pain/"
  },
  {
    cat: "Aftercare", tone: "p", type: "Website", time: "4 min read", source: "Gentle Dental",
    title: "Do's and don'ts after a tooth extraction",
    text: "Rest, diet, rinsing, straws and medicines: what to do and avoid while your mouth heals.",
    url: "https://www.gentledental.com/resources/articles/dos-donts-after-tooth-extraction"
  },
  {
    cat: "Aftercare", tone: "y", type: "Video", time: "Watch", source: "YouTube",
    title: "Post-operative oral surgery instructions",
    text: "A video on home care after oral surgery so you can heal safely.",
    url: "https://www.youtube.com/watch?v=IHzrVvK9wM8"
  },
  {
    cat: "Kids & family", tone: "s", type: "Website", time: "3 min read", source: "MouthHealthy (ADA)",
    title: "Your child's first dental visit",
    text: "When to book the first visit, how to prepare and what the dentist will do.",
    url: "https://www.mouthhealthy.org/life-stages/babies-and-kids/first-dental-visit-for-baby"
  }
];

const ICONS = {
  Video: '<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="6" y="14" width="52" height="36" rx="9" fill="#fff" stroke="#0b3a75" stroke-width="3"/><path d="M27 24l14 8-14 8z" fill="#1a5bd8"/></svg>',
  Website: '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 12c-5-4-16-3-18 6-1 8 3 11 4 19 1 9 4 15 8 15 4 0 4-10 6-10s2 10 6 10c4 0 7-6 8-15 1-8 5-11 4-19-2-9-13-10-18-6z" fill="#fff" stroke="#0b3a75" stroke-width="3" stroke-linejoin="round"/><circle cx="26" cy="30" r="2.4" fill="#0b3a75"/><circle cx="38" cy="30" r="2.4" fill="#0b3a75"/><path d="M28 38q4 4 8 0" fill="none" stroke="#0b3a75" stroke-width="2.6" stroke-linecap="round"/></svg>'
};
const ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h16M14 6l6 6-6 6"/></svg>';

const cardsEl = document.getElementById("cards");
const emptyEl = document.getElementById("empty");
const chips = document.querySelectorAll(".chip");

function esc(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

function render(filter) {
  const items = filter === "all" ? RESOURCES : RESOURCES.filter(r => r.cat === filter);
  cardsEl.innerHTML = items.map(r => `
    <a class="card" data-tone="${r.tone}" href="${r.url}" target="_blank" rel="noopener noreferrer"
       aria-label="${esc(r.title)} (opens ${esc(r.source)} in a new tab)">
      <div class="thumb">${ICONS[r.type]}<span class="badge">${r.type}</span></div>
      <div class="card-body">
        <span class="tag">${esc(r.cat)}</span>
        <h3>${esc(r.title)}</h3>
        <p>${esc(r.text)}</p>
        <div class="card-foot">
          <span>${esc(r.time)} · ${esc(r.source)}</span>
          <span class="go">${r.type === "Video" ? "Watch" : "Read guide"} ${ARROW}</span>
        </div>
      </div>
    </a>`).join("");
  emptyEl.hidden = items.length > 0;
}

chips.forEach(chip => chip.addEventListener("click", () => {
  chips.forEach(c => { c.classList.remove("is-on"); c.setAttribute("aria-pressed", "false"); });
  chip.classList.add("is-on");
  chip.setAttribute("aria-pressed", "true");
  render(chip.dataset.filter);
}));

// Mobile menu is CSS-only (checkbox in the header), no JS needed.

render("all");