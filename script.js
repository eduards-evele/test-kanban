const containers = document.querySelectorAll('.container');

reloadTheme();
loadData();

//Load saved board from localStorage
function loadData() {
  for (let i = 0; i < 4; i++) {
    const storedItems = JSON.parse(localStorage.getItem(`column_${i}`)) || [];
    storedItems.forEach(itemText => {
      const el = document.createElement("div");
      el.textContent = itemText;
      el.className = "item";
      el.draggable = true;
      containers[i].appendChild(el);
      addItemHanldlers(el);
    });
  }
}

//Apply saved theme
function reloadTheme() {
    const rootStyle = document.querySelector(':root');
    const theme = localStorage.getItem("theme");
    if(theme === "light" || theme !== "dark") {
        localStorage.setItem("theme", "light");
        rootStyle.style.setProperty('--theme_bg', 'azure');
        rootStyle.style.setProperty('--theme_fg', 'darkslategray');
    }
    else if(theme === "dark") {
        localStorage.setItem("theme", "dark");
        rootStyle.style.setProperty('--theme_bg', 'darkslategray');
        rootStyle.style.setProperty('--theme_fg', 'azure');

    }
    containers.forEach(container => {
        container.parentElement.style.backgroundColor = ""; 
    });
}

//Switch theme
function switchTheme() {
    const currentTheme = localStorage.getItem("theme");

        if (currentTheme === "light") {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }
    
    reloadTheme();
}
let draggedItem = null;

//Save board items arrangement to localStorage
function saveBoard() {
  containers.forEach((container, index) => {
    const items = [];
    Array.from(container.children).forEach(child => {
      const text = child.textContent.trim();
      if (text) {
        items.push(text);
      }
    });
    localStorage.setItem(`column_${index}`, JSON.stringify(items));
  });
}

//Add event handlers for items
function addItemHanldlers(el) {
  el.addEventListener('dragstart', (e) => {
    draggedItem = el;
    e.dataTransfer.setData('text/plain', '');
    setTimeout(() => {
      el.style.display = 'none';
    }, 0);
  });

  el.addEventListener('dragend', () => {
    draggedItem.style.display = 'block';
    draggedItem = null;
  });

  el.addEventListener('click', (e) => {
    // Prevent editing if already editing
    if (el.classList.contains('editing')) return;
    el.classList.add('editing');
    
    //Add input field to edit item and deletion button
    const editItem = document.createElement('input');
    const deleteItem = document.createElement('div');

    deleteItem.className = 'deleteItem';
    deleteItem.textContent = "Delete";

    const currentText = el.textContent;
    el.innerHTML = '';
    editItem.type = 'text';
    editItem.value = currentText;
    editItem.focus();
    el.appendChild(editItem);
    el.appendChild(deleteItem);

    

    el.style.setProperty('padding', '0');
    el.style.setProperty('border', '0');
    let handled = false;
    const addHandler = () => {
      handled = !handled;
      const newText = editItem.value.trim();
      if (newText !== "") {
        el.textContent = newText;
      } else {
        el.remove();
      }
      saveBoard();
      el.classList.remove('editing');
      el.style.removeProperty('padding');
      el.style.removeProperty('border');
    };

    editItem.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addHandler();
      }
    });

    editItem.addEventListener("focusout", () => {
      addHandler();
    });

    deleteItem.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      el.remove();
      saveBoard();
    });
  });
}

//Add event handlers for columnns
containers.forEach(container => {
  container.addEventListener('dragenter', (e) => {
    const theme = localStorage.getItem("theme");
    //Highlight column
    if(theme === "dark") {
      container.parentElement.style.setProperty('background-color', 'teal');
    }
    else {
      container.parentElement.style.setProperty('background-color', 'lightyellow');     
    }
  });

  container.addEventListener('dragleave', () => {
    //Remove highlighting
    const theme = localStorage.getItem("theme");

    if(theme === "dark") {
      container.parentElement.style.setProperty('background-color', 'darkslategray');
    }
    else {
      container.parentElement.style.setProperty('background-color', 'azure');    
    }
  });

  container.addEventListener('drop', () => {
      //Remove highlighting
      const theme = localStorage.getItem("theme");

      if(theme === "dark") {
        container.parentElement.style.setProperty('background-color', 'darkslategray');
      }
      else {
        container.parentElement.style.setProperty('background-color', 'azure');    
      }

      if (draggedItem) {
        container.appendChild(draggedItem);
        saveBoard();
      }
  });

  container.addEventListener('dragover', (e) => {
    e.preventDefault();
  });
});


//Add new item to board
document.querySelectorAll('.addItem').forEach(addButton => {
  addButton.addEventListener("click", (e) => {
    addButton.style.setProperty('padding', '0');
    addButton.style.setProperty('border', '0');
    addButton.className = ".newItemInput"
    const column = Number(addButton.id.split('_')[1]);
    addButton.innerHTML = "";
    const inputItem = document.createElement("input");
    inputItem.type = "text";

    addButton.appendChild(inputItem);
    inputItem.focus();
    let handled = false;
    const addHandler = () => {
       if (handled) return;
      handled = true;
      const newText = inputItem.value.trim();
      if (newText !== "") {
        const newItem = document.createElement('div');
        newItem.className = 'item';
        newItem.draggable = true
        newItem.textContent = newText;
        addItemHanldlers(newItem);
        containers[column-1].appendChild(newItem);
      }
      saveBoard();
      //el.classList.remove('editing');
      addButton.style.removeProperty('padding');
      addButton.style.removeProperty('border');
      addButton.textContent = 'Add task';
      addButton.className = 'addItem';
    };

    inputItem.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addHandler();
      }
    });

    inputItem.addEventListener("focusout", () => {
      addHandler();
    });
  });
});