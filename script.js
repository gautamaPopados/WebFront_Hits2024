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
    const navbarCollapse = new bootstrap.Collapse(userNavbar)

    authButton.style.display = 'none';
    userInfo.style.display = 'block';
    userName.textContent = user.name;

    userName.addEventListener('click', myFunction);

    function myFunction() {
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
        return; 
    }
    try {

        const result = await logoutUser(token);
        if (result.status === 200 || result.status === 204) {
            localStorage.removeItem('token'); 
            console.log('Токен удален');
            updateAuthButton(null); 
            window.location.href = '/login';
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