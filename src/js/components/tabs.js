function tabs() {
  const isActive = 'is-active';
  const sectionList = document.querySelectorAll('.home__content > section');

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

    const stopFunction =
      buttonTarget.tagName.toLowerCase() !== 'button' ||
      buttonTarget.getAttribute('aria-selected') === 'true';
    if (stopFunction) return;

    const liArray = Array.from(buttonTargetParent.parentElement.children);
    const liTargetIndex = liArray.indexOf(buttonTargetParent);

    changeActiveButton(liTargetIndex, liArray);
    changeActiveSection(liTargetIndex, sectionList);
  };

  const handleKeyDown = (e) => {
    let UP_ARROW = 'ArrowUp',
      DOWN_ARROW = 'ArrowDown',
      LEFT_ARROW = 'ArrowLeft',
      RIGHT_ARROW = 'ArrowRight';

    const itemActive = document.activeElement.parentNode;
    const tabEl = Array.from(itemActive.parentNode.children);
    const firstTabEl = tabEl[0].firstElementChild;
    const lastTabEl = tabEl[tabEl.length - 1].firstElementChild;
    const liTargetIndex = tabEl.indexOf(itemActive);

    switch (e.key) {
      case RIGHT_ARROW:
      case DOWN_ARROW:
        if (document.activeElement === lastTabEl) {
          changeActiveButton(0, tabEl);
          changeActiveSection(0, sectionList);
          tabEl[0].firstElementChild.focus();
        } else {
          changeActiveButton(liTargetIndex + 1, tabEl);
          changeActiveSection(liTargetIndex + 1, sectionList);
          tabEl[liTargetIndex + 1].firstElementChild.focus();
        }
        break;

      case LEFT_ARROW:
      case UP_ARROW:
        if (document.activeElement === firstTabEl) {
          changeActiveButton(tabEl.length - 1, tabEl);
          changeActiveSection(tabEl.length - 1, sectionList);
          tabEl[tabEl.length - 1].firstElementChild.focus();
        } else {
          changeActiveButton(liTargetIndex - 1, tabEl);
          changeActiveSection(liTargetIndex - 1, sectionList);
          tabEl[liTargetIndex - 1].firstElementChild.focus();
        }
        break;

      default:
        break;
    }
  };

  const navEl = document.querySelector('.nav-main__element');
  navEl.addEventListener('click', handleClick);
  document.addEventListener('keydown', handleKeyDown);
}

export { tabs };
