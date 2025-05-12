let posX = 0;
let posY = 100;
let isJumping = false;
let wPressed = false;
let coinCount = 0;

const cubetto = document.getElementById('cubetto');
const monetina = document.getElementById('monetina1');
const monetina2 = document.getElementById('monetina2');
const container = document.getElementById('container');
const moveSpeed = 10;
const jumpHeight = 1000;
const jumpDuration = 400;
const jumpSound = document.getElementById('suonosalto');
const coinSound = document.getElementById('suonomonetina');

// Movimento del cubetto con animazione fluida
function moveCubetto() {
  cubetto.style.left = `${posX}px`;
  cubetto.style.bottom = `${posY}px`;
  checkCollision();
}

// Funzione per far saltare il cubetto
function jumpCubetto() {
  if (isJumping) return;  // Impedisce di saltare durante il salto
  isJumping = true;

  jumpSound.play();

  const startY = posY;
  const startTime = performance.now();

  function animateJump(time) {
    const elapsed = time - startTime;
    const t = elapsed / jumpDuration;

    if (t < 1) {
      const height = -4 * jumpHeight * (t - 0.5) ** 2 + jumpHeight;
      posY = startY + height;
      moveCubetto();
      requestAnimationFrame(animateJump);
    } else {
      posY = startY;
      isJumping = false;
      moveCubetto();
    }
  }

  requestAnimationFrame(animateJump);
}

// Funzione per gestire la collisione con la monetina
function checkCollision() {
  if (!monetina || monetina.style.display === 'none') return;

  const cubettoRect = cubetto.getBoundingClientRect();
  const monetinaRect = monetina.getBoundingClientRect();

  const isColliding = !(
    cubettoRect.right < monetinaRect.left ||
    cubettoRect.left > monetinaRect.right ||
    cubettoRect.bottom < monetinaRect.top ||
    cubettoRect.top > monetinaRect.bottom
  );

  if (isColliding) {
    coinSound.play();
    coinCount++;
    document.getElementById('coinCount').textContent = `Monetine raccolte: ${coinCount}`;
    console.log("💥 COLLISIONE con monetina!");
    moveCoin(); // Muove la monetina dopo la collisione
  }

  // Gestione degli ostacoli
  if (ostacolo) {
    const ostacoloRect = ostacolo.getBoundingClientRect();
    const hitsOstacolo = !(
      cubettoRect.right < ostacoloRect.left ||
      cubettoRect.left > ostacoloRect.right ||
      cubettoRect.bottom < ostacoloRect.top ||
      cubettoRect.top > ostacoloRect.bottom
    );
    if (hitsOstacolo) {
      console.log("💥 Sei morto!");
      alert("Game Over!");
    }
  }
}

// Funzione per spostare la monetina casualmente sulla stessa altezza
function moveCoin() {
  const containerWidth = container.offsetWidth;
  const containerHeight = container.offsetHeight;

  // Manteniamo la stessa altezza della monetina (bottom) e spostiamo solo la posizione orizzontale (left)
  const newPosX = Math.floor(Math.random() * (containerWidth - 175)); // 175 è la larghezza della monetina
  const currentPosY = parseFloat(monetina.style.bottom) || 30; // Recupera la posizione verticale corrente (default è 30px)
 
  // Applica la nuova posizione
  monetina.style.left = `${newPosX}px`;
  monetina.style.bottom = `${currentPosY}px`; // Mantieni la stessa altezza
}

// Gestione dei tasti premuti
document.addEventListener('keydown', (event) => {
  const containerWidth = container.offsetWidth;

  if (event.key === 'a' || event.key === 'A') {
    posX -= moveSpeed;
    if (posX < 0) posX = 0;
    moveCubetto();
  } else if (event.key === 'd' || event.key === 'D') {
    posX += moveSpeed;
    if (posX > containerWidth - 50) posX = containerWidth - 50;
    moveCubetto();
  } else if ((event.key === 'w' || event.key === 'W') && !wPressed) {
    wPressed = true;
    jumpCubetto();
  }
});

document.addEventListener('keyup', (event) => {
  if (event.key === 'w' || event.key === 'W') {
    wPressed = false;
  }
});

let startTime = Date.now();
let timerInterval = setInterval(updateTimer, 1000);

function updateTimer() {
  const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  document.getElementById('timer').textContent = `Tempo: ${elapsedTime}s`;
}

setInterval(() => {
  checkCollision();
}, 30);
  