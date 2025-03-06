const wrapperFb = document.getElementById('sharing-1200');
const title = document.getElementById('title');
const input = document.getElementById('input');
const categoryLabel = document.getElementById('category-label');

// Смена текста при вводе в инпут

input.addEventListener('input', function() {
    title.textContent = this.value;
});

// Кнопки для смены бэкграунда

const buttonIds = ['background-button-gradient', 'background-button-noise', 'background-button-none']
const backgroundButtons = buttonIds.map((id) => document.getElementById(id));
backgroundButtons.forEach(button => button.addEventListener('click', () => setBackground(button.id.split('-')[2])));

function setBackground(backgroundOption) {
  let newBackgroundImage = '';
  switch (backgroundOption) {
    case 'gradient':
      newBackgroundImage = "url('./img/background/gradient.jpg')";
      break;
    case 'noise':
      newBackgroundImage = "url('./img/background/noise.jpg')";
      break;
    case 'none':
    default:
      newBackgroundImage = 'none';
  }

  wrapperFb.style.backgroundImage = newBackgroundImage;
}

// Выбор рубрики

categoryLabel.src = "./img/label/novosti.jpg";

const categorySelect = new CustomSelect(categorySelectData);
categorySelect.create();
categorySelect.addEventListener(categorySelectData.eventName, function() {
  categoryLabel.src = `./img/label/${categorySelect.getValue()}.jpg`;
});

// Выгрузка в jpg

document.getElementById('download').addEventListener('click', function() {
    html2canvas(wrapperFb).then(canvas => {
      let link = document.createElement('a');
      link.href = canvas.toDataURL('image/jpg');
      link.download = 'sharing-1200.jpg';
      link.click();
    });
});

// Примеры заголовков для тестирования:
// Автоматизация работы с отзывами
// Инновации и индивидуальный подход: Олеся Иванова о будущих тенденциях в деловом туризме
// Как выпустить игру в Steam: полное руководство для бизнеса из России