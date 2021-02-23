// Topics: Custom Events, Event Delegation, local storage
// ... DOM Events, Object Reference

// listen for when someones types in input field and hits submit
// keep track of shopping list items and if complete
// render list of items

const shoppingForm = document.querySelector('.shopping');
const list = document.querySelector('.list');

// we need an array to hold our state
let items = [];

// listen for submit event on the form
function handleSubmit(e) {
  e.preventDefault();
  const name = e.currentTarget.item.value;
  // if it's empty don't submit it
  if (!name) return;
  const item = {
    name,
    id: Date.now(),
    complete: false,
  };
  // Push the items into our state
  items.push(item);
  console.log(`There are now ${items.length} in your state`);
  // clear the form
  //   e.currentTarget.item.value = '';
  e.currentTarget.reset();
  // custom events
  // fire off a custom event that will tell anyone else who cares that the items have been updated
  list.dispatchEvent(new CustomEvent('itemsUpdated'));
}

// display the items in the list
function displayItems() {
  console.log(items);
  const html = items
    .map(
      (item) => `
        <li class="shopping-item">
        <input 
        value="${item.id}" 
        type ="checkbox"
        ${item.complete ? 'checked' : ''}
        >
        <span class="itemName">${item.name}</span>
        <button
        aria-label="Remove ${item.name}"
        value="${item.id}"
      >&times;</buttonaria-label="Remove>
        
        </li>`
    )
    .join('');
  list.innerHTML = html;
}

function mirrorToLocalStorage() {
  console.info('Saving items to local storage');
  localStorage.setItem('items', JSON.stringify(items));
}

// when you load the page restore info from local storage
function restoreFromLocalStorage() {
  console.info('Restoring from local storage');
  // pull the items from local storage
  const lsItems = JSON.parse(localStorage.getItem('items'));
  if (lsItems.length) {
    // different ways of doing the same thing
    // items = lsItems;
    // lsItems.forEach((item) => items.push(item));
    items.push(...lsItems);
    list.dispatchEvent(new CustomEvent('itemsUpdated'));
  }
}

function deleteItem(id) {
  console.log('Deleting Item', id);
  // update our items array without this one
  items = items.filter((item) => item.id !== id);
  console.log(items);
  list.dispatchEvent(new CustomEvent('itemsUpdated'));
}

function markAsComplete(id) {
  console.log('marking as complete', id);
  // find the item we want
  const itemRef = items.find((item) => item.id === id);
  itemRef.complete = !itemRef.complete;
  list.dispatchEvent(new CustomEvent('itemsUpdated'));
}

shoppingForm.addEventListener('submit', handleSubmit);
list.addEventListener('itemsUpdated', displayItems);
list.addEventListener('itemsUpdated', mirrorToLocalStorage);
// event delegation: We listen for the click on the list ul but then delegate the click over to the button if that is what was clicked
list.addEventListener('click', (e) => {
  const id = parseInt(e.target.value);
  if (e.target.matches('button')) {
    deleteItem(id);
  }
  if (e.target.matches('input[type="checkbox"]')) {
    markAsComplete(id);
  }
});

restoreFromLocalStorage();
