const memory = document.querySelector('.calculator');
const calcButtons = document.querySelector('.buttons');
const input = document.querySelector('#expression');
const solution = document.querySelector('#answer');

// Declared variables for:
// 1. the expression to be evaluated back-end
// 2. state of the calculator
// 3. checking if and if not an expression has a decimal point
// 4. the operators available for use in the calculator
let equation = 0;
let equalPressed = false;
let checkDecimal = '';
const operators = ['/', 'x', '+', '-'];

// The function uses a number of conditions to evaluate the result of pressing each button
function handleEvent(e) {
  if (!e.target.closest('button')) return;

  const key = e.target;
  const keyValue = key.textContent;
  let inputDisplay = input.textContent;
  const { type } = key.dataset; // destructured assignment to type of current button
  const { previousKey } = memory.dataset; // destructured assignment for type of previous button

  if (type === 'digit' && !inputDisplay.endsWith('%') && !equalPressed) {
    // the calculator displays zero before any operation or after reset
    if (inputDisplay === '0') {
      input.textContent = (previousKey === 'operator') ? inputDisplay + keyValue : keyValue; // concatenate button values for display

      equation = (previousKey === 'operator') ? equation + key.value : key.value; // collect button values for evaluation

      checkDecimal += keyValue; // checks digits for first decimal point and length
    } else if (checkDecimal.length > 18) {
      // Limit the number of digits to 18, convert to exponential otherwise
      const numbers = checkDecimal;

      checkDecimal = Number(checkDecimal).toExponential(2);

      input.textContent = inputDisplay.replace(numbers, checkDecimal);
    } else {
      // eslint-disable-next-line no-nested-ternary
      input.textContent = input.textContent.includes('I') // Checks if Infinity is returned from an evaluation in display
        ? 'Infinity'
        : input.textContent.includes('N') // Checks if an evaluation returns NaN in display
          ? 'NaN'
          : inputDisplay + keyValue;

      equation += key.value;

      checkDecimal += keyValue;
    }
  }

  // while expression is yet to be evaluated

  if (!inputDisplay.includes('Infinity') && !equalPressed) {
    // check that the percent sign only concats with digits
    if (type === 'percentage' && previousKey !== 'percentage' && !inputDisplay.endsWith('%')) {
      input.textContent = (previousKey === 'digit' || inputDisplay === '0') ? inputDisplay + keyValue : inputDisplay;
      equation = (previousKey === 'digit' || inputDisplay === '0') ? equation + key.value : equation;
      checkDecimal += keyValue;
    }

    // checks that a decimal point only concats with digits that:
    // do not already have a decimal point or end with a percentage sign
    if (type === 'decimal' && (previousKey === 'digit' || inputDisplay === '0')
    && !checkDecimal.includes('.') && !inputDisplay.endsWith('%')) {
      input.textContent = inputDisplay + keyValue;
      equation += key.value;
      checkDecimal += keyValue;
    }

    // checks that an operator only concats with digits
    if (type === 'operator' && previousKey !== 'operator') {
      checkDecimal = ''; // resets after an operator to begin check on next set of digits
      input.textContent = `${inputDisplay} ${keyValue} `; // interpolation adds space between operands and operator
      equation = `${equation} ${key.value} `;
    }
  }

  if ((type === 'reset' || type === 'delete') && inputDisplay !== '0') {
    if (type === 'delete' && !equalPressed) {
      // by slicing the last value is removed from display when DEL is pressed
      input.textContent = inputDisplay.slice(0, -1);
      equation = equation.slice(0, -1);
      checkDecimal = checkDecimal.slice(0, -1);
    } else {
      // reset all values if AC is pressed
      inputDisplay = '0';
      input.textContent = inputDisplay;
      solution.innerHTML = '&emsp;'; // resets solution to an empty space for new operation
      equalPressed = false;
      equation = '';
      checkDecimal = '';
    }
  }
}

// eslint-disable-next-line consistent-return
function solve(firstNum, operator, secondNum) {
  // operands will return true for isNan if it is a percentage

  // eslint-disable-next-line no-restricted-globals
  firstNum = isNaN(firstNum) ? firstNum.slice(0, -1) / 100 : Number(firstNum);
  // eslint-disable-next-line no-restricted-globals
  secondNum = isNaN(secondNum) ? secondNum.slice(0, -1) / 100 : Number(secondNum);

  if (operator === 'plus' || operator === '+') return firstNum + secondNum;
  if (operator === 'minus' || operator === '-') return firstNum - secondNum;
  if (operator === 'multiply' || operator === 'x') return firstNum * secondNum;
  if (operator === 'division' || operator === '/') return firstNum / secondNum;
}

function handleEquation(equation) {
  let firstNum;
  let operator;
  let secondNum;
  let operatorIndex;
  let result;

  equation = equation.split(' ');

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < operators.length; i++) {
    // loop through the operators array line 14
    // the operands in the array are indexed to follow BODMAS rule
    while (equation.includes(operators[i])) {
      operatorIndex = equation.findIndex(val => val === operators[i]); // find index of operator(s)
      firstNum = equation[operatorIndex - 1]; // the operand would be before the operator
      operator = equation[operatorIndex];
      secondNum = equation[operatorIndex + 1]; // the next operand would be after the operator
      result = solve(firstNum, operator, secondNum);
      // by splicing, the evaluation will continue until there are no more operators
      equation.splice(operatorIndex - 1, 3, result);
    }
  }
  return result;
}

calcButtons.addEventListener('click', handleEvent);
