let toDoList = [];
let currentListId;
let counterId = JSON.parse(localStorage.getItem('CounterId'));

//console.log('todoList', toDoList)

const saveLocalStorage = () => {
    localStorage.setItem('ToDOList', JSON.stringify(toDoList));
    localStorage.setItem('CounterId', JSON.stringify(counterId));
}

const delegation = e => {
    const {target} = e;

    const isCheckbox = target.className.includes("checkbox");
    const isRemoveTask = target.className.includes("remove_button");
    const isRemoveList = target.className.includes("remove_button_list");
    const isEditBtn = target.className.includes("edit_button");
    const isEditBtnList = target.className.includes("edit_button_list");

    if (isCheckbox) {
        checkBoxChange(target)
    }
    if (isRemoveList) {
        removeList(target)
    }
    if (isRemoveTask) {
        removeTask(target)
    }
    if (isEditBtnList) {
        editList(target)
    }
    if (isEditBtn) {
        editTask(target)
    }

}


//Drag and Drop
const dragAndDrop = () => {
    const cards = document.querySelectorAll(".task-js");
    const cells = document.querySelectorAll(".js-cell");
    let currentCard;
    let currentList;

    const dragStart = function () {
        setTimeout(() => {
            this.classList.add('dragHide');
        }, 0)
        currentCard = this;
    }

    const dragEnd = function () {
        this.classList.remove('dragHide');
    }

    const dragOver = function (e) {
        e.preventDefault();
    }

    const dragEnter = function (e) {
        e.preventDefault();
        currentList = this;
        this.classList.add('dragHovered');
    }

    const dragLeave = function () {
        this.classList.remove('dragHovered');
    }

    const dragDrop = function (e) {
        currentList.append(currentCard);
        this.classList.remove('dragHovered');
        const listId = +e.target.id;
        const taskId = +currentCard.id;
        const taskListId = +currentCard.getAttribute('list');
        const lists = toDoList.flatMap(list => list.tasks);
        const currentTask = lists.find(task => task.id === taskId);
        const index = toDoList[taskListId].tasks.findIndex(task => task.id === taskId);
        toDoList[listId].tasks.push(currentTask);
        toDoList[taskListId].tasks.splice(index, 1);
        saveLocalStorage();
    }


    cells.forEach(cell => {
        cell.addEventListener('dragover', dragOver);
        cell.addEventListener('dragenter', dragEnter);
        cell.addEventListener('dragleave', dragLeave);
        cell.addEventListener('drop', dragDrop);
    })

    cards.forEach(card => {
        card.addEventListener('dragstart', dragStart);
        card.addEventListener('dragend', dragEnd);
    })
}
dragAndDrop();

const removeTask = elem => {
    const listId = +elem.closest(".todo").id;
    const taskId = +elem.closest(".task").id;
    const index = toDoList[listId].tasks.findIndex(task => task.id === taskId);
    toDoList[listId].tasks.splice(index, 1);

    outList();
    saveLocalStorage();
}

const checkBoxChange = elem => {
    const listId = +elem.closest(".todo").id;
    const taskId = +elem.closest(".task").id;
    const currentTask = toDoList[listId].tasks.find((task) => task.id === taskId);
    elem.checked ? (currentTask.isActive = true) : (currentTask.isActive = false);
    outList();
    saveLocalStorage();
}

const editTask = elem => {
    const parentLi = elem.closest(".task");
    const listId = +elem.closest(".todo").id;
    const taskId = +elem.closest(".task").id;
    const currentTask = toDoList[listId].tasks.find(task => task.id === taskId);

    parentLi.innerHTML = `
         <form class="formTask">
            <input type="text" placeholder="Title" class="newTitle" value="${currentTask.title}" />
            <input type="text" placeholder="Message" class="newMessage" value="${currentTask.message}" />
            <input type="submit" class="editBtn" value="Edit" />
          </form>`;

    let newTitle = document.querySelector('.newTitle');
    let newMessage = document.querySelector('.newMessage');
    let editBtn = document.querySelector('.editBtn');

    let newTitleValue = e => title = e;

    newTitle.addEventListener("input", e => {
        newTitleValue(e.target.value);
        currentTask.title = title;
    })

    let newMessageValue = e => message = e;

    newMessage.addEventListener("input", e => {
        newMessageValue(e.target.value)
        currentTask.message = message;
    })

    let btnSubmit = () => {
        saveLocalStorage();
    }
    editBtn.addEventListener('click', btnSubmit)
}

const editList = elem => {
    const listId = +elem.closest(".todo").id;
    let title = toDoList[listId].titleList;

    elem.parentNode.innerHTML =
        `<form class="formTask">
            <input type="text" placeholder="Title" class="newTitle" value="${title}" />
            <input type="submit" class="editBtn" value="Edit" />
          </form>`;

    let newTitle = document.querySelector('.newTitle');
    let editBtn = document.querySelector('.editBtn');

    let newTitleValue = e => title = e;
    newTitle.addEventListener("input", e => {
        newTitleValue(e.target.value);
        toDoList[listId].titleList = title;
    })

    let btnSubmit = () => {
        saveLocalStorage();
    }
    editBtn.addEventListener('click', btnSubmit)
}

