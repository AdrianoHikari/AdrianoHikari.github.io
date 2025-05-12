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
const popSound = new Audio('monster-death-grunt-131480.mp3');

function moveCubetto() {
  cubetto.style.left = `${posX}px`;
  cubetto.style.bottom = `${posY}px`;
  checkCollision();
}

function jumpCubetto() {
  if (isJumping) return;
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

function checkCollision() {
  if (!monetina || monetina.style.display === 'none') return;
  if (!monetina2 || monetina2.style.display === 'none') return;       

  const cubettoRect = cubetto.getBoundingClientRect();
  const monetinaRect = monetina.getBoundingClientRect();
  const monetina2Rect = monetina2.getBoundingClientRect();

  const isColliding = !(
    cubettoRect.right < monetinaRect.left ||
    cubettoRect.left > monetinaRect.right ||
    cubettoRect.bottom < monetinaRect.top ||
    cubettoRect.top > monetinaRect.bottom
  );


   const isColliding2 = !(
    cubettoRect.right < monetina2Rect.left ||
    cubettoRect.left > monetina2Rect.right ||
    cubettoRect.bottom < monetina2Rect.top ||
    cubettoRect.top > monetina2Rect.bottom
  );

  if (isColliding2) {
    monetina2.style.display = 'none';
    coinSound.play();
    coinCount++;
    document.getElementById('coinCount').textContent = `Monetine raccolte: ${coinCount}`;
  }

  if (isColliding) {
    monetina.style.display = 'none';
    coinSound.play(); 
    coinCount++; 
    document.getElementById('coinCount').textContent = `Monetine raccolte: ${coinCount}`;
    console.log("💥 COLLISIONE con monetina!");
  }



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

