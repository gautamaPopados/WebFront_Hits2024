import { getCurrentUser , updateUser  } from "../api.js"; // Импортируем необходимые функции
import AbstractView from "./AbstractView.js";
import { updateAuthButton } from "../script.js";

export default class extends AbstractView {
    async getHtml() {
        return `
            <div class="container">
                <div class="row d-flex justify-content-center">
                    <form id="profileForm" class="card p-3 w-50 d-flex">
                        <h1 class="mb-4">Профиль</h1>
                        <div class="form-control">
                            <label for="name">ФИО</label>
                            <input type="text" id="name" required>
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
                            <label for="email">Email</label>
                            <input type="email" id="email" required>
                        </div>
                        <button type="submit" class="btn btn-primary">Сохранить изменения</button>
                    </form>
                </div>
                
                <div id="profileMessage"></div>
            </div>
        `;
    }

    async executeViewScript() {
        console.log("ProfileView script executed.");
        const profileForm = document.getElementById('profileForm');
        const profileMessage = document.getElementById('profileMessage');

        try {
            const token = localStorage.getItem('token');
            const user = await getCurrentUser (token);
            
            document.getElementById('name').value = user.name;
            document.getElementById('gender').value = user.gender === "Male" ? "Мужской" : "Женский";
            document.getElementById('dob').value = new Date(user.birthday).toISOString().split('T')[0];
            document.getElementById('phone').value = user.phone;
            document.getElementById('email').value = user.email;

        } catch (error) {
            console.error('Ошибка при загрузке данных пользователя:', error);
        }

        profileForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const phone = profileForm.phone.value;
            const phoneRegex = /^\+7\d{10}$/;

            if (!phoneRegex.test(phone)) {
                profileMessage.textContent = 'Неправильный формат номера телефона. Пожалуйста, используйте формат +7XXXXXXXXXX.';
                profileMessage.style.color = 'red';
                return;
            }

            try {
                const result = await updateUser (
                    profileForm.name.value,
                    profileForm.email.value,
                    new Date(profileForm.dob.value).toISOString(),
                    profileForm.gender.value === "Мужской" ? "Male" : "Female",
                    profileForm.phone.value
                );

                if (result.status === 200) {
                    profileMessage.textContent = "Данные успешно обновлены.";
                    profileMessage.style.color = 'green';
                } else {
                    const errors = result.data.errors;
                    const errorMessages = Object.keys(errors).map(key => {
                        return `${key}: ${errors[key].join(', ')}`;
                    }).join('\n');

                    profileMessage.textContent = errorMessages;
                    profileMessage.style.color = 'red';
                }
            } catch (error) {
                console.error('Ошибка при обновлении данных:', error);
                profileMessage.textContent = "Произошла ошибка при обновлении данных.";
                profileMessage.style.color = 'red';
            }
        });
    }
}