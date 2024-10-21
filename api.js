const apiUrl = 'https://mis-api.kreosoft.space/api';

export async function loginUser(email, password) {
    try {
        const response = await fetch(apiUrl + '/doctor/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password }) 
        });

        const data = await response.json();

        return { status: response.status, data: data };

    } catch (error) {
        console.error('Error in login API:', error);
        throw error; 
    }
}

export async function logoutUser (token) {
    try {
        const response = await fetch(apiUrl + '/doctor/logout', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        const data = await response.json();

        return { status: response.status, data: data };
    } catch (error) {
        console.error('Ошибка при выходе FF:', error);
        throw error;
    }
}


export async function getCurrentUser (token) {
    if (!token)
        return;

    try {
        const response = await fetch(apiUrl + '/doctor/profile', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        const data = await response.json();

        return data;
    } catch (error) {
        console.error('Ошибка:', error);
        throw error; 
    }
}

export async function registerUser(jsonData)
    {
    try {
        const response = await fetch(apiUrl + '/doctor/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: jsonData
        });

        const data = await response.json();

        return { status: response.status, data: data };

    } catch (error) {
        console.error('Error in register API:', error);
        throw error; 
    }
}

export async function updateUser (jsonData) {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const response = await fetch(apiUrl + '/doctor/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: jsonData
        });

        return  response;

    } catch (error) {
        console.error('Error in update API:', error);
        throw error; 
    }
}

export async function loadSpecialties() {
    const response = await fetch(apiUrl + '/dictionary/speciality');
    if (!response.ok) {
        throw new Error('Ошибка при загрузке специализаций');
    }
    const data = await response.json();
    return data.specialties;
}
