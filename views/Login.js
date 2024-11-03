import { loginUser } from "../api.js";
import { updateAuthButton } from "../script.js";
import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    async getHtml() {
        return `
            <div class="container">
                <div class="d-flex justify-content-center">
                    
                    <form id="loginForm" class="card p-3 w-50 shadow p-3" style="background-color: #f6f6fb;">
                        <h1 class="mb-4">Вход</h1>
                        <div class="row mb-3">
                            <div class="form-group">
                                <label style="color: #8a8aa7;" for="email">Email</label>
                                <input class="form-control" type="email" id="email" required autocomplete="email">
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="form-group">
                                <label style="color: #8a8aa7;" for="password">Пароль</label>
                                <input class="form-control" type="password" id="password" required autocomplete="current-password">
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col justify-content-around d-flex flex-column">
                                <button type="submit" class="btn btn-primary">Войти</button>
                            </div> 
                        </div>
                        <div class="row mb-3"> 
                            <a class="justify-content-around d-flex flex-column" id="btn-register" href="/registration" onclick="route(event)">
                                <button class="btn btn-secondary">Регистрация</button>
                            </a>
                        </div>
                        <div class="text-center mt-2" id="loginMessage"></div>
                    </form>
                    
                </div>
            </div>
        `;
    }

    async executeViewScript() {
        console.log("LoginView script executed.");
        const loginForm = document.getElementById('loginForm');
        const loginMessage = document.getElementById('loginMessage');
        loginMessage.style.color = 'red';

        loginForm.addEventListener('submit', async function (event) {
            
            event.preventDefault(); 
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const result = await loginUser(email, password);
                
                if (result.status === 200) {
                    loginMessage.textContent = "Успешно";
                    loginMessage.style.color = 'green';
                    localStorage.setItem('token', result.data.token);
                    await updateAuthButton(result.data.token);
                    console.log('Form submitted');
                    window.location.href = "/patients";
                } else if (result.status === 400) {
                    loginMessage.textContent = "Неверный email или пароль";
                }
            } catch (error) {
                console.error('Ошибка:', error);
                loginMessage.textContent = "Произошла ошибка при входе.";
                
            }
        });
    } 
}
