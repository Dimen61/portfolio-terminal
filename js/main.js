document.addEventListener('MatrixRainLoaded', () => {
    const terimial = document.querySelector('#terminal');
    const commandInput = document.querySelector("#command-input");

    resetCaret();

    commandInput.addEventListener("input", () => {
        const inputRect = commandInput.getBoundingClientRect();
        caret.style.left = `${-inputRect.width + Number(getCommandInputTextWidthInPixel())}px`;

        console.log(`-inputRect.width: ${-inputRect.width}`);
        console.log(`getCommandInputTextWidthInPixel: ${getCommandInputTextWidthInPixel()}`);
        console.log(`caret.style.left: ${caret.style.left}`);
        console.log('Move the caret');
    });

    terimial.addEventListener("click", () => {
        commandInput.focus();
    });
});

function resetCaret() {
    const caret = document.querySelector("#caret");
    const commandInput = document.querySelector("#command-input");
    const inputRect = commandInput.getBoundingClientRect();

    caret.style.left = `-${inputRect.width}px`;
    commandInput.focus();
}

function getCommandInputTextWidthInPixel() {
    const input = document.querySelector('#command-input');
    const text = input.value;

    // Create a canvas element (not displayed)
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    // Set the font to match the input's font style (size, family, etc.)
    const fontSize = window.getComputedStyle(input).fontSize;
    const fontFamily = window.getComputedStyle(input).fontFamily;
    context.font = `${fontSize} ${fontFamily}`;

    // Measure the width of the text
    const textWidth = context.measureText(text).width;
    return `${textWidth}`;
}

console.log('Main css is ready...');
