import { loadSpecialties, registerUser } from "../api.js";
import AbstractView from "./AbstractView.js";
import { updateAuthButton } from "../script.js";

export default class extends AbstractView {
    async getHtml() {
        return `
                <div class="container">
                    <div class="d-flex justify-content-center">
                        
                        <form id="registerForm" class="card p-3 w-50 shadow p-3" style="background-color: #f6f6fb;">
                            <h1 class="mb-4">Регистрация</h1>
                            <div class="row mb-3">
                                <div class="form-group">
                                    <label style="color: #8a8aa7;" for="name">Имя</label>
                                    <input class="form-control" type="text" id="name" placeholder="Иван Иванов" required>
                                </div>
                            </div>
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
                                <div class="form-group">
                                    <label style="color: #8a8aa7;" for="specialization">Специальность</label>
                                    <select class="form-select" id="specialization">
                                    </select>
                                </div>
                            </div>
                            <div class="row mb-3">
                                <div class="form-group col">
                                    <label style="color: #8a8aa7;" for="email">Email</label>
                                    <input class="form-control" type="email" id="email" required>
                                </div>
                            </div>
                            <div class="row mb-3">
                                <div class="form-group col">
                                    <label style="color: #8a8aa7;" for="password">Пароль</label>
                                    <input class="form-control" type="password" id="password" required autocomplete="new-password">
                                </div>
                            </div>
                            <div class="row mb-3">
                                <div class="col link-underline-opacity-0 justify-content-around d-flex flex-column">
                                    <button type="submit" class="btn btn-primary">Зарегистрироваться</button>
                                </div>
                            </div>
                            <div class="text-center mt-2" id="registerMessage"></div>
                        </form>
                        <script src="authentification.js"></script>
                        <script src="api.js"></script>
                    </div>
                </div>
                `;
    }

    async executeViewScript() {
        console.log("RegisterView script executed.");
        const specialtySelect = document.getElementById('specialization');
        const form = document.getElementById('registerForm');
        const registerMessage = document.getElementById('registerMessage');
        registerMessage.style.color = 'red';
        
        try {
            const specialties = await loadSpecialties();

            specialties.forEach(specialty => {
                const option = document.createElement('option');
                option.value = specialty.id;
                option.textContent = specialty.name;
                specialtySelect.appendChild(option);
            });
        } catch (error) {
            console.error('Ошибка загрузки специальностей:', error);
        }

        form.addEventListener('submit', async function (e) {
            e.preventDefault();
            
            const data = {
                name: form.name.value,
                password: form.password.value,
                email: form.email.value,
                birthday: new Date(form.dob.value).toISOString(),
                gender: form.gender.value === "Мужской" ? "Male" : "Female",
                phone: form.phone.value,
                speciality: form.specialization.value
            }
            const jsonData = JSON.stringify(data)
            
            const [message, valid] = validate(data);

            if(!valid) {
                registerMessage.textContent = message;
                return;
            }

            try {
                const result = await registerUser(jsonData)

                if (result.status === 200) {
                    registerMessage.textContent = "Success";
                    registerMessage.style.color = 'green';
                    localStorage.setItem('token', result.data.token);
                    await updateAuthButton(result.data.token);
                    window.location.href = "/profile";
                }

            } catch (error) {
                console.error('Ошибка:', error);
                registerMessage.textContent = "Произошла ошибка при регистрации.";
                registerMessage.style.color = 'red';
            }
        })
    }
}

export function validate(data) {
    var message= "";
    var valid = true;

    for (let [key, value] of Object.entries(data)) {
        switch (key) {
            case "email":
                if (!value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
                    valid = false;
                    message ="Неверный формат email";
                }
                break;
            case "password":
                if (!value.match(/^(?=.*\d).{6,}$/)) {
                    valid = false;
                    message ="Минимальная длина пароля - 6. Пароль должен содержать хотя бы одну цифру.";
                }
                break;
            case "birthday":
                var bday = new Date(value);
                var now = new Date();
                if (bday > now) {
                    valid = false;
                    message ="Неверный день рождения";
                }
                break;
            case "phone":
                if (!value.match(/^\+7\d{10}$/)) {
                    valid = false;
                    message = "Введите телефон в формате +7хххххххххх";
                }
                break;
        }
    }
    return [message, valid];
}