const form = document.querySelector('form');
const addButton = document.querySelector('.add-button');

function getBeverageCount() {
  return document.querySelectorAll('.beverage').length;
}

function updateDeleteButtons() {
  const count = getBeverageCount();
  document.querySelectorAll('.delete-button').forEach(btn => {
    btn.disabled = count <= 1;
  });
}

function renumberBeverages() {
  document.querySelectorAll('.beverage').forEach((fieldset, index) => {
    const num = index + 1;
    fieldset.querySelector('.beverage-count').textContent = `Напиток №${num}`;
    fieldset.querySelectorAll('input[type="radio"]').forEach(radio => {
      radio.name = `milk-${num}`;
    });
  });
}

function onDeleteClick(event) {
  if (getBeverageCount() <= 1) return;
  event.currentTarget.closest('.beverage').remove();
  renumberBeverages();
  updateDeleteButtons();
}

function addDeleteButton(fieldset) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'delete-button';
  btn.textContent = '×';
  btn.addEventListener('click', onDeleteClick);
  fieldset.appendChild(btn);
}

function getDrinksStringForModal() {
  const count = getBeverageCount();

  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return `${count} напитков`;
  }

  switch (lastDigit) {
    case 1:
      return `${count} напиток`;
    case 2:
    case 3:
    case 4:
      return `${count} напитка`;
    default:
      return `${count} напитков`;
  }
}

// Init first fieldset
const firstFieldset = document.querySelector('.beverage');
firstFieldset.querySelectorAll('input[type="radio"]').forEach(radio => {
  radio.name = 'milk-1';
});
addDeleteButton(firstFieldset);
updateDeleteButtons();

addButton.addEventListener('click', () => {
  const beverages = document.querySelectorAll('.beverage');
  const newIndex = beverages.length + 1;
  const newFieldset = beverages[0].cloneNode(true);

  newFieldset.querySelector('.beverage-count').textContent = `Напиток №${newIndex}`;
  newFieldset.querySelector('select').selectedIndex = 0;
  newFieldset.querySelectorAll('input[type="radio"]').forEach((radio, i) => {
    radio.name = `milk-${newIndex}`;
    radio.checked = i === 0;
  });
  newFieldset.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    cb.checked = false;
  });

  // Re-attach delete button listener (cloneNode doesn't copy listeners)
  newFieldset.querySelector('.delete-button').addEventListener('click', onDeleteClick);

  // Reset wishes textarea and preview
  newFieldset.querySelector('.wishes-input').value = '';
  newFieldset.querySelector('.wishes-preview').innerHTML = '';

  form.insertBefore(newFieldset, addButton.parentElement);
  updateDeleteButtons();
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const modalWindow = document.querySelector('.modal-window');

  const drinksCountElement = document.createElement('p');
  drinksCountElement.textContent = `Вы заказали ${getDrinksStringForModal()}.`;
  modalWindow.appendChild(drinksCountElement);
  modalOverlay.classList.add('active');
});

const closeModalBtn = document.querySelector('.close-modal-button');
const modalOverlay = document.querySelector('.modal-overlay');

closeModalBtn.addEventListener('click', function () {
  modalOverlay.classList.remove('active');
  location.reload();
});

const URGENT_PATTERN = /(срочно|побыстрее|быстрее|поскорее|скорее|очень нужно)/gi;

function highlightUrgent(text) {
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return escaped.replace(URGENT_PATTERN, '<b>$1</b>');
}

form.addEventListener('input', event => {
  if (!event.target.matches('.wishes-input')) return;
  const preview = event.target.closest('.wishes-field').querySelector('.wishes-preview');
  preview.innerHTML = highlightUrgent(event.target.value);
});


