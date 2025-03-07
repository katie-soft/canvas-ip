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
  toggleSelectedButton(id);
  if (id === 'none') {
    wrapperFb.style.backgroundImage = 'none';
    wrapperVk.style.backgroundImage = 'none';
  } else {
    const backgroundOption = id.split('-')[2];
    wrapperFb.style.backgroundImage = `url('./img/background/${backgroundOption}1200.jpg')`;
    wrapperVk.style.backgroundImage = `url('./img/background/${backgroundOption}1074.jpg')`;
  }  
}

function toggleSelectedButton(id) {
  backgroundButtons.forEach(button => button.classList.remove('button_selected'));
  document.getElementById(id).classList.add('button_selected');
}

// Выбор рубрики

categoryLabelFb.src = "./img/label/novosti.png";
categoryLabelVk.src = "./img/label/novosti.png";

const categorySelect = new CustomSelect(categorySelectData);
categorySelect.create();
categorySelect.addEventListener(categorySelectData.eventName, function() {
  categoryLabelFb.src = `./img/label/${categorySelect.getValue()}.png`;
  categoryLabelVk.src = `./img/label/${categorySelect.getValue()}.png`;
});

// Очистка

buttonClear.addEventListener('click', function() {
  input.value = '';
  titleFb.textContent = 'Заголовок статьи';
  titleVk.textContent = 'Заголовок статьи';
  categoryLabelFb.src = "./img/label/novosti.png";
  categoryLabelVk.src = "./img/label/novosti.png";
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
    html2canvas(wrapperVk).then(canvas => {
      let link = document.createElement('a');
      link.href = canvas.toDataURL('image/jpg');
      link.download = 'sharing-1074.jpg';
      link.click();
    });
});