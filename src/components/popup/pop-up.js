const openPopUp = document.querySelector('.btn');
const closePopUp = document.querySelector('.close');
const PopUp = document.querySelector('.modal');
const PopUpWrap = document.querySelector('.modal__wrap');
const PopUpBody = document.querySelector('.modal__body');

function toglePopup() {
  PopUp.classList.toggle('active');
  PopUpBody.classList.toggle('active');
}
function closePopup() {
  PopUp.classList.remove('active');
  PopUpBody.classList.remove('active');
}
openPopUp.addEventListener('click', toglePopup);
closePopUp.addEventListener('click', toglePopup);
PopUpWrap.addEventListener('click', closePopup);
PopUpBody.addEventListener('click', function (e) {
  e.stopPropagation();
});
