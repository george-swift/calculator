const memory = document.querySelector('.calculator');
const calcButtons = document.querySelector('.buttons');
const input = document.querySelector('#expression');
const solution = document.querySelector('#answer');

function handleEvent(e) {
  if (!e.target.closest('button')) return;
  let key = e.target;
  let keyValue = key.textContent;
  console.log(keyValue);
}

calcButtons.addEventListener('click', handleEvent);