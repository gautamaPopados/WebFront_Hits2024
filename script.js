import { getCurrentUser, logoutUser  } from "./api.js";


export async function updateAuthButton(token) {
  if (!token) {
    return;
  }
  
  try {
    const user = await getCurrentUser (token);
    const authButton = document.getElementById('auth-button');
    const userNavbar = document.querySelector('.collapse');
    const userInfo = document.getElementById('user-info');
    const userName = document.getElementById('user-name');
    const userMenu = document.getElementById('myDropdown');
    const navbarCollapse = new bootstrap.Collapse(userNavbar)

    // Скрыть кнопку авторизации и показать информацию о пользователе
    authButton.style.display = 'none';
    userInfo.style.display = 'block';
    userName.textContent = user.name;

    userName.addEventListener('click', myFunction);

    function myFunction() {
      userMenu.classList.toggle("show");
      navbarCollapse.show()
    }

    window.addEventListener('click', function(event) {
      if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        for (let i = 0; i < dropdowns.length; i++) {
          var openDropdown = dropdowns[i];
          if (openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
          }
        }
      }
    });
  } catch (error) {
    console.error('Ошибка:', error);
  }
}

const logout = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
        return; // Если токена нет, просто выходим
    }
    try {

        const result = await logoutUser(token);
        if (result.status === 200 || result.status === 204) {
            // Успешный выход
            localStorage.removeItem('token'); // Удаляем токен из localStorage
            console.log('Токен удален');
            updateAuthButton(null); // Обновляем интерфейс
            window.location.href = '/login'; // Перенаправляем пользователя на страницу входа
            console.log('Выход выполнен успешно');
        } else {
            console.error('Ошибка при выходе:', result.status);
        }
    } catch (error) {
        console.error('Ошибка при выходе:', error);
    }
}

document.getElementById('logout-button').addEventListener('click', logout);


window.logout = logout;

window.addEventListener('load', function() {
  const token = localStorage.getItem('token');
  if (token) {
    updateAuthButton(token);
  }
});