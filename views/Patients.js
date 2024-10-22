import AbstractView from "./AbstractView.js";
import { loadPatients } from "../api.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.params = new URLSearchParams(window.location.search);
        this.currentState = {
            page: this.params.get('page') || 1,
            size: this.params.get('size') || 4,
            name: this.params.get('name') || '',
            conclusions: this.params.get('conclusions')?.split(',') || [],
            sorting: this.params.get('sorting') || '',
            scheduledVisits: this.params.get('scheduledVisits') === 'true',
            onlyMine: this.params.get('onlyMine') === 'true'
        };
    }
    async getHtml() {
        return `

            <div class="container">
                <div class="d-flex justify-content-center mb-3">
                    
                    <form id="sortForm" class="row card p-3 w-75 shadow p-3 mb-4" style="background-color: #f6f6fb;">
                        
                        <div class="row justify-content-between align-items-end">
                            
                            <div class="col">
                                <h1 class="mb-4">Пациенты</h1>
                            </div>
        
                            <div class="col">
                                <div class=" d-flex flex-column mb-4 align-items-end">                            
                                    <button type="button" class="btn btn-primary w-50">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-fill-add" viewBox="0 0 16 16">
                                            <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0m-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                                            <path d="M2 13c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4"/>
                                        </svg> 
                                        Добавить пациента
                                    </button>
                                </div>  
                            </div>
                        </div>
                        <div class="row">
                            <h4>Фильтры и сортировка</h4>
                        </div>

                        <div class="row mb-3">
                            <div class="col">
                                <label for="name" class="form-label text-muted">Имя</label>
                                <input type="text" class="form-control" id="name" placeholder="Имя Иван Иванович">
                            </div>
                            <div class="col">
                                <label for="conclusions" class="form-label text-muted">Информация заключения</label>
                                <select class="form-control selectpicker" multiple id="conclusions">
                                    <option value="Disease">Болезнь</option>
                                    <option value="Recovery">Восстановление</option>
                                    <option value="Death">Смерть</option>
                                </select>
                            </div>
                        </div>
                        <div class="row mb-3 align-items-center">    
                            <div class="col">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" id="scheduledVisits">
                                    <label class="form-check-label" for="scheduledVisits">
                                        Есть авторизованные визиты
                                    </label>
                                </div>
                            </div>
                            <div class="form-group col">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" id="onlyMine">
                                    <label class="form-check-label" for="onlyMine">
                                        Мои пациенты
                                    </label>
                                </div>
                            </div>
                            <div class="form-group col">
                                <label for="sorting" class="form-label ">Сортировка пациентов</label>
                                <select class="form-select" id="sorting">
                                    <option value="NameAsc" selected>По имени (А-Я)</option>
                                    <option value="NameDesc">По имени (Я-А)</option>
                                    <option value="CreateAsc">По дате создания (старые-новые)</option>
                                    <option value="CreateDesc">По дате создания (новые-старые)</option>
                                    <option value="InspectionAsc">По числу осмотров (возрастание)</option>
                                    <option value="InspectionDesc">По числу осмотров (убывание)</option>
                                </select>
                            </div>
                        </div>
                        <div class="row justify-content-between align-items-end">
                                <div class="form-group col-4">
                                    <label for="numPatients" class="form-label ">Число пациентов на странице</label>
                                    <select class="form-select" id="numPatients">
                                        <option selected>4</option>
                                        <option>6</option>
                                    </select>
                                </div>
                                <div class="col-4 link-underline-opacity-0 justify-content-bottom d-flex flex-column align-bottom">
                                    <button type="submit" class="btn btn-primary">Поиск</button>
                                </div>    
                        </div>
                        
                    </form>
                </div>
                <div id="patients-list" class="row row-cols-1 row-cols-md-2 g-4 mb-4">
                    <!-- Список пациентов будет отображаться здесь -->
                </div>
                <div class="pagination-container d-flex justify-content-center">
                    
                </div>
            </div>
        `;
    }

    async loadPatients() {
        const queryString = buildQueryString(this.currentState);
        const [patients, pagination] = await loadPatients(queryString);
        this.updatePatientsList(patients);
        this.updatePagination(pagination);
    }

    updatePatientsList(patients) {
        const patientsList = document.getElementById('patients-list');
        patientsList.innerHTML = '';

        patients.forEach((patient) => {
            const patientElement = document.createElement('div');
            patientElement.innerHTML = `
            <div class="col">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${patient.name}</h5>
                        <p class="card-text">Дата рождения: ${new Date(patient.birthday).toLocaleDateString()}</p>
                        <p class="card-text">Пол: ${patient.gender === 'Male' ? 'Мужской' : 'Женский'}</p>
                    </div>
                </div>
            </div>
            `
            patientsList.appendChild(patientElement);
        });
    }

    updatePagination(pagination) {
    const paginationContainer = document.createElement('div');
    paginationContainer.className = 'pagination';

    const currentPage = parseInt(this.currentState.page);
    const totalPages = pagination.count;
    
    // Функция для создания элемента страницы
    const createPageItem = (pageNum, isActive = false) => {
        const pageLink = document.createElement('li');
        pageLink.setAttribute("class", `page-item ${isActive ? 'active' : ''}`);
        pageLink.innerHTML = `
            <a class="page-link" href="#" ariaLabel="Page ${pageNum}">${pageNum}</a>
        `;
        pageLink.addEventListener('click', async (e) => {
            e.preventDefault();
            this.currentState.page = pageNum;
            this.updateURL();
            await this.loadPatients();
        });
        return pageLink;
    };

    // Добавляем кнопку "Предыдущая"
    if (currentPage > 1) {
        const prevLink = document.createElement('li');
        prevLink.setAttribute("class", "page-item");
        prevLink.innerHTML = `
            <a class="page-link" href="#" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
            </a>
        `;
        prevLink.addEventListener('click', async (e) => {
            e.preventDefault();
            this.currentState.page = currentPage - 1;
            this.updateURL();
            await this.loadPatients();
        });
        paginationContainer.appendChild(prevLink);
    }

    // Логика отображения номеров страниц
    const range = 2; // Количество страниц до и после текущей
    
    // Первая страница
    paginationContainer.appendChild(createPageItem(1, currentPage === 1));

    if (currentPage - range > 2) {
        const ellipsis = document.createElement('li');
        ellipsis.setAttribute("class", "page-item disabled");
        ellipsis.innerHTML = '<a class="page-link">...</a>';
        paginationContainer.appendChild(ellipsis);
    }

    // Страницы вокруг текущей
    for (let i = Math.max(2, currentPage - range); i <= Math.min(totalPages - 1, currentPage + range); i++) {
        paginationContainer.appendChild(createPageItem(i, currentPage === i));
    }

    if (currentPage + range < totalPages - 1) {
        const ellipsis = document.createElement('li');
        ellipsis.setAttribute("class", "page-item disabled");
        ellipsis.innerHTML = '<a class="page-link">...</a>';
        paginationContainer.appendChild(ellipsis);
    }

    // Последняя страница
    if (totalPages > 1) {
        paginationContainer.appendChild(createPageItem(totalPages, currentPage === totalPages));
    }

    // Добавляем кнопку "Следующая"
    if (currentPage < totalPages) {
        const nextLink = document.createElement('li');
        nextLink.setAttribute("class", "page-item");
        nextLink.innerHTML = `
            <a class="page-link" href="#" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
            </a>
        `;
        nextLink.addEventListener('click', async (e) => {
            e.preventDefault();
            this.currentState.page = currentPage + 1;
            this.updateURL();
            await this.loadPatients();
        });
        paginationContainer.appendChild(nextLink);
    }

    // Обнов ляем контейнер пагинации
    const oldPagination = document.querySelector('.pagination');
    if (oldPagination) {
        oldPagination.parentNode.removeChild(oldPagination);
    }
    document.querySelector('.pagination-container').appendChild(paginationContainer);
}

    updateURL() {
        const queryString = buildQueryString(this.currentState);
        const newURL = `${window.location.pathname}?${queryString}`;
        window.history.pushState({}, '', newURL);
    }

    async executeViewScript() {
        const form = document.getElementById('sortForm');
        
        // Установка начальных значений формы из URL
        form.name.value = this.currentState.name;
        form.conclusions.value = this.currentState.conclusions;
        form.scheduledVisits.checked = this.currentState.scheduledVisits;
        form.onlyMine.checked = this.currentState.onlyMine;
        form.sorting.value = this.currentState.sorting;
        form.numPatients.value = this.currentState.size;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            this.currentState = {
                page: 1, // Сброс на первую страницу при новом поиске
                size: form.numPatients.value,
                name: form.name.value,
                conclusions: Array.from(form.conclusions.selectedOptions).map(opt => opt.value),
                sorting: form.sorting.value,
                scheduledVisits: form.scheduledVisits.checked,
                onlyMine: form.onlyMine.checked
            };

            this.updateURL();
            await this.loadPatients();
        });

        // Инициализация первой загрузки
        await this.loadPatients();
    }
    

}    

function buildQueryString(params) {
    const queryParams = new URLSearchParams();
    
    // Добавляем только непустые параметры
    if (params.name != "") queryParams.append('name', params.name);
    if (params.conclusions?.length) queryParams.append('conclusions', params.conclusions.join(','));
    if (params.sorting) queryParams.append('sorting', params.sorting);
    if (params.scheduledVisits) queryParams.append('scheduledVisits', params.scheduledVisits);
    if (params.onlyMine) queryParams.append('onlyMine', params.onlyMine);
    if (params.page) queryParams.append('page', params.page);
    if (params.size) queryParams.append('size', params.size);
    
    return queryParams;
}