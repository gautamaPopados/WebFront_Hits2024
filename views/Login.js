import { loginUser } from "../api.js";
import { updateAuthButton } from "../script.js";
import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    async getHtml() {
        return `
            <div class="login-box">
                <h1>Вход</h1>
                <form id="loginForm">
                    <div class="input-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" required autocomplete="email">
                    </div>
                    <div class="input-group">
                        <label for="password">Пароль</label>
                        <input type="password" id="password" required autocomplete="current-password">
                    </div>
                    <button type="submit" class="btn btn-primary">Войти</button>
                    <a id="btn-register" href="/registration" onclick="route(event)">
                        <button class="btn btn-secondary" >Регистрация</button>
                    </a>
                </form>
                <div id="loginMessage"></div>
            </div>
        `;
    }

    async executeViewScript() {
        console.log("LoginView script executed.");
        const loginForm = document.getElementById('loginForm');
        const loginMessage = document.getElementById('loginMessage');
        

        loginForm.addEventListener('submit', async function (event) {
            event.preventDefault(); 
            console.log('Form submitted');
        
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            try {
                const result = await loginUser(email, password);
                if (result.status === 200) {
                    loginMessage.textContent = "Success";
                    loginMessage.style.color = 'green';
                    localStorage.setItem('token', result.data.token);
                    await updateAuthButton(result.data.token);
                    window.location.href = "/profile";
                } else if (result.status === 400) {
                    loginMessage.textContent = result.data.message;
                    loginMessage.style.color = 'red'; 
                }
            } catch (error) {
                console.error('Ошибка:', error);
                loginMessage.textContent = "Произошла ошибка при входе.";
                loginMessage.style.color = 'red';
            }
        });
    } 
}
