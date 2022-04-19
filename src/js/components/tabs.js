function tabs() {
  const isActive = 'is-active';
  const isFading = 'is-fading';
  const sectionList = document.querySelectorAll('.home__content > section');
  const buttonsMenuList = Array.from(
    document.querySelectorAll('button.nav-main__button')
  );

  const changeActiveButton = (targetIndex, array = buttonsMenuList) => {
    function updateAttributes(element, isSelected, value) {
      element.setAttribute('aria-selected', isSelected);
      element.setAttribute('tabindex', value);
      isSelected === true
        ? element.classList.add('is-active')
        : element.classList.remove('is-active');
    }

    array.forEach((element, index) => {
      index === targetIndex
        ? updateAttributes(element, true, 0)
        : updateAttributes(element, false, -1);
    });
  };

  const changeActiveSection = (
    targetIndex,
    prevActiveIndex,
    nodeList = sectionList
  ) => {
    nodeList.forEach((element, index) => {
      if (index === targetIndex) {
        element.classList.remove(isFading);
        setTimeout(() => {
          element.classList.add(isActive);
          element.removeAttribute('aria-hidden');
        }, 250);
      } else if (index === prevActiveIndex) {
        element.classList.add(isFading);
        element.classList.remove(isActive);
        element.setAttribute('aria-hidden', true);
      } else {
        element.classList.remove(isActive, isFading);
        element.setAttribute('aria-hidden', true);
      }
    });
  };

  const handleClick = (e) => {
    const buttonTarget = e.target;

    const stopEvent =
      buttonTarget.tagName.toLowerCase() !== 'button' ||
      buttonTarget.getAttribute('aria-selected') === 'true';
    if (stopEvent) return;

    const elPrevActive = buttonsMenuList.find(
      (button) => button.getAttribute('aria-selected') === 'true'
    );

    const elPrevActiveIndex = buttonsMenuList.indexOf(elPrevActive);
    const elTargetIndex = buttonsMenuList.indexOf(buttonTarget);

    changeActiveButton(elTargetIndex);
    setTimeout(() => {
      changeActiveSection(elTargetIndex, elPrevActiveIndex);
    }, 200);
  };

  const handleKeyDown = (e) => {
    let UP_ARROW = 'ArrowUp',
      DOWN_ARROW = 'ArrowDown',
      LEFT_ARROW = 'ArrowLeft',
      RIGHT_ARROW = 'ArrowRight';

    // prettier-ignore
    let keyPressed = e.key === UP_ARROW || e.key === DOWN_ARROW || e.key === LEFT_ARROW || e.key === RIGHT_ARROW;

    const activeElement = document.activeElement;
    if (!keyPressed || activeElement.tagName.toLocaleLowerCase() !== 'button') {
      return;
    }

    const firstElement = buttonsMenuList[0];
    const lastElement = buttonsMenuList[buttonsMenuList.length - 1];
    const elTargetIndex = buttonsMenuList.indexOf(activeElement);

    function updateElements(index, array = buttonsMenuList) {
      changeActiveButton(index, array);
      setTimeout(() => {
        changeActiveSection(index, elTargetIndex);
      }, 200);
      array[index].focus();
    }

    switch (e.key) {
      case RIGHT_ARROW:
      case DOWN_ARROW:
        document.activeElement === lastElement
          ? updateElements(0)
          : updateElements(elTargetIndex + 1);
        break;

      case LEFT_ARROW:
      case UP_ARROW:
        document.activeElement === firstElement
          ? updateElements(buttonsMenuList.length - 1)
          : updateElements(elTargetIndex - 1);
        break;

      default:
        break;
    }
  };

  const navEl = document.querySelector('.nav-main__container');
  navEl.addEventListener('click', handleClick);
  document.addEventListener('keydown', handleKeyDown);
}

export { tabs };
