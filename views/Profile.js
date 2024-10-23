import { getCurrentUser , updateUser  } from "../api.js"; // Импортируем необходимые функции
import AbstractView from "./AbstractView.js";
import { validate } from "./Registration.js";

export default class extends AbstractView {
    async getHtml() {
        return `
            <div class="container">
                <div class="d-flex justify-content-center">
                    <form id="profileForm" class="card p-3 w-50 shadow p-3" style="background-color: #f6f6fb;">
                        <h1 class="mb-4">Профиль</h1>
                        <div class="row mb-3">
                            <div class="form-group ">
                                <label style="color: #8a8aa7;" for="name">ФИО</label>
                                <input type="text" class="form-control" id="name" required>
                            </div>
                        </div>
                        </form-row>
                        <div class="row mb-3">
                            <div class="form-group col">
                                <label style="color: #8a8aa7;" for="gender">Пол</label>
                                <select class="form-select" id="gender" aria-label="Select gender">
                                    <option value="Мужской">Мужской</option>
                                    <option value="Женский">Женский</option>
                                </select>
                            </div>
                            <div class="form-group col">
                                <label style="color: #8a8aa7;" for="dob">Дата рождения</label>
                                <input class="form-control" type="date" id="dob" required>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="form-group col">
                                <label style="color: #8a8aa7;" for="phone">Телефон</label>
                                <input class="form-control" type="text" id="phone" placeholder="+7 (999) 999-99-99" required>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="form-group col">
                                <label style="color: #8a8aa7;" for="email">Email</label>
                                <input class="form-control" type="email" id="email" required>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col link-underline-opacity-0 justify-content-around d-flex flex-column">
                                <button type="submit" class="btn btn-primary">Сохранить изменения</button>
                            </div>
                        </div>
                        <div class="text-center mt-2" id="profileMessage"></div>
                    </form>
                </div>
                
            </div>
        `;
    }

    async executeViewScript() {
        console.log("ProfileView script executed.");
        const profileForm = document.getElementById('profileForm');
        const profileMessage = document.getElementById('profileMessage');
        profileMessage.style.color = 'red';

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

            const data = {
                name:  profileForm.name.value,
                email: profileForm.email.value,
                birthday: new Date(profileForm.dob.value).toISOString(),
                gender: profileForm.gender.value === "Мужской" ? "Male" : "Female",
                phone: profileForm.phone.value
            }

            const jsonData = JSON.stringify(data)

            const [message, valid] = validate(data);

            if(!valid) {
                profileMessage.textContent = message;
                return;
            }

            try {
                const result = await updateUser (jsonData);

                if (result.status === 200) {
                    profileMessage.textContent = "Данные успешно обновлены.";
                    profileMessage.style.color = 'green';
                } 
            } catch (error) {
                console.error('Ошибка при обновлении данных:', error);
                profileMessage.textContent = "Произошла ошибка при обновлении данных.";
                profileMessage.style.color = 'red';
            }
        });
    }
}