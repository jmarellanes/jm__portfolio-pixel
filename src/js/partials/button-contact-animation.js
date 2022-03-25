function buttonAnimation() {
  const buttonEl = document.querySelector('.a-link__link');

  const playAnimation = () => {
    // Preventing double click
    if (buttonEl.classList.contains('pressed')) return;

    buttonEl.classList.add('pressed');
    setTimeout(() => {
      buttonEl.classList.remove('pressed');
    }, 150);
  };

  buttonEl.addEventListener('click', playAnimation);
}

export { buttonAnimation };
