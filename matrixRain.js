const canvas = document.querySelector('#matrix-rain');
const ctx = canvas.getContext('2d');

// Set canvas size to the window size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Matrix characters (can use any character set you prefer)
const characters = `
When I was young and free and my imagination had no limits,I dreamed of changing the world.
As I grew older and wiser, I discovered the world would not change, so I shortend my sights somewhat and decided to change only my country.But it, too, seemed immovable.
As I grew into my twilight years, in one last desperate attempt, I settled for changing only my family, those closest to me, but alas, they would have none of it.
And now, as I lie on my death bed,I suddenly realize:
If I had only change myself first,then by example I would have changed my family. From their inspiration and encouragement,I would then have been able to better my country,and who knows,I may have even changed the world.
`;
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
    const text = matrixChars[Math.floor(Math.random() * matrixChars.length)].toUpperCase();

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

  if (timeElapsed < 2500) {
    draw();
    setTimeout(loop, 20);
    // requestAnimationFrame(loop);
  } else {
    canvas.style.display = 'none';
    const terminal = document.querySelector('#terminal');
    terminal.style.display = 'block';

    document.dispatchEvent(new Event('MatrixRainLoaded'));
  }
}

loop();

console.log('Matrix rain!!!');



