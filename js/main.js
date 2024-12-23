document.addEventListener('MatrixRainLoaded', () => {
    const terminal = document.querySelector('#terminal');
    const commandInput = document.querySelector("#command-input");

    resetCaret();

    // Set caret position
    commandInput.addEventListener("keyup", () => {
        const inputRect = commandInput.getBoundingClientRect();
        caret.style.left = `${-inputRect.width + getCaretPostionInPixel()}px`;
    });

    window.addEventListener("resize", () => {
        const inputRect = commandInput.getBoundingClientRect();
        caret.style.left = `${-inputRect.width + getCaretPostionInPixel()}px`;
    });

    // Focus the command input
    terminal.addEventListener("click", () => {
        commandInput.focus();
    });

    // Input `cat readme.md` to give user a hint
    hintAnimation();
});

function hintAnimation() {
    const hintCommand = 'cat readme.md';
    const enterKeyEvent = new KeyboardEvent('keypress', {
        key: 'Enter',
        keyCode: 13,
        bubbles: true,
    });

    // Hint for the guests of web page
    delayedCommandLineInput(hintCommand, 80).then(() => {
        commandInput.dispatchEvent(enterKeyEvent);
    }).catch((error) => {
        console.error(error);
    }).finally(() => {
        console.log('Hint for the guests of web page');
    });
}

function delayedCommandLineInput(targetCommandLineText, delayTimeinMilliseconds) {
    return new Promise((resolve) => {
        commandInput.value = '';

        // animate the response
        const intervalId = setInterval(() => {
            const currentText = commandInput.value;
            const nextChar = targetCommandLineText[currentText.length];
            if (nextChar) {
                commandInput.value += nextChar;
                commandInput.dispatchEvent(new Event('keyup'));
            } else {
                clearInterval(intervalId);
                resolve();
            }
        }, delayTimeinMilliseconds);
    });
}

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

function getCaretPostionInPixel() {
    const commandInput = document.querySelector("#command-input");
    const caretPosition = commandInput.selectionStart;
    const totalWidth = Number(getCommandInputTextWidthInPixel());
    const charNumInput = commandInput.value.length;
    const charWidth = (charNumInput > 0) ? (totalWidth / charNumInput) : 0;

    return caretPosition * charWidth;
}