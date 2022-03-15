function tabs() {
  const isActive = 'is-active';
  const sectionList = document.querySelectorAll('.home__content > section');

  const changeActiveButton = (i, array) => {
    function updateAttributes(el, isSelected, value) {
      el.firstElementChild.setAttribute('aria-selected', isSelected);
      el.firstElementChild.setAttribute('tabindex', value);
    }

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

    // prettier-ignore
    let keyPressed = e.key === UP_ARROW || e.key === DOWN_ARROW || e.key === LEFT_ARROW || e.key === RIGHT_ARROW;

    const liActive = document.activeElement.parentNode;
    if (!keyPressed || !liActive.classList.contains('tabs__nav-item')) return;

    const liArray = Array.from(liActive.parentNode.children);
    const firstElement = liArray[0].firstElementChild;
    const lastElement = liArray[liArray.length - 1].firstElementChild;
    const liTargetIndex = liArray.indexOf(liActive);

    function updateElements(index, array = liArray, nodeList = sectionList) {
      changeActiveButton(index, array);
      changeActiveSection(index, nodeList);
      array[index].firstElementChild.focus();
    }

    switch (e.key) {
      case RIGHT_ARROW:
      case DOWN_ARROW:
        document.activeElement === lastElement
          ? updateElements(0)
          : updateElements(liTargetIndex + 1);

        break;

      case LEFT_ARROW:
      case UP_ARROW:
        document.activeElement === firstElement
          ? updateElements(liArray.length - 1)
          : updateElements(liTargetIndex - 1);

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
