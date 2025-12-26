// Theme Toggle Functionality
document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  let theme = localStorage.getItem('theme') || 'dark';

  // Initialize theme
  if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    themeToggle.textContent = '🌙';
  } else {
    document.documentElement.removeAttribute('data-theme');
    themeToggle.textContent = '☀️';
  }

  // Theme toggle handler
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'light') {
      document.documentElement.removeAttribute('data-theme');
      themeToggle.textContent = '☀️';
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      themeToggle.textContent = '🌙';
      localStorage.setItem('theme', 'light');
    }
  });

  // Hamburger menu toggle
  const hamburger = document.getElementById('hamburger');
  const nav = document.querySelector('nav');
  
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      nav.classList.toggle('active');
    });

    // Close menu when clicking a link
    document.querySelectorAll('nav a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        nav.classList.remove('active');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
        hamburger.classList.remove('active');
        nav.classList.remove('active');
      }
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href !== '#' && document.querySelector(href)) {
        e.preventDefault();
        document.querySelector(href).scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });

  // Add animation to elements on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe all paper cards and sections
  document.querySelectorAll('.paper, .updates p, section').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // Add copy buttons to code blocks
  document.querySelectorAll('.blog-content pre').forEach(preBlock => {
    // Create wrapper div
    const wrapper = document.createElement('div');
    wrapper.className = 'code-block-wrapper';
    
    // Wrap the pre block
    preBlock.parentNode.insertBefore(wrapper, preBlock);
    wrapper.appendChild(preBlock);
    
    // Create copy button
    const copyButton = document.createElement('button');
    copyButton.className = 'copy-button';
    copyButton.innerHTML = '<i class="fas fa-copy"></i> Copy';
    copyButton.setAttribute('aria-label', 'Copy code to clipboard');
    
    // Insert button into the pre block (so it's positioned relative to it)
    preBlock.appendChild(copyButton);
    
    // Add click event
    copyButton.addEventListener('click', async () => {
      const code = preBlock.querySelector('code')?.textContent || preBlock.textContent;
      
      try {
        await navigator.clipboard.writeText(code);
        copyButton.innerHTML = '<i class="fas fa-check"></i> Copied!';
        copyButton.classList.add('copied');
        
        setTimeout(() => {
          copyButton.innerHTML = '<i class="fas fa-copy"></i> Copy';
          copyButton.classList.remove('copied');
        }, 2000);
      } catch (err) {
        console.error('Failed to copy code:', err);
        copyButton.innerHTML = '<i class="fas fa-times"></i> Failed';
        
        setTimeout(() => {
          copyButton.innerHTML = '<i class="fas fa-copy"></i> Copy';
        }, 2000);
      }
    });
  });
});
