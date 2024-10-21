import { loadSpecialties, registerUser } from "../api.js";
import AbstractView from "./AbstractView.js";
import { updateAuthButton } from "../script.js";

export default class extends AbstractView {
    async getHtml() {
        return `
                <div class="register-box" id="register-box">
                    <h1>Регистрация</h1>
                    <form id="registerForm">
                        <div class="input-group">
                            <label for="name">Имя</label>
                            <input type="text" id="name" placeholder="Иван Иванов" required>
                        </div>
                        <div class="input-group small">
                            <label for="gender">Пол</label>
                            <select id="gender">
                                <option value="Мужской">Мужской</option>
                                <option value="Женский">Женский</option>
                            </select>
                        </div>
                        <div class="input-group small">
                            <label for="dob">Дата рождения</label>
                            <input type="date" id="dob" required>
                        </div>
                        <div class="input-group">
                            <label for="phone">Телефон</label>
                            <input type="tel" id="phone" placeholder="+7 (999) 999-99-99" required>
                        </div>
                        <div class="input-group">
                            <label for="specialization">Специальность</label>
                            <select id="specialization">
                            </select>
                        </div>
                        <div class="input-group">
                            <label for="email-register">Email</label>
                            <input type="email" id="email" placeholder="name@example.com" required>
                        </div>
                        <div class="input-group">
                            <label for="password-register">Пароль</label>
                            <input type="password" id="password" required autocomplete="new-password"
>
                        </div>
                        <button type="submit" class="btn btn-secondary">Зарегистрироваться</button>
                    </form>
                    <div id="registerMessage"></div>
                    <script src="authentification.js"></script>
                    <script src="api.js"></script>
                </div>
                `;
    }

    async executeViewScript() {
        console.log("RegisterView script executed.");
        const specialtySelect = document.getElementById('specialization');
        const form = document.getElementById('registerForm');
        const registerMessage = document.getElementById('registerMessage');

        try {
            const specialties = await loadSpecialties();

            specialties.forEach(specialty => {
                const option = document.createElement('option');
                option.value = specialty.id; // Присваиваем id в качестве значения
                option.textContent = specialty.name; // Отображаем имя специализации
                specialtySelect.appendChild(option); // Добавляем опцию в выпадающий список
            });
        } catch (error) {
            console.error('Ошибка:', error);
        }

        form.addEventListener('submit', async function (e) {
            e.preventDefault();
            const dob = new Date(form.dob.value).toISOString();
            const phone = form.phone.value;
            const phoneRegex = /^\+7\d{10}$/;

            if (!phoneRegex.test(phone)) {
                registerMessage.textContent = 'Неправильный формат номера телефона. Пожалуйста, используйте формат +7XXXXXXXXXX.';
                registerMessage.style.color = 'red';
                return;
            }
            try {
                const result = await registerUser(
                    form.name.value,
                    form.password.value,
                    form.email.value,
                    dob,
                    form.gender.value === "Мужской" ? "Male" : "Female",
                    form.phone.value,
                    form.specialization.value
                )

                if (result.status === 200) {
                    registerMessage.textContent = "Success";
                    registerMessage.style.color = 'green';
                    localStorage.setItem('token', result.data.token);
                    await updateAuthButton(result.data.token);
                } else {
                    console.log(result.status);
                    const errors = result.data.errors;
                    const errorMessages = Object.keys(errors).map(key => {
                        return `${key}: ${errors[key].join(', ')}`;
                    }).join('\n');
    
    
                    registerMessage.textContent = errorMessages
                    registerMessage.style.color = 'red'; 
                }

            } catch (error) {
                console.error('Ошибка:', error);
                registerMessage.textContent = "Произошла ошибка при регистрации.";
                registerMessage.style.color = 'red';
            }
            

            
        })
    }
}