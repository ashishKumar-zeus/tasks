
function toggleClassName(itemCalled, classToToggle) {
    const item = document.querySelector(`.${itemCalled}`);
    item.classList.toggle(classToToggle);
}