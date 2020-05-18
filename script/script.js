const btnOpenModal = document.getElementById('btnOpenModal'),
    modalBlock = document.getElementById('modalBlock'),
    modalWrap = document.querySelector('.modal'),
    closeModal = document.getElementById('closeModal'),
    questionTitle = document.getElementById('question'),
    formAnswers = document.getElementById('formAnswers'),
    burgerBtn = document.getElementById('burger'),
    prevBtn = document.getElementById('prev'),
    nextBtn = document.getElementById('next'),
    modalDialog = document.querySelector('.modal-dialog'),
    sendBtn = document.querySelector('#send'),
    modalTitle = document.querySelector('.modal-title');

// МАССИВ ДАННЫХ 
const questions = [
    {
        "question": "Какого цвета бургер?",
        "answers": [
            {
                "title": "Стандарт",
                "url": "./image/burger.png"
            },
            {
                "title": "Черный",
                "url": "./image/burgerBlack.png"
            }
        ],
        "type": "radio"
    },
    {
        "question": "Из какого мяса котлета?",
        "answers": [
            {
                "title": "Курица",
                "url": "./image/chickenMeat.png"
            },
            {
                "title": "Говядина",
                "url": "./image/beefMeat.png"
            },
            {
                "title": "Свинина",
                "url": "./image/porkMeat.png"
            }
        ],
        "type": "radio"
    },
    {
        "question": "Дополнительные ингредиенты?",
        "answers": [
            {
                "title": "Помидор",
                "url": "./image/tomato.png"
            },
            {
                "title": "Огурец",
                "url": "./image/cucumber.png"
            },
            {
                "title": "Салат",
                "url": "./image/salad.png"
            },
            {
                "title": "Лук",
                "url": "./image/onion.png"
            }
        ],
        "type": "checkbox"
    },
    {
        "question": "Добавить соус?",
        "answers": [
            {
                "title": "Чесночный",
                "url": "./image/sauce1.png"
            },
            {
                "title": "Томатный",
                "url": "./image/sauce2.png"
            },
            {
                "title": "Горчичный",
                "url": "./image/sauce3.png"
            }
        ],
        "type": "radio"
    }
]

// АНИМАЦИЯ
let count = -120

const animateModal = () => {
    modalDialog.style.top = count + '%'
    count += 3

    if (count < 0) {
        requestAnimationFrame(animateModal)
    } else {
        count = -120
    }
}

// УМЕНЬШЕНИЕ ОКНА
let clientWidth = document.documentElement.clientWidth;

if (clientWidth < 768) {
    burgerBtn.style.display = 'flex'
} else {
    burgerBtn.style.display = 'none'
}

window.addEventListener('resize', () => {
    clientWidth = document.documentElement.clientWidth

    if (clientWidth < 768) {
        burgerBtn.style.display = 'flex'
    } else {
        burgerBtn.style.display = 'none'
    }
})

burgerBtn.addEventListener('click', () => {
    burgerBtn.classList.add('active')
    modalBlock.classList.add('d-block')
    playTest()
})

// ЗАПУСК ТЕСТА
const playTest = () => {
    const finalAnswers = []
    const obj = {}

    let numberQuestion = 0
    modalTitle.textContent = 'Ответь на вопрос:'

    // Функция рендеринга ответов
    const renderAnswers = (index) => {
        questions[index].answers.forEach(answer => {
            const answerItem = document.createElement('div')
            answerItem.classList.add('answers-item', 'd-flex', 'justify-content-center')
            answerItem.innerHTML = `
                <input type="${questions[index].type}" id="${answer.title}" name="answer" class="d-none" value="${answer.title}">
                <label for="${answer.title}" class="d-flex flex-column justify-content-between">
                <img class="answerImg" src="${answer.url}" alt="${answer.title}">
                <span>${answer.title}</span>
                </label>
            `
            formAnswers.append(answerItem)

            // if (numberQuestion === 0) {
            //     prevBtn.style.display = 'none'
            // } else if (numberQuestion > 0) {
            //     prevBtn.style.display = 'block'
            // } if (numberQuestion === questions.length - 1) {
            //     nextBtn.style.display = 'none'
            // } else {
            //     nextBtn.style.display = 'block'
            // }
        })
    }
    // Функция рендеринга вопросов + ответов
    const renderQuestions = (indexQuestion) => {
        formAnswers.innerHTML = ''

        if (numberQuestion >= 0 && numberQuestion <= questions.length - 1) {
            questionTitle.textContent = `${questions[indexQuestion].question}`
            renderAnswers(indexQuestion)
            nextBtn.classList.remove('d-none')
            prevBtn.classList.remove('d-none')
            sendBtn.classList.add('d-none')
        }

        if (numberQuestion === 0) {
            prevBtn.classList.add('d-none')
        }

        if (numberQuestion === questions.length) {
            questionTitle.textContent = ''
            modalTitle.textContent = ''

            nextBtn.classList.add('d-none')
            prevBtn.classList.add('d-none')
            sendBtn.classList.remove('d-none')

            formAnswers.innerHTML = `
            <div class="form-group">
                <label for="numberPhone">Enter your phone number:</label>
                <input type="phone" class="form-control" id="numberPhone">
            </div>
            `
            const numberPhone = document.getElementById('numberPhone')

            numberPhone.addEventListener('input', event => {
                const target = event.target
                target.value = target.value.replace(/[^0-9+-]/, '')
            })
        }

        if (numberQuestion === questions.length + 1) {
            formAnswers.textContent = 'Спасибо за пройденный тест!'
            sendBtn.classList.add('d-none')

            for (let key in obj) {
                let newObj = {}
                newObj[key] = obj[key]
                finalAnswers.push(newObj)
            }

            setTimeout(() => {
                modalBlock.classList.remove('d-block')
            }, 3000)
        }
    }
    // Запуск функции рендеринга
    renderQuestions(numberQuestion)

    const checkAnswer = () => {
        const inputs = [...formAnswers.elements].filter(input => input.checked || input.id === 'numberPhone')

        inputs.forEach((input, index) => {
            if (numberQuestion >= 0 && numberQuestion <= questions.length - 1) {
                obj[`${index}_${questions[numberQuestion].question}`] = input.value
            }

            if (numberQuestion === questions.length) {
                obj['Номер телефона'] = input.value
            }
        })
    }

    // Обработчики событий кнопок next и prev
    nextBtn.onclick = () => {
        checkAnswer()
        numberQuestion++
        renderQuestions(numberQuestion)
    }

    prevBtn.onclick = () => {
        numberQuestion--
        renderQuestions(numberQuestion)
    }

    sendBtn.onclick = () => {
        checkAnswer()
        numberQuestion++
        renderQuestions(numberQuestion)
    }
}

// ОБРАБОТЧИКИ
btnOpenModal.addEventListener('click', () => {
    requestAnimationFrame(animateModal)
    // modalBlock.style.display = 'block'
    modalBlock.classList.add('d-block')
    playTest()
})

closeModal.addEventListener('click', () => {
    modalBlock.classList.remove('d-block')
    burgerBtn.classList.remove('active')
})

modalWrap.addEventListener('click', event => {
    const target = event.target
    if (!target.closest('.modal-dialog')) {
        modalBlock.classList.remove('d-block')
        burgerBtn.classList.remove('active')
    }
})