const removeList = elem => {
    const listId = +elem.closest(".todo").id;

    delete toDoList[listId];

    saveLocalStorage();
    outList();
}

//modal
const openModal = () => {
    modal.style.display = "flex";
}

const handleModalClickOutside = e => {
    const modal = document.querySelector(".modal_overlay");
    const {
        target,
        currentTarget
    } = e;
    if (target === currentTarget) modal.style.display = "none";
}

const hideModal = () => {
    modal.style.display = "none";
}

const checkValidation = () => {
    const title = document.getElementById("title");
    const message = document.getElementById("message");

    return title.value && message.value;
}

const handleCreateClick = () => {
    const isValid = checkValidation();
    if (!isValid) return;
    addTask();
    hideModal();
}

//NewList&Task
const addList = () => {
    let idList = toDoList.length;
    toDoList.push({
        id: idList,
        titleList: "list",
        tasks: [],
    })

    dragAndDrop();
    outList();
    saveLocalStorage();
}

const addTask = () => {
    const title = document.getElementById("title");
    const message = document.getElementById("message");

    toDoList[currentListId].tasks.push({
        id: counterId++,
        title: title.value,
        message: message.value,
        isActive: false
    });

    saveLocalStorage();

    title.value = "";
    message.value = "";
    outList();
    dragAndDrop();
}

const isExistToDoList = !!localStorage.getItem('ToDOList');
if (isExistToDoList) {
    toDoList = JSON.parse(localStorage.getItem('ToDOList'));
}

const randerTask = (arr) => {
    let div = '';
    arr.forEach(elem=>{
        str += `<div>${elem.message}</div>`
    });
    return str
};
const outTasks = (id, arr) => {
    let div = document.createElement('div');
        let outTasks = document.querySelector(".list");

        arr.forEach(tasks => {
            let check,
                taskClass;
            if (tasks.isActive === true) {
                check = "checked"
            };
            tasks.isActive === true ? taskClass = "task_done" : taskClass = "task";
            const newTask = `
                <div class="task_checkbox">
      <input class="checkbox" type="checkbox" ${check}/>
    </div>
                <div class="task_text">
      <h2 class="task_title">${tasks.title}</h2>
      <p class="task_message">${tasks.message}</p>
    </div>
                <div class="task-task_edit">
      <button class="edit_button" type ="button" >
        <ion-icon name="create-outline" />
      </button>
      <button class="remove_button" type="button" >
          <ion-icon name="trash-outline" />
      </button>
    </div>`;

            let li = document.createElement("li");
            li.classList.add(`task`, taskClass, 'task-js');
            li.innerHTML = newTask;
            li.setAttribute('draggable', true);
            li.setAttribute("id", tasks.id);
            li.setAttribute("list", id);

            div.appendChild(li);

            // const addButton = newList.querySelectorAll('.add_button');
            // addButton.forEach((btn) => {
            //     btn.addEventListener('click', () => {
            //         currentListId = lists.id;
            //         openModal();
            //     });
            // });
        })
    dragAndDrop();
return div;


}

const outLists = () => {
    const addList = document.querySelector('.container_todo');
    addList.innerHTML = '';
    toDoList.forEach(lists => {
        let newList = document.createElement("div");
        newList.classList.add("todo", "js-cell");
        newList.setAttribute("id", lists.id);
        newList.innerHTML = `
    <header class="header">
        <div class="headerList">
          <h1 class="header_title list_items">${lists.titleList}</h1> 
          <button class="edit_button_list list_items" type ="button" >
            <ion-icon name="create-outline" />
          </button>
         </div>
          <div class="bthsList">
             <button class="add_button btn_itmes" type="button">
                 <ion-icon name="add-outline" class="add_icon"></ion-icon>
             </button> 
              <button class="remove_button_list btn_itmes" type="button" >
                 <ion-icon name="trash-outline" / >
              </button> 
          </div>
    </button>
    </header> 
    <div class="body">
       <ul class="list js-cell"></ul>
    </div>`;
        const tasks = outTasks(lists.id, lists.tasks);
        let wrap =  newList.querySelector('.list');
        wrap.append(tasks);

        //add
        addList.appendChild(newList);
    })

}
outLists();


const
    target = document.querySelector('.container_todo')
createButton = document.querySelector('.modal_button')
modal = document.querySelector('.modal_overlay')
btnList = document.querySelector('.btnList');

target.addEventListener('click', delegation);
createButton.addEventListener('click', handleCreateClick);
modal.addEventListener('click', handleModalClickOutside);
btnList.addEventListener('click', addList);



