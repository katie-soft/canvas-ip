import { steps } from './steps.js';
import { stepModal, stepModalContent } from './modal.js';
import { Particle } from './particle.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Счетчик прогресса
const progressCounter = document.getElementById('progressCounter');

function updateProgressCounter() {
  const doneCount = steps.filter(s => s.done).length;
  progressCounter.textContent = `Пройдено шагов: ${doneCount} / ${steps.length}`;
}

// Персонаж
const heroImage = new Image();
heroImage.src = '/canvas-ip/canvas-bs/images/hero.png';

const character = {
  x: 130,
  y: 75,
  targetX: 75,
  targetY: 75,
  rotation: 0,
  wobbleAngle: 0
};

let animationFrame;

function animateCharacter() {
  const speed = 2;
  const dx = character.targetX - character.x;
  const dy = character.targetY - character.y;
  const distance = Math.sqrt(dx * dx + dy * dy);


  if (distance > 1) {
    character.x += dx / distance * speed;
    character.y += dy / distance * speed;
    character.wobbleAngle += 0.15;
    character.rotation = Math.sin(character.wobbleAngle) * 0.1;

    drawAll();
    animationFrame = requestAnimationFrame(animateCharacter);

  } else {
    character.x = character.targetX;
    character.y = character.targetY;
    character.rotation = 0;
    drawAll();
    cancelAnimationFrame(animationFrame);
  }
}

function drawCharacter() {
  if (!heroImage.complete) {
    heroImage.onload = drawAll;
    return;
  }

  ctx.save();
  ctx.translate(character.x - 30, character.y - 30);
  ctx.rotate(character.rotation);
  ctx.drawImage(heroImage, -20, -40, 100, 100);
  ctx.restore();
}

// Маршрут
let currentStepIndex = null;
let fireworks = [];
let fireworksActive = false;

function wrapText(text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}

function drawSteps() {
  ctx.font = '28px Arial';
  ctx.textAlign = 'center';

  steps.forEach((step, index) => {
    const isAccessible = index === 0 || steps[index - 1].done;
    ctx.beginPath();

    if (!isAccessible) {
      ctx.fillStyle = 'blue';
      ctx.fillRect(step.x - 20, step.y - 20, 40, 40);
      ctx.fillStyle = 'white';
      ctx.font = 'bold 20px Arial';
      ctx.fillText('?', step.x, step.y + 7);
      
    } else {

      if (step.type === 'dot') {
        if (step.done === false) {
          const pulseRadius = 18 + 3 * Math.sin(Date.now() / 200);
          ctx.strokeStyle = 'grey';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.arc(step.x, step.y, pulseRadius, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(step.x, step.y, 15, 0, Math.PI * 2);
          ctx.fillStyle = step.done ? 'green' : 'grey';
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(step.x, step.y, 15, 0, Math.PI * 2);
          ctx.fillStyle = 'green';
          ctx.fill();
        }
      } else if (step.type === 'star') {
        drawStar(step.x, step.y, 5, 10, 20, step.done ? 'orange' : 'yellow');
      }

      const textX = step.x;
      const textY = step.y + 50;

      ctx.font = '28px Arial';
      ctx.textAlign = 'center';

      const metrics = ctx.measureText(step.name);
      const textWidth = Math.min(metrics.width, 240);
      const padding = 10;
      const lineHeight = 36;
      const textHeight = lineHeight * 2;

      // Серая подложка для пунктов со звездочкой
      if (step.type === 'star') {
        ctx.fillStyle = '#3B3A3A';
        ctx.fillRect(
          textX - textWidth / 2 - padding,
          textY - lineHeight + 8,
          textWidth + padding * 2,
          textHeight + padding / 2
        );
      }
  
      ctx.fillStyle = 'white';
      wrapText(step.name, textX, textY, 240, 36);
    }
    ctx.closePath();

    if (step.done) {
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(step.x - 6, step.y);
      ctx.lineTo(step.x - 1, step.y + 6);
      ctx.lineTo(step.x + 7, step.y - 6);
      ctx.stroke();
    }
  });
}

function drawPath() {
  ctx.beginPath();
  ctx.moveTo(steps[0].x, steps[0].y);
  for (let i = 1; i < steps.length; i++) {
    ctx.lineTo(steps[i].x, steps[i].y);
  }
  ctx.strokeStyle = 'yellow';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.closePath();
}

function drawAll() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPath();
  drawSteps();
  drawCharacter();
  updateProgressCounter();
}

