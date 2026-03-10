// ── SCROLL REVEAL ──
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const siblings = [...e.target.parentElement.children]
        .filter(c => c.classList.contains('reveal'));
      siblings.forEach((s, i) => { s.style.transitionDelay = (i * 0.1) + 's'; });
      e.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));


// ── HERO TOPIC PILLS ──
document.querySelectorAll('.topic-pill').forEach(pill => {
  pill.addEventListener('click', () => {
    document.querySelectorAll('.topic-pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    const topic = pill.dataset.topic;
    filterArticles(topic);
  });
});


// ── CATEGORY FILTER TABS ──
document.querySelectorAll('.cat-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.cat;
    filterArticles(cat);
    // Sync topic pills
    document.querySelectorAll('.topic-pill').forEach(p => {
      p.classList.toggle('active', p.dataset.topic === cat);
    });
  });
});


// ── FILTER ARTICLES ──
function filterArticles(category) {
  const cards = document.querySelectorAll('.article-card');
  let visible = 0;

  cards.forEach((card, i) => {
    const match = category === 'all' || card.dataset.category === category;
    card.style.display = match ? '' : 'none';
    if (match) {
      visible++;
      card.style.animation = 'none';
      void card.offsetHeight;
      card.style.animation = `fadeUp 0.5s ${i * 0.07}s ease both`;
    }
  });

  const noResults = document.getElementById('noResults');
  if (noResults) noResults.style.display = visible === 0 ? 'block' : 'none';
}


// ── LIVE SEARCH ──
const searchInput = document.getElementById('searchInput');
if (searchInput) {
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();
    const cards = document.querySelectorAll('.article-card');
    let visible = 0;

    cards.forEach(card => {
      const title   = card.querySelector('.article-title')?.textContent.toLowerCase() || '';
      const excerpt = card.querySelector('.article-excerpt')?.textContent.toLowerCase() || '';
      const cat     = card.querySelector('.article-category')?.textContent.toLowerCase() || '';
      const match   = query === '' || title.includes(query) || excerpt.includes(query) || cat.includes(query);
      card.style.display = match ? '' : 'none';
      if (match) visible++;
    });

    const noResults = document.getElementById('noResults');
    if (noResults) noResults.style.display = visible === 0 ? 'block' : 'none';

    // Reset category buttons when searching
    if (query !== '') {
      document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.topic-pill').forEach(p => p.classList.remove('active'));
    } else {
      document.querySelector('.cat-btn[data-cat="all"]')?.classList.add('active');
    }
  });
}


// ── EMI CALCULATOR ──
const loanAmountInput  = document.getElementById('loanAmount');
const interestInput    = document.getElementById('interestRate');
const tenureInput      = document.getElementById('tenure');

const loanAmountVal    = document.getElementById('loanAmountVal');
const interestVal      = document.getElementById('interestVal');
const tenureVal        = document.getElementById('tenureVal');

const emiAmountEl      = document.getElementById('emiAmount');
const totalPayableEl   = document.getElementById('totalPayable');
const totalInterestEl  = document.getElementById('totalInterest');

function formatCurrency(n) {
  if (n >= 10000000) return '₹' + (n / 10000000).toFixed(2) + ' Cr';
  if (n >= 100000)   return '₹' + (n / 100000).toFixed(2) + ' L';
  if (n >= 1000)     return '₹' + (n / 1000).toFixed(1) + 'K';
  return '₹' + n.toFixed(0);
}

function calcEMI() {
  const P  = parseFloat(loanAmountInput.value);
  const r  = parseFloat(interestInput.value) / 12 / 100;
  const n  = parseFloat(tenureInput.value);

  loanAmountVal.textContent = formatCurrency(P);
  interestVal.textContent   = interestInput.value + '% p.a.';
  tenureVal.textContent     = n + ' months';

  if (r === 0) {
    const emi = P / n;
    emiAmountEl.textContent    = formatCurrency(emi);
    totalPayableEl.textContent = formatCurrency(P);
    totalInterestEl.textContent = '₹0';
    return;
  }

  const emi          = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
  const totalPayable = emi * n;
  const totalInterest = totalPayable - P;

  emiAmountEl.textContent     = formatCurrency(emi);
  totalPayableEl.textContent  = formatCurrency(totalPayable);
  totalInterestEl.textContent = formatCurrency(totalInterest);
}

if (loanAmountInput) {
  [loanAmountInput, interestInput, tenureInput].forEach(el => {
    el.addEventListener('input', calcEMI);
  });
  calcEMI(); // initial render
}


// ── NEWSLETTER FORM ──
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', e => {
    e.preventDefault();
    const input = newsletterForm.querySelector('input[type="email"]');
    const btn   = newsletterForm.querySelector('button');
    if (input.value.trim()) {
      btn.textContent = '✓ Subscribed!';
      btn.style.background = '#10b981';
      input.value = '';
      input.disabled = true;
      btn.disabled   = true;
    }
  });
}