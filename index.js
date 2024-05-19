window.addEventListener('DOMContentLoaded', () => {
    const select = document.querySelector('#select');
    const todoList = document.querySelector('.todo-list');
    const postList = document.querySelector('.post-list');

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
      //Posts

      // Создаем запрос на сервер, преобразуем json - ответ в объект JS. Создаем условие, в котором очищаем стр от содержимого
      // в цикле вызываем функцию по созданию карточки и добавляем в конец списка.
    const createPostList = async () => {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/posts');
            const posts = await response.json();

            if (posts) {
                clearTodoFiledChildren(postList);
                posts.forEach((post) => {
                const card = createCard(post.title, post.body);
                postList.appendChild(card);
            })
        }
        } catch (e) {
            console.log(e);
        }
    }

    createPostList();
    
  //Create post start
    const postForm = document.querySelector('#create-post-form');
    const submitBtn = document.querySelector('.create-post-form-button');

    postForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(postForm);

        try {
            submitBtn.disabled = true;
            const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            console.log(data);

            if (response.ok) {
                const successfulShipment = document.createElement('div');
                successfulShipment.innerText = 'Sent!';
                postForm.appendChild(successfulShipment);
                setTimeout(() => {
                    postForm.removeChild(successfulShipment);
                }, 1500)
            }
        } catch (error) {
            console.log(error)
        } finally {
            submitBtn.disabled = false;
        }
    })
    //CREATE POST END

    //CREATE POST JSON start
    const jsonForm = document.querySelector('.json-tab-pane');
    const jsonBtn = document.querySelector('.json-post-form-button');
    const createPostContainer = document.querySelector('.create-post');
    jsonForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(jsonForm);
        const formDataObject = {};

        formData.forEach((value, key) => {
            formDataObject[key] = value;
        })

        try {
            jsonBtn.disabled = true;
            const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify(formDataObject)
            });

            const data = await response.json();
            console.log(data);

            if (response.ok) {
                const card = createCard(data.title, data.body);
                createPostContainer.appendChild(card);

                const successfulShipment = document.createElement('div');
                successfulShipment.innerText = 'Ваш созданный пост';

                createPostContainer.appendChild(successfulShipment);
            }
        } catch (error) {
            console.log(error);
        } finally {
            jsonBtn.disabled = false;
        }
    })
})
