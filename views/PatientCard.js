import AbstractView from "./AbstractView.js";
import { getInspectionChain, getPatientById, getPatientInspections, getPatients, getRootsICD, registerPatient } from "../api.js";

export default class extends AbstractView {
    constructor(params) {
        super();
        const id = params.id;
        this.params = new URLSearchParams(window.location.search);
        this.currentState = {
            id: id,
            grouped: false,
            page: this.params.get('page') || 1,
            size: this.params.get('size') || 4,
            roots: this.params.get('icdRoots')?.split(',') || []
        };
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
                                <div class=" d-flex flex-column mb-4 align-items-end"  > 
                                    <a href="/inspection/create" >                           
                                        <button type="button" class="btn btn-primary" id="addInspectionButton">
                                            Добавить осмотр
                                        </button>
                                    </a>   
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
                            <div class="col-6">
                                <label for="roots" class="form-label text-muted">МКБ-10</label>
                                <select class="form-control selectpicker" multiple id="roots" data-live-search="true" title="Не выбрано" size=10 style="width: 200px;">
                                </select>
                            </div>
                            <div class="col-6 form-group">
                                <div class="form-check">
                                    <input class="form-check-input" name="group" type="radio" id="groupByChainRadio" value=true>
                                    <label class="form-check-label" for="groupByChainRadio">
                                        Сгруппировать по повторным
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" name="group" type="radio" id="showAllRadio" value=false checked>
                                    <label class="form-check-label" for="showAllRadio">
                                        Показать все
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="row justify-content-between align-items-end">
                                <div class="form-group col-4">
                                    <label for="size" class="form-label ">Число пациентов на странице</label>
                                    <select class="form-select" id="size">
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
                <div id="patients-list" class="row row-cols-1 row-cols-md-1 row-cols-lg-1 row-cols-xl-2 g-4 mb-4">
                    <!-- Список пациентов будет отображаться здесь -->
                </div>
                <div class="pagination-container d-flex justify-content-center">
                    
                </div>
            </div>
        `;
    }

    async executeViewScript() {
        const form = document.getElementById('sortForm');
        const rootsSelect = document.getElementById('roots');
        const addInspectionButton = document.getElementById('addInspectionButton');
        addInspectionButton.addEventListener('click',  (e) => {
            localStorage.setItem('currentPatientId', this.currentState.id);
            localStorage.setItem('previousId', null);
        })
        try {
            const patient = await getPatientById(this.currentState.id);
            const dob = new Date(patient.birthday);
            document.getElementById('patientName').innerHTML = `
                ${patient.name}
                ${this.getGenderIcon(patient.gender)}
            `
            document.getElementById('patientBirthday').textContent = new Date(patient.birthday).toLocaleDateString();

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
                rootsSelect.appendChild(option);
            });
            $('.selectpicker').selectpicker('refresh');
        } catch (error) {
            console.error('Ошибка загрузки roots:', error);
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            this.currentState = {
                id: this.currentState.id,
                page: 1, 
                size: form.size.value,
                grouped: $('input[name=group]:checked').val(),
                roots: Array.from(form.roots.selectedOptions).map(opt => opt.value)
            };

            this.updateURL();
            await this.loadInspections();
        });

        await this.loadInspections();
    }

    getGenderIcon(gender) {
        return gender === 'Male' 
            ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-gender-male" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M9.5 2a.5.5 0 0 1 0-1h5a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0V2.707L9.871 6.836a5 5 0 1 1-.707-.707L13.293 2zM6 6a4 4 0 1 0 0 8 4 4 0 0 0 0-8"/></svg>'
            : '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-gender-female" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 1a4 4 0 1 0 0 8 4 4 0 0 0 0-8M3 5a5 5 0 1 1 5.5 4.975V12h2a.5.5 0 0 1 0 1h-2v2.5a.5.5 0 0 1-1 0V13h-2a.5.5 0 0 1 0-1h2V9.975A5 5 0 0 1 3 5"/></svg>';
    }

    async loadInspections() {
        const queryString = buildQueryString(this.currentState);
        const [inspections, pagination] = await getPatientInspections(this.currentState.id, queryString);
        
        if (this.currentState.grouped == "true") {
            for (let inspection of inspections) {
                if (inspection.hasChain || inspection.hasNested) {
                    const chain = await getInspectionChain(inspection.id);

                    inspection.chain = chain; 
                }
            }
        }
        
        this.updateInspectionsList(inspections);
        this.updatePagination(pagination);
    }

    updateInspectionsList(inspections) {
        const inspectionList = document.getElementById('patients-list');
        inspectionList.innerHTML = '';


        inspections.forEach((inspection) => {
            const parentElement = document.createElement('div');
            const chainElements = [];
            const hasChain = inspection.chain && inspection.chain.length > 0;
            var margin = ``;
                
            if (hasChain) {
                inspection.chain.forEach((chainItem, index) => {
                    const container = document.createElement('div');
                    const row = document.createElement('div');
                    const chain = document.createElement('span');
                    row.classList.add('row');
                    container.classList.add('container', 'chain-element');
                    container.style.display = 'none';
                    chain.classList.add('col-1','border', 'border-3', 'border-end-0', 'border-top-0', 'm-2');
                    chain.style.height = "50px";
                    chain.style.width = "10px";
                    const chainElement = document.createElement('div');
                    chainElement.classList.add('col','card', 'p-3', 'shadow-sm', 'mt-3');
                    
                    if (index < 3) {
                        margin =  `${(index+1) * 50}px`;
                        row.style.marginLeft = margin;
                    } else {
                        row.style.marginLeft = margin;
                    }

                    console.log(chainItem);
                    chainElement.innerHTML = `
                        <div class="d-flex justify-content-between align-items-start">
                            <div>
                                <span class="badge bg-secondary mb-2">${new Date(chainItem.date).toLocaleDateString()}</span>
                                <h5 class="mb-1">Амбулаторный осмотр</h5>
                            </div>
                            <div>
                                <a href="/inspection/create" class="append-button">
                                    <i class="bi bi-pencil-square"></i> Добавить осмотр
                                </a>
                                <a href="/inspection/${chainItem.id}" class="text-decoration-none">
                                    <i class="bi bi-search"></i> Детали осмотра
                                </a>
                            </div>
                        </div>
                        <p class="mb-1"><strong>Заключение: </strong>${chainItem.conclusion}</p>
                        <p class="mb-1"><strong>Основной диагноз:</strong> ${chainItem.diagnosis.name} </p>
                        <p class="text-muted mb-0">Медицинский работник: ${chainItem.doctor}</p>
                    `;
                    row.innerHTML += chain.outerHTML;
                    row.innerHTML += chainElement.outerHTML;
                    container.innerHTML += row.outerHTML;
                    chainElements.push(container);
                    const addInspectionButton = container.querySelector('.append-button');
                    console.log(addInspectionButton.innerHTML);
                    addInspectionButton.addEventListener('click', (e) => {
                        localStorage.setItem('currentPatientId', this.currentState.id);
                        localStorage.setItem('previousId', chainItem.id);
                    });
                });
            }
    
            parentElement.innerHTML = `
                <div class="container mt-4">
                    <div class="card p-3 shadow-sm" style="background-color: ${inspection.conclusion == "Death" ? "#ffefe8" : "#f6f6fb"} ; ">
                        <div class="d-flex justify-content-between align-items-start">
                            <div>
                                <i class="bi bi-plus-square-fill toggle-icon" style = "display: ${hasChain == true ? "inline-block" : "none"}"></i>
                                <span class="badge bg-secondary mb-2">${new Date(inspection.date).toLocaleDateString()}</span>
                                <h5 class="mb-1">Амбулаторный осмотр</h5>
                            </div>
                            <div>
                                <a href="/inspection/create"  class="text-decoration-none append-button-main" style = "display: ${inspection.hasNested == true ? "none" : "inline-block"}">
                                    <i class="bi bi-pencil-square"></i> Добавить осмотр
                                </a>
                                <a href="/inspection/${inspection.id}" class="text-decoration-none">
                                    <i class="bi bi-search"></i> Детали осмотра
                                </a>
                            </div>
                        </div>
                        <p class="mb-1"><strong>Заключение: </strong>${inspection.conclusion}</p>
                        <p class="mb-1"><strong>Основной диагноз:</strong> ${inspection.diagnosis.name} (${inspection.diagnosis.code})</p>
                        <p class="text-muted mb-0">Медицинский работник: ${inspection.doctor}</p>
                    </div>
                
            `;

            
            
            chainElements.forEach(chainElement => parentElement.append(chainElement));
            parentElement.innerHTML += `</div>`;
            inspectionList.appendChild(parentElement);
            
            const addInspectionButton = parentElement.querySelector('.append-button-main');
            addInspectionButton.addEventListener('click', (e) => {
                localStorage.setItem('currentPatientId', this.currentState.id)
                localStorage.setItem('previousId', inspection.id)
            });

            const toggleIcon = parentElement.querySelector('.toggle-icon');
            toggleIcon.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleChainElements(parentElement); 
                toggleIcon.classList.toggle('bi-plus-square-fill'); 
                toggleIcon.classList.toggle('bi-dash-square-fill');
            });
        });
    }

    toggleChainElements(parentElement) {
        const chainElements = parentElement.querySelectorAll('.chain-element');
        chainElements.forEach(chainElement => {
            if (chainElement.style.display === 'none') {
                chainElement.style.display = 'block';
            } else {
                chainElement.style.display = 'none';
            }
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
                await this.loadInspections();
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
                await this.loadInspections();
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
                await this.loadInspections();
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
    
    queryParams.append('grouped', $('input[name=group]:checked').val());
    if (params.roots?.length) queryParams.append('icdRoots', params.roots.join(','));
    if (params.page) queryParams.append('page', params.page);
    if (params.size) queryParams.append('size', params.size);
    
    return queryParams;
}


