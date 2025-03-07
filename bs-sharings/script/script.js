const wrapperFb = document.getElementById('sharing-1200');
const wrapperVk = document.getElementById('sharing-1074');
const titleFb = document.getElementById('title-1200');
const titleVk = document.getElementById('title-1074');
const categoryLabelFb = document.getElementById('category-label-1200');
const categoryLabelVk = document.getElementById('category-label-1074');
const input = document.getElementById('input');
const buttonClear = document.getElementById('button_clear');

// Смена текста при вводе в инпут

input.addEventListener('input', function() {
    titleFb.textContent = this.value;
    titleVk.textContent = this.value;
});

// Кнопки для смены бэкграунда

const buttonIds = ['background-button-gradient', 'background-button-noise', 'background-button-none'];
const backgroundButtons = buttonIds.map((id) => document.getElementById(id));
backgroundButtons.forEach(button => button.addEventListener('click', () => setBackground(button.id)));

function setBackground(id) {
  const backgroundOption = id.split('-')[2];
  let newBackgroundImage = '';
  switch (backgroundOption) {
    case 'gradient':
      newBackgroundImage = "url('../img/background/gradient.jpg')";
      break;
    case 'noise':
      newBackgroundImage = "url('../img/background/noise.jpg')";
      break;
    case 'none':
    default:
      newBackgroundImage = 'none';
  }
  toggleSelectedButton(id);
  wrapperFb.style.backgroundImage = newBackgroundImage;
  wrapperVk.style.backgroundImage = newBackgroundImage;
}

function toggleSelectedButton(id) {
  backgroundButtons.forEach(button => button.classList.remove('button_selected'));
  document.getElementById(id).classList.add('button_selected');
}

// Выбор рубрики

categoryLabelFb.src = "../img/label/novosti.jpg";
categoryLabelVk.src = "../img/label/novosti.jpg";

const categorySelect = new CustomSelect(categorySelectData);
categorySelect.create();
categorySelect.addEventListener(categorySelectData.eventName, function() {
  categoryLabelFb.src = `../img/label/${categorySelect.getValue()}.jpg`;
  categoryLabelVk.src = `../img/label/${categorySelect.getValue()}.jpg`;
});

// Очистка

buttonClear.addEventListener('click', function() {
  input.value = '';
  categoryLabelFb.src = "../img/label/novosti.jpg";
  categoryLabelVk.src = "../img/label/novosti.jpg";
  wrapperFb.style.backgroundImage = 'none';
  wrapperVk.style.backgroundImage = 'none';
  toggleSelectedButton('background-button-none');
  categorySelect.reset();
})

// Выгрузка в jpg

document.getElementById('download-1200').addEventListener('click', function() {
    html2canvas(wrapperFb).then(canvas => {
      let link = document.createElement('a');
      link.href = canvas.toDataURL('image/jpg');
      link.download = 'sharing-1200.jpg';
      link.click();
    });
});

document.getElementById('download-1074').addEventListener('click', function() {
    html2canvas(wrapperFb).then(canvas => {
      let link = document.createElement('a');
      link.href = canvas.toDataURL('image/jpg');
      link.download = 'sharing-1074.jpg';
      link.click();
    });
});

// Примеры заголовков для тестирования:
// Автоматизация работы с отзывами
// Инновации и индивидуальный подход: Олеся Иванова о будущих тенденциях в деловом туризме
// Как выпустить игру в Steam: полное руководство для бизнеса из России