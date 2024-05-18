window.addEventListener('DOMContentLoaded', () => {
    const select = document.querySelector('#select');
    const todoList = document.querySelector('.todo-list');

     // Создаем карточку/
    const createCard = (title, text) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.classList.add('card-body');

        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = title;

        const cardText = document.createElement('p');
        cardText.classList.add('card-text');
        cardText.textContent = text;

        card.appendChild(cardTitle);
        card.appendChild(cardText);

        return card
        }

    // Добавляем информацию о загрузке
    const createLoadingNotification = (node) => {
        node.innerHTML = 'Loading...';
    }

    // Очищаем контейнер
    const clearTodoFiledChildren = (node) => {
        node.innerHTML = '';
        }

    // Добавляем чек о завершении
    const createCheckNode = () => {
        const check = document.createElement('div');
        check.classList.add('check');
        const img = document.createElement('img');
        img.src = './checkmark-circle.svg';
        check.appendChild(img);

        return check;
    }

    // Создаем список задач

    const createTodosList = async (limit = 10) => {
        /*Если успех,то очищаем контейнер,показываем пользователю инфу о загрузке
    с помощью цикла создаем карточку используя данные, которые пришли с сервера,
    если свойство completed ' true' - добавляем чек.
    добавляем карточку в конец списка
    иначе выводим ошибку в консоль*/

        try {
            createLoadingNotification(todoList);
    // Создаем запрос на сервер
            const response = await fetch(`https://jsonplaceholder.typicode.com/todos?_limit=${limit}`);
    // Формат json
            const todos = await response.json();

            if (todos) {
                clearTodoFiledChildren(todoList);

                todos.forEach((todo) => {
                    const card  = createCard(`Пользователь ${todo.userId}`, todo.title);

                    if (todo.completed) {
                        const checkNode = createCheckNode();
                        card.appendChild(checkNode);
                        card.classList.add('done')
                    }
                    todoList.appendChild(card);
                })
            }
        } catch (e) {
            console.log(e)
        }
    }

    createTodosList();

    // Добавляем слушатель на селект, получаем значение из него, очищаем контейнер, создаем карточку

    select.addEventListener('change', (e) => {
        const value = e.target.value;
        clearTodoFiledChildren(todoList);
        createTodosList(value);
    });

    //Create post

    })