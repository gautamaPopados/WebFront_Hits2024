import AbstractView from "./AbstractView.js";
import { getPatientById, getPatientInspections, getPatients, getRootsICD, registerPatient } from "../api.js";
import { validate } from "./Registration.js";

export default class extends AbstractView {
    constructor(params) {
        super();
        this.params = params;
    }

    async getHtml() {
        return `

            <div class="container">
                <div class="d-flex justify-content-center mb-3">
                    
                    <form id="sortForm" class="row card p-3 w-75 shadow p-3 mb-4" style="background-color: #f6f6fb;">
                        
                        <div class="row justify-content-between align-items-end">
                            
                            <div class="col-8">
                                <h1 class="mb-4">Медицинская карта пациента</h1>
                            </div>
        
                            <div class="col-4">
                                <div class=" d-flex flex-column mb-4 align-items-end">                            
                                    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#newPatientModal">
                                        Добавить осмотр
                                    </button>
                                </div>  
                            </div>
                        </div>
                        <div class="row justify-content-between align-items-end mb-3">
                            <div class="col">
                                <h4 id="patientName">
                                </h4>   
                            </div>

                            <div class="col">
                                <p class="text-end" id="patientBirthday"></p>
                            </div>
                        </div>

                        <div class="row mb-3 align-items-end">
                            <div class="col">
                                <label for="roots" class="form-label text-muted">МКБ-10</label>
                                <select class="form-control selectpicker" multiple id="roots" data-live-search="true" data-size="5">
                                </select>
                            </div>
                            <div class="col form-group">
                                <div class="form-check">
                                    <input class="form-check-input" name="group" type="radio" id="groupByChainRadio">
                                    <label class="form-check-label" for="groupByChainRadio">
                                        Сгруппировать по повторным
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" name="group" type="radio" id="showAllRadio" checked>
                                    <label class="form-check-label" for="showAllRadio">
                                        Показать все
                                    </label>
                                </div>
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

            <div class="modal fade" id="newPatientModal" tabindex="-1" aria-labelledby="newPatientModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="newPatientModalLabel">Регистрация нового пациента</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="newPatientForm">
                                <div class="mb-3">
                                    <label for="patientName" class="form-label">ФИО</label>
                                    <input type="text" class="form-control" id="patientName" required>
                                </div>
                                <div class="mb-3">
                                    <label for="patientGender" class="form-label">Пол</label>
                                    <select class="form-select" id="patientGender" required>
                                        <option value="Male">Мужской</option>
                                        <option value="Female">Женский</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label for="patientBirthday" class="form-label">Дата рождения</label>
                                    <input type="date" class="form-control" id="patientBirthday" required>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <div class="text-center mt-2" id="registerMessage"></div>
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                            <button type="button" class="btn btn-primary" id="saveNewPatient">Сохранить</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async executeViewScript() {
        const self = this;
        const form = document.getElementById('sortForm');
        const newPatientModal = new bootstrap.Modal(document.getElementById('newPatientModal'));
        const patientName = document.getElementById('patientName');
        const rootsSelect = document.getElementById('roots');
        
        // form.name.value = this.currentState.name;
        // form.conclusions.value = this.currentState.conclusions;
        // form.scheduledVisits.checked = this.currentState.scheduledVisits;
        // form.onlyMine.checked = this.currentState.onlyMine;
        // form.sorting.value = this.currentState.sorting;
        // form.numPatients.value = this.currentState.size;
        
        const registerMessage = document.getElementById('registerMessage');
        registerMessage.style.color = 'red';

        try {
            const patient = await getPatientById(this.params.id);
            const dob = new Date(patient.birthday);
            document.getElementById('patientName').innerHTML = `
                ${patient.name}
                ${this.getGenderIcon(patient.gender)}
            `
            document.getElementById('patientBirthday').textContent = "Дата рождения: " + dob.getDay().toString()  + "." + dob.getMonth().toString() + "." + dob.getFullYear().toString();
            // document.getElementById('phone').value = patient.phone;
            // document.getElementById('email').value = patient.email;

        } catch (error) {
            console.error('Ошибка при загрузке данных пользователя:', error);
        }

        try {
            const roots = await getRootsICD();

            roots.forEach(root => {
                const option = document.createElement('option');
                option.setAttribute("data-tokens", root.code)
                option.setAttribute("class", "icd-option")
                option.value = root.id;
                option.textContent = root.name;
                console.log(rootsSelect.appendChild(option));
            });
            $('.selectpicker').selectpicker('refresh');

        } catch (error) {
            console.error('Ошибка загрузки roots:', error);
        }

        // form.addEventListener('submit', async (e) => {
        //     e.preventDefault();
            
        //     this.currentState = {
        //         page: 1, 
        //         size: form.numPatients.value,
        //         name: form.name.value,
        //         conclusions: Array.from(form.conclusions.selectedOptions).map(opt => opt.value),
        //         sorting: form.sorting.value,
        //         scheduledVisits: form.scheduledVisits.checked,
        //         onlyMine: form.onlyMine.checked
        //     };

        //     this.updateURL();
        //     await this.loadPatients();
        // });

        // await this.loadPatients();

        // const saveNewPatientButton = document.getElementById("saveNewPatient");

        // saveNewPatientButton.addEventListener("click", async function(event) {
        //     event.preventDefault();
        //     const name = document.getElementById("patientName").value;
        //     const birthday = document.getElementById("patientBirthday").value;
        //     const gender = document.getElementById("patientGender").value;
        //     const data = {
        //         name: name,
        //         birthday: birthday,
        //         gender: gender
        //     };

        //     const [message, valid] = validate(data);

        //     if(!valid) {
        //         registerMessage.textContent = message;
        //         return;
        //     }

        //     try {
        //         const result = await registerPatient(JSON.stringify(data));

        //         if (result.status === 200) {     
        //             console.log(`Регистрация нового пациента: ${name}, ${gender}, ${birthday}`);
                    
        //             registerMessage.style.color = 'green';
        //             registerMessage.textContent = "Успешно";

        //             newPatientModal.hide();
                
        //             document.getElementById("newPatientForm").reset();
                    
        //             await self.loadPatients();
        //         } 
        //     } catch (error) {
        //         console.error('Ошибка при регистрации пациента:', error);
                
        //         registerMessage.style.color = 'red';
        //         registerMessage.textContent = "Произошла ошибка при регистрации.";
        //     }


        // });
    }

    getGenderIcon(gender) {
        return gender === 'Male' 
            ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-gender-male" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M9.5 2a.5.5 0 0 1 0-1h5a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0V2.707L9.871 6.836a5 5 0 1 1-.707-.707L13.293 2zM6 6a4 4 0 1 0 0 8 4 4 0 0 0 0-8"/></svg>'
            : '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-gender-female" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 1a4 4 0 1 0 0 8 4 4 0 0 0 0-8M3 5a5 5 0 1 1 5.5 4.975V12h2a.5.5 0 0 1 0 1h-2v2.5a.5.5 0 0 1-1 0V13h-2a.5.5 0 0 1 0-1h2V9.975A5 5 0 0 1 3 5"/></svg>';
    }

    async loadPatients() {
        const queryString = buildQueryString(this.currentState);
        const [patients, pagination] = await getPatients(queryString);
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
            `;

            patientElement.querySelector('.card').addEventListener('click', () => {
                window.location.href = `/patient/${patient.id}`;
            });
            
            patientsList.appendChild(patientElement);
        });
    }

    updatePagination(pagination) {
        const paginationContainer = document.createElement('div');
        paginationContainer.className = 'pagination';

        const currentPage = parseInt(this.currentState.page);
        const totalPages = pagination.count;
        
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

        const range = 2;
        
        paginationContainer.appendChild(createPageItem(1, currentPage === 1));

        if (currentPage - range > 2) {
            const ellipsis = document.createElement('li');
            ellipsis.setAttribute("class", "page-item disabled");
            ellipsis.innerHTML = '<a class="page-link">...</a>';
            paginationContainer.appendChild(ellipsis);
        }

        for (let i = Math.max(2, currentPage - range); i <= Math.min(totalPages - 1, currentPage + range); i++) {
            paginationContainer.appendChild(createPageItem(i, currentPage === i));
        }

        if (currentPage + range < totalPages - 1) {
            const ellipsis = document.createElement('li');
            ellipsis.setAttribute("class", "page-item disabled");
            ellipsis.innerHTML = '<a class="page-link">...</a>';
            paginationContainer.appendChild(ellipsis);
        }

        if (totalPages > 1) {
            paginationContainer.appendChild(createPageItem(totalPages, currentPage === totalPages));
        }

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

    
}    

function buildQueryString(params) {
    const queryParams = new URLSearchParams();
    
    if (params.name != "") queryParams.append('name', params.name);
    if (params.conclusions?.length) queryParams.append('conclusions', params.conclusions.join(','));
    if (params.sorting) queryParams.append('sorting', params.sorting);
    if (params.scheduledVisits) queryParams.append('scheduledVisits', params.scheduledVisits);
    if (params.onlyMine) queryParams.append('onlyMine', params.onlyMine);
    if (params.page) queryParams.append('page', params.page);
    if (params.size) queryParams.append('size', params.size);
    
    return queryParams;
}

document.addEventListener("DOMContentLoaded", function() {
    const newPatientForm = document.getElementById("newPatientForm");
    
});