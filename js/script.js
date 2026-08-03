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

  // One interactive robot arm per featured card
  document.querySelectorAll('[data-interactive-arm]').forEach(armSection => {
    const armsLayer = armSection.querySelector('.robot-arms');
    if (!armsLayer) return;
    const svg = armsLayer.querySelector('svg');
    const group = armsLayer.querySelector('.robot-arm');
    const arm = {
      group,
      side: group.dataset.arm,
      upper: group.querySelector('.arm-link-upper'),
      middle: group.querySelector('.arm-link-middle'),
      lower: group.querySelector('.arm-link-lower'),
      shoulder: group.querySelector('.arm-shoulder'),
      elbow: group.querySelector('.arm-elbow'),
      midJoint: group.querySelector('.arm-mid-joint'),
      wrist: group.querySelector('.arm-wrist'),
      palm: group.querySelector('.arm-palm'),
      fingerOne: group.querySelector('.arm-finger-one'),
      fingerTwo: group.querySelector('.arm-finger-two'),
      target: null,
      wristPosition: null,
      grip: 12
    };
    let animationFrame = null;
    let framesRemaining = 0;

    const setLine = (line, x1, y1, x2, y2) => {
      line.setAttribute('x1', x1);
      line.setAttribute('y1', y1);
      line.setAttribute('x2', x2);
      line.setAttribute('y2', y2);
    };

    const setCircle = (circle, x, y) => {
      circle.setAttribute('cx', x);
      circle.setAttribute('cy', y);
    };

    const drawArm = (width, height) => {
      const isLeft = arm.side === 'left';
      const base = { x: isLeft ? 18 : width - 18, y: height * 0.62 };
      const restingTarget = {
        x: isLeft ? width * 0.2 : width * 0.8,
        y: height * 0.7
      };
      const isReaching = Boolean(arm.target);
      const pointerTarget = isReaching ? arm.target : restingTarget;
      const pointerDx = pointerTarget.x - base.x;
      const pointerDy = pointerTarget.y - base.y;
      const pointerDistance = Math.hypot(pointerDx, pointerDy) || 1;
      const handLength = isReaching ? 18 : 0;
      const desired = {
        x: pointerTarget.x - (pointerDx / pointerDistance) * handLength,
        y: pointerTarget.y - (pointerDy / pointerDistance) * handLength
      };
      const isCompactCard = height < 400;
      const linkOne = Math.min(isCompactCard ? 175 : 230, width * 0.24);
      const linkTwo = Math.min(isCompactCard ? 150 : 200, width * 0.21);
      const linkThree = Math.min(isCompactCard ? 120 : 170, width * 0.17);
      const dx = desired.x - base.x;
      const dy = desired.y - base.y;
      const distance = Math.hypot(dx, dy) || 1;
      const reachableDistance = Math.min(Math.max(distance, 35), linkOne + linkTwo + linkThree - 4);
      const wristTarget = {
        x: base.x + (dx / distance) * reachableDistance,
        y: base.y + (dy / distance) * reachableDistance
      };

      if (!arm.wristPosition) arm.wristPosition = { ...restingTarget };
      arm.wristPosition.x += (wristTarget.x - arm.wristPosition.x) * 0.18;
      arm.wristPosition.y += (wristTarget.y - arm.wristPosition.y) * 0.18;

      const wx = arm.wristPosition.x - base.x;
      const wy = arm.wristPosition.y - base.y;
      const wristDistance = Math.min(Math.max(Math.hypot(wx, wy), 1), linkOne + linkTwo + linkThree - 1);
      const wristAngle = Math.atan2(wy, wx);
      const wrist = {
        x: base.x + Math.cos(wristAngle) * wristDistance,
        y: base.y + Math.sin(wristAngle) * wristDistance
      };
      const midTarget = {
        x: wrist.x - Math.cos(wristAngle) * linkThree,
        y: wrist.y - Math.sin(wristAngle) * linkThree
      };
      const mx = midTarget.x - base.x;
      const my = midTarget.y - base.y;
      const midDistance = Math.min(Math.max(Math.hypot(mx, my), 1), linkOne + linkTwo - 1);
      const midAngle = Math.atan2(my, mx);
      const elbowOffset = Math.acos(Math.max(-1, Math.min(1,
        (linkOne * linkOne + midDistance * midDistance - linkTwo * linkTwo) / (2 * linkOne * midDistance)
      )));
      const bendDirection = isLeft ? -1 : 1;
      const upperAngle = midAngle + bendDirection * elbowOffset;
      const elbow = {
        x: base.x + Math.cos(upperAngle) * linkOne,
        y: base.y + Math.sin(upperAngle) * linkOne
      };
      const midJointAngle = Math.atan2(midTarget.y - elbow.y, midTarget.x - elbow.x);
      const midJoint = {
        x: elbow.x + Math.cos(midJointAngle) * linkTwo,
        y: elbow.y + Math.sin(midJointAngle) * linkTwo
      };
      const handAngle = Math.atan2(wrist.y - midJoint.y, wrist.x - midJoint.x);
      const forward = { x: Math.cos(handAngle), y: Math.sin(handAngle) };
      const normal = { x: -forward.y, y: forward.x };
      const targetGrip = isReaching ? 4 : 12;
      arm.grip += (targetGrip - arm.grip) * 0.16;
      const gripGap = arm.grip;
      const palmHalf = 10;
      const fingerLength = 18;

      setLine(arm.upper, base.x, base.y, elbow.x, elbow.y);
      setLine(arm.middle, elbow.x, elbow.y, midJoint.x, midJoint.y);
      setLine(arm.lower, midJoint.x, midJoint.y, wrist.x, wrist.y);
      setCircle(arm.shoulder, base.x, base.y);
      setCircle(arm.elbow, elbow.x, elbow.y);
      setCircle(arm.midJoint, midJoint.x, midJoint.y);
      setCircle(arm.wrist, wrist.x, wrist.y);
      setLine(arm.palm,
        wrist.x - normal.x * palmHalf, wrist.y - normal.y * palmHalf,
        wrist.x + normal.x * palmHalf, wrist.y + normal.y * palmHalf
      );
      setLine(arm.fingerOne,
        wrist.x + normal.x * gripGap, wrist.y + normal.y * gripGap,
        wrist.x + forward.x * fingerLength + normal.x * 2, wrist.y + forward.y * fingerLength + normal.y * 2
      );
      setLine(arm.fingerTwo,
        wrist.x - normal.x * gripGap, wrist.y - normal.y * gripGap,
        wrist.x + forward.x * fingerLength - normal.x * 2, wrist.y + forward.y * fingerLength - normal.y * 2
      );
      arm.group.classList.toggle('is-reaching', isReaching);
    };

    const renderArms = () => {
      const { width, height } = armSection.getBoundingClientRect();
      svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
      drawArm(width, height);
      framesRemaining -= 1;
      animationFrame = framesRemaining > 0 ? requestAnimationFrame(renderArms) : null;
    };

    const requestArmRender = (frameCount = 24) => {
      framesRemaining = Math.max(framesRemaining, frameCount);
      if (!animationFrame) animationFrame = requestAnimationFrame(renderArms);
    };

    const reachForPointer = event => {
      const bounds = armSection.getBoundingClientRect();
      arm.target = { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
      requestArmRender();
    };

    const releaseArm = () => {
      arm.target = null;
      requestArmRender(36);
    };

    armSection.addEventListener('pointerdown', reachForPointer);
    armSection.addEventListener('pointermove', reachForPointer);
    armSection.addEventListener('pointerup', releaseArm);
    armSection.addEventListener('pointerleave', releaseArm);
    armSection.addEventListener('pointercancel', releaseArm);
    window.addEventListener('resize', () => requestArmRender(1));
    requestArmRender(1);
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