drawAll();

// Открытие модалки по клику
canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  steps.forEach((step, index) => {
    const isAccessible = index === 0 || steps[index - 1].done;
    if (!isAccessible) return;

    const dx = x - step.x;
    const dy = y - step.y;
    if (Math.sqrt(dx * dx + dy * dy) < 15) {
      currentStepIndex = index;
      const linkList = step.links.map(link => `<li><a href="${link}" target="_blank">${link}</a></li>`).join('');
      stepModalContent.innerHTML = `
        <p>${step.text}</p>
        <p class="more-articles">Статьи по теме:</p>
        <ul class="link-list">${linkList}</ul>
        <button class="button button_ready" id="completeStep">Готово</button>
      `;
      stepModal.style.display = "block";

      // Слушатель на кнопку Готово
      setTimeout(() => {
        const completeBtn = document.getElementById("completeStep");
        if (completeBtn) {
          completeBtn.onclick = () => {
            steps[currentStepIndex].done = true;
            character.targetX = steps[currentStepIndex].x;
            character.targetY = steps[currentStepIndex].y - 50;
            animateCharacter();
            stepModal.style.display = "none";

            const allDone = steps.every(s => s.done);
            if (allDone && !fireworksActive) {
              setTimeout(() => {
                triggerFireworks(character.targetX, character.targetY - 100);
              }, 2300);
            };
          }
        }
      }, 0);
    }
  });
});

// Ховер (cursor: pointer либо тултип)
const tooltip = document.getElementById('tooltip');
let hoveredStepIndex = null;

canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  let hovered = false;
  let tooltipShown = false;
  hoveredStepIndex = null;

  steps.forEach((step, index) => {
    const dx = x - step.x;
    const dy = y - step.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const isAccessible = index === 0 || steps[index - 1].done;

    if (distance < 20) {
      if (isAccessible) {
        hovered = true;
        tooltipShown = false;
        hoveredStepIndex = index;
      } else {
        hovered = false;
        tooltipShown = true;
        tooltip.style.display = 'block';
        tooltip.style.left = `${e.clientX + 10}px`;
        tooltip.style.top = `${e.clientY + 10}px`;
      }
    }
  });

  if (!tooltipShown) {
    tooltip.style.display = 'none';
  }

  canvas.style.cursor = hovered ? 'pointer' : (tooltipShown ? 'not-allowed' : 'default');
});

function animatePulse() {
  drawAll();
  requestAnimationFrame(animatePulse);
}
animatePulse();

// Иконка звезды
function drawStar(cx, cy, spikes, outerRadius, innerRadius, fillStyle) {
  let rot = Math.PI / 2 * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.fillStyle = fillStyle;
  ctx.fill();
}

// Фейерверк
function triggerFireworks(x, y) {
  fireworks = [];
  for (let i = 0; i < 50; i++) {
    const angle = Math.random() * 2 * Math.PI;
    const speed = 2 + Math.random() * 4;
    const color = `hsl(${Math.random() * 360}, 100%, 60%)`;
    fireworks.push(new Particle(x, y, angle, speed, color));
  }
  fireworksActive = true;
  animateFireworks();
}

function animateFireworks() {
  if (!fireworksActive) return;

  drawAll();
  fireworks.forEach(p => p.update());
  fireworks = fireworks.filter(p => p.alpha > 0);

  fireworks.forEach(p => p.draw(ctx));

  if (fireworks.length > 0) {
    requestAnimationFrame(animateFireworks);
  } else {
    fireworksActive = false;
  }
}