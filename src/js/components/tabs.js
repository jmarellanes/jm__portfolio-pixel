function tabs() {
  const changeTabWithClick = (e) => {
    const button = e.target;
    const buttonParent = button.parentNode; // li element
    const isActive = 'is-active';

    const stopFunction =
      button.tagName.toLowerCase() !== 'button' ||
      buttonParent.classList.contains(isActive);
    if (stopFunction) return;

    const liElementActive = [...buttonParent.parentElement.children].find(
      (el) => el.classList.contains(isActive)
    );
    const [previousActiveButton] = liElementActive.children;

    const nextBtnAttr = button.getAttribute('aria-controls');
    const previousBtnAttr = previousActiveButton.getAttribute('aria-controls');
    const sectionToShow = document.querySelector(`section#${nextBtnAttr}`);
    const sectionToHide = document.querySelector(`section#${previousBtnAttr}`);

    // Nav Updates
    previousActiveButton.setAttribute('aria-selected', false);
    previousActiveButton.setAttribute('tabindex', '-1');
    button.setAttribute('aria-selected', true);
    button.setAttribute('tabindex', '0');

    liElementActive.classList.remove(isActive);
    buttonParent.classList.add(isActive);

    // Section Updates
    sectionToHide.classList.remove(isActive);
    sectionToShow.classList.add(isActive);
  };

  const navEl = document.querySelector('.nav-main__element');
  navEl.addEventListener('click', changeTabWithClick);
}

export { tabs };
