const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('start-anim');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

function initObserver() {
  const discordMessages = document.querySelector('.discord-ui-messages');
  if (discordMessages) {
    observer.observe(discordMessages);
  }
}

async function loadModAvatars() {
  const modCards = document.querySelectorAll('.mod-card');
  for (const card of modCards) {
    const username = card.getAttribute('data-username');
    if (!username) continue;
    
    try {
      const response = await fetch(`https://avatar-cyan.vercel.app/api/avatar/${username}`);
      if (response.ok) {
        const data = await response.json();
        if (data.avatarUrl) {
          const avatarEl = card.querySelector('.mod-avatar');
          if (avatarEl) avatarEl.innerHTML = `<img src="${data.avatarUrl}" alt="${username}">`;
        }
        
        if (data.display_name || data.username) {
          const nameEl = card.querySelector('.mod-name');
          if (nameEl) nameEl.textContent = data.display_name || data.username;
        }
      }
    } catch (e) {
      console.error('Failed to fetch avatar for', username, e);
    }
  }
}

async function loadMockupAvatars() {
  const msgs = document.querySelectorAll('.discord-msg[data-username]');
  for (const msg of msgs) {
    const username = msg.getAttribute('data-username');
    if (!username) continue;
    
    try {
      const response = await fetch(`https://avatar-cyan.vercel.app/api/avatar/${username}`);
      if (response.ok) {
        const data = await response.json();
        if (data.avatarUrl) {
          const avatarEl = msg.querySelector('.discord-avatar');
          if (avatarEl) avatarEl.src = data.avatarUrl;
        }
        
        if (data.display_name || data.username) {
          const nameEl = msg.querySelector('.discord-user');
          if (nameEl) nameEl.textContent = data.display_name || data.username;
        }
      }
    } catch (e) {
      console.error('Failed to fetch avatar for', username, e);
    }
  }
}

function init() {
  initObserver();
  loadModAvatars();
  loadMockupAvatars();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

// Copy Text Utility for SD Card Paths
function copyText(text, btnElement) {
  if (!navigator.clipboard) return;
  
  navigator.clipboard.writeText(text).then(() => {
    const originalText = btnElement.textContent;
    btnElement.textContent = "Copied!";
    btnElement.style.backgroundColor = "#059669";
    btnElement.style.color = "#ffffff";
    
    setTimeout(() => {
      btnElement.textContent = originalText;
      btnElement.style.backgroundColor = "";
      btnElement.style.color = "";
    }, 2000);
  });
}

// FAQ Accordion Toggle
function toggleFaq(buttonEl) {
  const itemEl = buttonEl.parentElement;
  const answerEl = buttonEl.nextElementSibling;
  const indicatorEl = buttonEl.querySelector(".faq-indicator");

  const isOpen = itemEl.classList.contains("open");

  // Close all other accordions
  document.querySelectorAll(".faq-item").forEach(item => {
    item.classList.remove("open");
    const ans = item.querySelector(".faq-answer");
    const ind = item.querySelector(".faq-indicator");
    if (ans) ans.style.maxHeight = null;
    if (ind) ind.textContent = "+";
  });

  if (!isOpen) {
    itemEl.classList.add("open");
    answerEl.style.maxHeight = answerEl.scrollHeight + "px";
    if (indicatorEl) indicatorEl.textContent = "-";
  }
}
