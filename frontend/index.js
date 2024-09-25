import { backend } from 'declarations/backend';

let display = document.getElementById('display');
let buttons = document.querySelectorAll('button');
let clearButton = document.getElementById('clear');
let equalsButton = document.getElementById('equals');
let darkModeToggle = document.getElementById('darkModeToggle');

let currentValue = '';
let operator = '';
let firstOperand = null;

const emojiToNumber = {
    '0️⃣': '0', '1️⃣': '1', '2️⃣': '2', '3️⃣': '3', '4️⃣': '4',
    '5️⃣': '5', '6️⃣': '6', '7️⃣': '7', '8️⃣': '8', '9️⃣': '9',
    '🔟': '10'
};

const emojiToOperator = {
    '➕': '+', '➖': '-', '✖️': '*', '➗': '/'
};

buttons.forEach(button => {
    if (button !== clearButton && button !== equalsButton && button !== darkModeToggle) {
        button.addEventListener('click', () => {
            if (button.classList.contains('num')) {
                const number = emojiToNumber[button.textContent];
                currentValue += number;
                display.value = currentValue;
            } else if (button.classList.contains('op')) {
                if (firstOperand === null) {
                    firstOperand = parseFloat(currentValue);
                    operator = emojiToOperator[button.textContent];
                    currentValue = '';
                }
            }
        });
    }
});

clearButton.addEventListener('click', () => {
    currentValue = '';
    operator = '';
    firstOperand = null;
    display.value = '';
});

equalsButton.addEventListener('click', async () => {
    if (firstOperand !== null && operator && currentValue) {
        const secondOperand = parseFloat(currentValue);
        let result;

        switch (operator) {
            case '+':
                result = await backend.add(firstOperand, secondOperand);
                break;
            case '-':
                result = await backend.subtract(firstOperand, secondOperand);
                break;
            case '*':
                result = await backend.multiply(firstOperand, secondOperand);
                break;
            case '/':
                const divisionResult = await backend.divide(firstOperand, secondOperand);
                result = divisionResult[0] !== null ? divisionResult[0] : 'Error';
                break;
        }

        display.value = result;
        currentValue = result.toString();
        firstOperand = null;
        operator = '';
    }
});

// Dark mode functionality
function setDarkMode(isDark) {
    document.body.classList.toggle('dark-mode', isDark);
    localStorage.setItem('darkMode', isDark);
}

darkModeToggle.addEventListener('click', () => {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    setDarkMode(isDarkMode);
});

// Check for saved dark mode preference
const savedDarkMode = localStorage.getItem('darkMode');
if (savedDarkMode !== null) {
    setDarkMode(savedDarkMode === 'true');
}
