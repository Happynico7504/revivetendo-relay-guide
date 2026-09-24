const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('start-anim');
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.1,
  }
);
function initObserver() {
  const discordMessages = document.querySelector('.discord-ui-messages');
  if (discordMessages) {
    observer.observe(discordMessages);
  }
}
function init() {
  initObserver();
  loadModAvatars();
  loadMockupAvatars();
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Copy Text Utility for SD Card Paths
function copyText(text, btnElement) {
  if (!navigator.clipboard) return;
  navigator.clipboard.writeText(text).then(() => {
    const originalText = btnElement.textContent;
    btnElement.textContent = 'Copied!';
    btnElement.style.backgroundColor = '#059669';
    btnElement.style.color = '#ffffff';
    setTimeout(() => {
      btnElement.textContent = originalText;
      btnElement.style.backgroundColor = '';
      btnElement.style.color = '';
    }, 2000);
  });
}

// FAQ Accordion Toggle
function toggleFaq(buttonEl) {
  const itemEl = buttonEl.parentElement;
  const answerEl = buttonEl.nextElementSibling;
  const indicatorEl = buttonEl.querySelector('.faq-indicator');
  const isOpen = itemEl.classList.contains('open');

  // Close all other accordions
  document.querySelectorAll('.faq-item').forEach((item) => {
    item.classList.remove('open');
    const ans = item.querySelector('.faq-answer');
    const ind = item.querySelector('.faq-indicator');
    if (ans) ans.style.maxHeight = null;
    if (ind) ind.textContent = '+';
  });
  if (!isOpen) {
    itemEl.classList.add('open');
    answerEl.style.maxHeight = answerEl.scrollHeight + 'px';
    if (indicatorEl) indicatorEl.textContent = '-';
  }
}

// Tab Switcher for Setup Guide
function switchGuideTab(consoleId) {
  // Update buttons
  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.classList.remove('btn-primary');
    btn.classList.add('btn-secondary');
    btn.classList.remove('active');
  });
  const activeBtn = document.querySelector(`.tab-btn[data-target="${consoleId}"]`);
  if (activeBtn) {
    activeBtn.classList.remove('btn-secondary');
    activeBtn.classList.add('btn-primary');
    activeBtn.classList.add('active');
  }

  // Update content sections
  document.querySelectorAll('.guide-tab-content').forEach((section) => {
    section.style.display = 'none';
  });
  const activeSection = document.getElementById(`guide-${consoleId}`);
  if (activeSection) {
    activeSection.style.display = 'block';
  }
}
