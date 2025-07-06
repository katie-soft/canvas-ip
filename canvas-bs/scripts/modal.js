// Инструкция
const modal = document.getElementById("howToPlayModal");
const btn = document.getElementById("howToPlay");
const span = document.getElementById("closeModal");

btn.onclick = function () {
  modal.style.display = "block";
};
span.onclick = function () {
  modal.style.display = "none";
};
window.onclick = function (event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

// Для каждого шага
export const stepModal = document.getElementById("stepInfoModal");
export const stepModalContent = document.getElementById("stepInfoContent");
const stepModalClose = document.getElementById("closeStepModal");

stepModalClose.onclick = function () {
  stepModal.style.display = "none";
};

window.addEventListener('click', function (event) {
  if (event.target === stepModal) {
    stepModal.style.display = "none";
  }
});
