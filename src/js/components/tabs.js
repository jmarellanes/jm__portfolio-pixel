function tabs() {
  const isActive = 'is-active';

  const updateAttributes = (el, boolean, number) => {
    el.firstElementChild.setAttribute('aria-selected', boolean);
    el.firstElementChild.setAttribute('tabindex', number);
  };

  const changeActiveButton = (i, array) => {
    array.forEach((element, index) => {
      index === i
        ? updateAttributes(element, true, 0)
        : updateAttributes(element, false, -1);
    });
  };

  const changeActiveSection = (i, nodeList) => {
    nodeList.forEach((element, index) => {
      index === i
        ? element.classList.add(isActive)
        : element.classList.remove(isActive);
    });
  };

  const handleClick = (e) => {
    const buttonTarget = e.target;
    const buttonTargetParent = buttonTarget.parentNode; // li element
    const sectionList = document.querySelectorAll('.home__content > section');

    const stopFunction =
      buttonTarget.tagName.toLowerCase() !== 'button' ||
      buttonTarget.getAttribute('aria-selected') === 'true';
    if (stopFunction) return;

    const liArray = Array.from(buttonTargetParent.parentElement.children);
    const liTargetIndex = liArray.indexOf(buttonTargetParent);

    changeActiveButton(liTargetIndex, liArray);
    changeActiveSection(liTargetIndex, sectionList);
  };

  const navEl = document.querySelector('.nav-main__element');
  navEl.addEventListener('click', handleClick);
}

export { tabs };
