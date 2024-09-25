const canvas = document.querySelector('#matrix-rain');
const ctx = canvas.getContext('2d');

// Set canvas size to the window size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Matrix characters (can use any character set you prefer)
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#$%^&*()*&^%+-/~{[|`]}';
const matrixChars = characters.split('');

// Font size
const fontSize = 16;
const columns = canvas.width / fontSize; // Number of columns for the rain

// Array to store the y-position for each column (for where each "rain" starts)
const drops = Array.from({ length: columns }, () => Math.floor(Math.random() * canvas.height));

// Draw the Matrix effect
function draw() {
  // Black background with slight opacity for fading effect
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Set the text color and font
  ctx.fillStyle = '#0F0'; // Green
  ctx.font = `${fontSize}px monospace`;

  // Loop over each column and draw the characters
  drops.forEach((y, i) => {
    const text = matrixChars[Math.floor(Math.random() * matrixChars.length)];

    // Draw the character at (x, y)
    const x = i * fontSize;
    ctx.fillText(text, x, y);

    // Randomly reset the drop after it reaches the bottom of the screen
    if (y > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }

    // Move the drop down by the font size
    drops[i] += fontSize;
  });
}

// Loop the animation
let startTime = Date.now();
function loop() {
  const timeElapsed = Date.now() - startTime;
  if (timeElapsed < 2000) {
    draw();
    requestAnimationFrame(loop);
  } else {
    canvas.style.display = 'none';
    const terminal = document.querySelector('#terminal');
    terminal.style.display = 'block';
  }
}
loop();




