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
let draggedFrom = null; //Column index, item is dragged from

function addItem(columnIndex) {
    const itemText = prompt("Enter new item")
    if(itemText !== "") {
        const el = document.createElement("div")
        el.textContent = itemText
        el.className = "item"
        el.draggable = true
        containers[columnIndex].appendChild(el)
        addItemHanldlers(el);

    }
    saveBoard();
}

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
      el.addEventListener('dblclick', (e) => {
        const newText = prompt("Enter updated item text. Empty string to delete");
        if(newText === "") {
            el.remove();   
        }
        else {
          el.textContent = newText;
        }
        saveBoard();
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
