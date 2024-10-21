import { loginUser } from "../../api";
console.log('Authentication script loaded');


document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const specialtySelect = document.getElementById('specialty');
    const registrationForm = document.getElementById('registrationForm');
    
    loginForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Предотвращаем стандартную отправку формы
        console.log('Form submitted');
    
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
    
        // Вызов функции для отправки данных на сервер
        loginUser(email, password)
            .then(response => {
                // Обрабатываем успешный вход
                console.log('Успешный вход:', response);
                window.location.href = '/dashboard'; // Пример перенаправления
            })
            .catch(error => {
                // Обрабатываем ошибку
                console.error('Ошибка входа:', error);
            });
    });

    getSpecialties()
        .then(data => {
            data.specialties.forEach(specialty => {
                const option = document.createElement('option');
                option.value = specialty.id;
                option.textContent = specialty.name;
                specialtySelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Ошибка при загрузке специализаций:', error);
        });


    
    registrationForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // Логика для отправки формы регистрации
        // Можно вызвать другую функцию из api.js, если нужно
    });


    
});


