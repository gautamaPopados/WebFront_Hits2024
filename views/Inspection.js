import AbstractView from "./AbstractView.js";
import { getRootsICD, getPatientById, getPatientInspections, loadSpecialties, getInspectionById, searchInspectionsWithoutChildren, getDiagnosesICD, postInspection, getCurrentUser } from "../api.js";

export default class extends AbstractView {
    constructor(params) {
        super();
        var user = null;
        const id = params.id;
        this.currentState = {
            id: id
        };
    }

    async getHtml() {
        return `

            <div class="container">
                <div class="d-flex justify-content-center mb-3">
                    
                    <form id="createForm" class="row  p-3 w-75 p-3 mb-4">
                        <div class="row p-2 mb-3" style="background-color: #f6f6fb;">
                            <div class="row justify-content-between align-items-end mb-1">
                                <div class="col-10">
                                        <h2 class="mb-4" id="title">Медицинская карта пациента</h2>
                                </div>
                
                                <div class="col-2">
                                    <div class=" d-flex flex-column mb-4 align-items-end"  > 
                                        <a href="/inspection/create" >                           
                                            <button type="button" class="btn btn-sm btn-primary" id="addInspectionButton">
                                                Редактировать осмотр
                                            </button>
                                        </a>   
                                    </div>  
                                </div>
                            </div>

                            <div class="row">
                                <b id="patientName"></b>   
                            </div>

                            <div class="row">
                                <p class="mb-0" id="patientGender"></p>   
                            </div>

                            <div class="row">
                                <p class="mb-1" id="patientBirthday"></p>   
                            </div>

                            <div class="row" id="previousInspectionDateContainer">
                                <p style="color: #8a8aa7;" id="doctor"></p> 
                            </div>
                        </div>

                        <div class="row p-3 mb-2" style="background-color: #f6f6fb;">
                            <div class="container">
                                <h5 class="row text-primary">Жалобы</h3>
                                <p class="row" id="complaints"></p>
                            </div>
                        </div>

                        <div class="row p-3 mb-2" style="background-color: #f6f6fb;">
                            <div class="container">
                                <h5 class="row text-primary">Анамнез</h3>
                                <p class="row" id="anamnesis"></p>
                            </div>
                        </div>

                        <div id="consultationsContainer" class="row p-0">
                        </div>

                        

                        <div class="row p-3 mb-3" style="background-color: #f6f6fb;">
                            <div class="container">
                                <h5 class="row text-primary">Диагнозы</h3>
                                <div class="row mb-2" id="diagnoses"></div>
                                <div class="row p-3">
                                    <div class="form-group mb-3">
                                        <label for="diagnosesSelect" class="form-label text-muted">Болезни</label>
                                        <select class="form-control selectpicker" id="diagnosesSelect" data-live-search="true" title="Не выбрано" size=10 style="width: 200px;"></select>
                                    </div>
                                    <textarea class="form-control " id="disease" rows="1"></textarea>

                                </div>

                                <div class="container mb-3">
                                    <div class="row" style="color: #8a8aa7;">
                                        <p style="">Тип диагноза в осмотре</p>
                                    </div>
                                    <div class="d-flex row">
                                        <div class="d-flex">
                                            <div class="form-check form-check-inline">
                                                <label class="form-check-label" for="inlineRadio1">Основной</label>
                                                <input class="form-check-input" type="radio" name="inlineRadioOptions" checked id="inlineRadio1" value="Main">
                                            </div>
                                            <div class="form-check form-check-inline">
                                                <label class="form-check-label" for="inlineRadio2">Сопутствующий</label>
                                                <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="Concomitant" disabled>
                                            </div>
                                            <div class="form-check form-check-inline">
                                                <label class="form-check-label" for="inlineRadio3">Осложнение</label>
                                                <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio3" value="Complication" disabled>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class=" d-flex flex-column">                            
                                    <button type="button" class="btn btn-primary w-50" id="addDiagnosisButton">
                                        <i class="bi bi-plus"></i>
                                        Добавить диагноз
                                    </button>
                                </div>  
                                </div>
                            </div>
                        </div>

                        <div class="row p-3 mb-2" style="background-color: #f6f6fb;">
                            <div class="container">
                                <h5 class="row text-primary">Рекомендации по лечению</h5>
                                <p class="row" id="treatment"></p>
                            </div>
                        </div>
                        
                        <div class="row p-3 mb-2" style="background-color: #f6f6fb;">
                            <h5 class="row text-primary">Заключение</h3>
                            <div class="row justify-content-between align-items-end mb-1">
                                <div class="col">
                                    <label for="conclusions" class="form-label text-muted">Информация заключения</label>
                                    <select class="form-control selectpicker" id="conclusions">
                                        <option value="Disease">Болезнь</option>
                                        <option value="Recovery">Восстановление</option>
                                        <option value="Death">Смерть</option>
                                    </select>
                                </div>

                                <div class="col" id="nextDateContainer">
                                    <label style="color: #8a8aa7;" for="nextDate" id="nextDateLabel">Дата следующего визита</label>
                                    <input class="form-control" type="date" id="nextDate" required title="Не выбрано">
                                </div>
                            </div>
                        </div>
                        <div class="row text-center mt-2" id="submitMessage"></div>
                        <div class="row p-3">
                            <div class="d-flex justify-content-center">
                                <button type="submit" class="btn btn-primary m-2">
                                        Сохранить осмотр
                                </button>
                                <button type="button" class="btn btn-secondary m-2">
                                        Отмена
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }

    

    async executeViewScript() {
        this.user = await getCurrentUser(localStorage.getItem('token'));
        console.log(this.user.name);
        try {
            const inspection = await getInspectionById(this.currentState.id);
            console.log('Загружен осмотр:', inspection);
            const date = new Date(inspection.date);
            document.getElementById('title').textContent = "Амбулаторный осмотр от " + date.toLocaleDateString() + " - " + date.getHours() + ":" + String(date.getMinutes()).padStart(2,"0");;
            document.getElementById('patientName').textContent = "Пациент: " + inspection.patient.name;
            document.getElementById('patientGender').textContent = "Пол: " + inspection.patient.gender;
            document.getElementById('patientBirthday').textContent = new Date(inspection.patient.birthday).toLocaleDateString();
            document.getElementById('doctor').textContent = "Медицинский работник: " + inspection.doctor.name;
            document.getElementById('complaints').textContent = inspection.complaints;
            document.getElementById('anamnesis').textContent = inspection.anamnesis;
            document.getElementById('treatment').textContent = inspection.treatment;
            
            
            this.renderConsultations(inspection.consultations);
            
        } catch (error) {
            console.error('Ошибка при загрузке данных осмотра:', error);
        }

    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString().slice(0, 5);
    }
    
    // Function to render consultations
    renderConsultations(data) {
        const container = document.getElementById('consultationsContainer');
        container.innerHTML = ''; // Clear existing content
    
        data.forEach(consultation => {
            const { speciality, rootComment, commentsNumber } = consultation;
            const { name: authorName, email } = rootComment.author;
            const modified = rootComment.modifyTime !== rootComment.createTime;
            const replying = false;
            // Create the consultation card
            const card = document.createElement('div');
            card.className = 'container consultation-card mb-3 p-3';
            card.style = 'background-color: #f6f6fb;';
    
            card.innerHTML = `
                <h5 class="text-primary">Консультация</h5>
                <b>Консультант: ${authorName}</b>
                <p>Специализация: ${speciality.name}</p>
                <h5 class="text-primary">Комментарии</h5>
                <div class="ms-3 comments-section">
                    <div class="d-flex flex-sm-column comment border-bottom">
                        <div class="d-flex mb-0">
                            <strong>${authorName}</strong> 
                            <p class="mb-0">(${speciality.name})</p>
                        </div>
                        <p class="ms-2 mb-0">${rootComment.content}</p>
                        <div class="d-flex align-items-center">
                            <p class="mb-0 align-items-center text-center text-secondary">${this.formatDate(rootComment.createTime)}</p>
                            ${modified ? `<span class="text-muted" title="${this.formatDate(rootComment.modifyTime)}">Изменено</span>` : ''}
                            <button class="btn btn-link p-1 toggle-replies">Показать ответы (${commentsNumber-1})</button>
                            <button class="btn btn-link p-1 show-form">Ответить</button>
                            ${this.user.name === rootComment.author.name ? 
                                `<button class="btn btn-warning btn-sm p-1">Редактировать</button>` : 
                                ''}
                        </div>
                        <div class="reply-form" style="display:none;">
                            <textarea class="form-control mb-2 reply-text" placeholder="Введите текст комментария"></textarea>
                            <button class="btn btn-primary submit-reply">Оставить комментарий</button>
                        </div>
                    </div>
                    <div class="replies" style="display:none;"></div>
                </div>
            `;
            
            const toggleRepliesButton = card.querySelector('.toggle-replies');
            toggleRepliesButton.addEventListener('click', (e) => {
                e.preventDefault();
                const button = e.target;
                const replies = card.querySelector('.replies');
                replies.style.display = replies.style.display === 'none' ? 'block' : 'none';
                button.textContent = replies.style.display === 'none' ? `Показать ответы` : 'Скрыть ответы';
            });

            const showFormButton = card.querySelector('.show-form');
            showFormButton.addEventListener('click', (e) => {
                e.preventDefault();
                
                card.appendChild(replyForm);
                const submitReplyButton = card.querySelector('.submit-reply');

                submitReplyButton.addEventListener('click', (e) => {
                    e.preventDefault(); 
                    const button = e.target;
                    const textarea = button.closest('.reply-form').querySelector('.reply-text');
                    const replyText = textarea.value;

                    const reply = document.createElement('div');
                    reply.className = 'd-flex flex-sm-column comment border-bottom reply';
                    reply.innerHTML = `
                        <div class="d-flex mb-0">
                            <strong>${authorName}</strong> 
                            <p class="mb-0">(${speciality.name})</p>
                        </div>
                        <p class="ms-2 mb-0">${replyText}</p>
                        <div class="d-flex align-items-center">
                            <p class="mb-0 align-items-center text-center text-secondary">${this.formatDate(rootComment.createTime)}</p>
                            ${modified ? `<span class="text-muted" title="${this.formatDate(rootComment.modifyTime)}">Изменено</span>` : ''}
                            <button class="btn btn-link p-1 toggle-replies">Показать ответы (${commentsNumber-1})</button>
                            <button class="btn btn-link p-1 show-form">Ответить</button>
                            <button class="btn btn-warning btn-sm p-1">Редактировать</button>
                        </div>
                    `;

                    const replies = button.closest('.consultation-card').querySelector('.replies');
                    replies.appendChild(reply);

                    // Clear the textarea
                    textarea.value = '';
                });
            });
            

            container.appendChild(card);
        });
    }
    
    // Reply form and editing functionality
    
    
    // Render the consultations on page load

    
}    

function showReplyForm(button) {
    
}

function submitReply(button) {
    // Logic for submitting a reply
    
}

function editComment(button) {
    const commentContent = button.closest('.comment').querySelector('p:nth-child(2)');
    const originalText = commentContent.textContent;
    commentContent.innerHTML = `
        <textarea class="form-control mb-2">${originalText}</textarea>
        <button class="btn btn-warning" onclick="saveEdit(this)">Сохранить</button>
    `;
}

function saveEdit(button) {
    const textarea = button.previousElementSibling;
    const updatedText = textarea.value;
    const commentContent = button.closest('.comment').querySelector('p:nth-child(2)');
    commentContent.innerHTML = updatedText + ' <span class="text-muted" title="Изменено только что">Изменено</span>';
}