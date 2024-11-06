import AbstractView from "./AbstractView.js";
import { getConsultationById, postComment, editComment, editInspection, getInspectionById, getPatientInspections, getDiagnosesICD, getCurrentUser } from "../api.js";

export default class extends AbstractView {
    constructor(params) {
        super();
        this.user = null;
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
                                        <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editInspectionModal">
                                            Редактировать осмотр
                                        </button>
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

                        <div id="consultationsContainer" class="row p-0 m-0">
                        </div>

                        

                        <div class="row p-3 mb-3" style="background-color: #f6f6fb;">
                            <div class="container">
                                <h5 class="row text-primary">Диагнозы</h3>
                                <div class="row mb-2" id="diagnoses-container"></div>
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
                            <div class="p-0" id="conclusion">
                                
                            </div>
                        </div>
                        
                    </form>
                </div>
            </div>
            <div class="modal fade" id="editInspectionModal" tabindex="-1" aria-labelledby="editInspectionModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="editInspectionModalLabel">Редактировать осмотр</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="modalForm" class="p-3 m-2">
                            <div class="row p-3 mb-2" style="background-color: #f6f6fb;">
                                <div class="container">
                                    <h5 class="row text-primary">Жалобы</h3>
                                    <textarea class="form-control row" id="complaints" rows="1"></textarea>
                                </div>
                            </div>

                            <div class="row p-3 mb-2" style="background-color: #f6f6fb;">
                                <div class="container">
                                    <h5 class="row text-primary">Анамнез</h3>
                                    <textarea class="form-control row" id="anamnesis" rows="1"></textarea>
                                </div>
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
                                                    <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="Concomitant">
                                                </div>
                                                <div class="form-check form-check-inline">
                                                    <label class="form-check-label" for="inlineRadio3">Осложнение</label>
                                                    <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio3" value="Complication">
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
                                    <h5 class="row text-primary">Рекомендации по лечению</h3>
                                    <textarea class="form-control row" id="treatment" rows="1"></textarea>
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
                            
                        </form>
                    </div>
                    <div class="modal-footer">
                        <div class="text-center mt-2" id="submitMessage"></div>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
                        <button type="button" class="btn btn-primary" id="saveEditedInspection">Сохранить изменения</button>
                    </div>
                    </div>
                </div>
            </div>
        `;
    }

    

    async executeViewScript() {
        this.user = await getCurrentUser(localStorage.getItem('token'));
        console.log(this.user);
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
            
            const modal = document.getElementById('modalForm');
            modal.querySelector('#complaints').textContent = inspection.complaints;
            modal.querySelector('#anamnesis').textContent = inspection.anamnesis;
            modal.querySelector('#treatment').textContent = inspection.treatment;
            
            $('#conclusions').selectpicker('val', inspection.conclusion);
            $('#conclusions').selectpicker('refresh');

            const conclusionsSelect = modal.querySelector('#conclusions');
            const nextDate = modal.querySelector('#nextDate');
            const nextDateLabel = document.getElementById('nextDateLabel');
            const submitMessage = document.getElementById('submitMessage');
            const nextDateContainer = document.getElementById('nextDateContainer');
            const selectedValue = conclusionsSelect.value;
            nextDate.valueAsDate = new Date(inspection.nextVisitDate ? inspection.nextVisitDate : inspection.deathDate);
            
    
            if (selectedValue === 'Disease') {
                nextDateLabel.textContent = 'Дата следующего визита';
                nextDateContainer.style.display = 'block';
            } else if (selectedValue === 'Death') {
                nextDateLabel.textContent = 'Дата и время смерти';
                nextDateContainer.style.display = 'block';
            } else if (selectedValue === 'Recovery') {
                nextDateContainer.style.display = 'none';
            }

            conclusionsSelect.addEventListener('change', () => {
                const selectedValue = conclusionsSelect.value;
    
                if (selectedValue === 'Disease') {
                    nextDateLabel.textContent = 'Дата следующего визита';
                    nextDateContainer.style.display = 'block';
                } else if (selectedValue === 'Death') {
                    nextDateLabel.textContent = 'Дата и время смерти';
                    nextDateContainer.style.display = 'block';
                } else if (selectedValue === 'Recovery') {
                    nextDateContainer.style.display = 'none';
                }
            });   

            const diagnoses = [];
            const consultations = [];
            var itemsDone = 0;
            inspection.consultations.forEach(async (consultationData) => {
                const consultation = await getConsultationById(consultationData.id);
                consultations.push(consultation);
                itemsDone++;
                if(itemsDone === inspection.consultations.length) {
                    console.log(consultations);
                    this.renderConsultations(consultations);
                }
            });

            const diagnosesContainer = document.getElementById('diagnoses-container');
            const diagnosesContainerModal = modal.querySelector('#diagnoses');

            inspection.diagnoses.forEach(diagnosis => {
                const diagnosisElement = document.createElement('div');
                diagnosisElement.className = 'diagnosis-item mb-2';
                diagnosisElement.innerHTML = `
                    <h6>${diagnosis.code} ${diagnosis.name}</h6>
                    <p class="mb-0">Тип в осмотре: ${diagnosis.type} <br> Расшифровка: ${diagnosis.description}</p>
                `
                const newDiagnosis = {
                    icdDiagnosisId: diagnosis.id, 
                    description: diagnosis.description,
                    type: diagnosis.type
                };
                diagnoses.push(newDiagnosis);
                diagnosesContainer.appendChild(diagnosisElement);
            });

            inspection.diagnoses.forEach(diagnosis => {
                const diagnosisElement = document.createElement('div');
                diagnosisElement.className = 'diagnosis-item mb-2';
                diagnosisElement.innerHTML = `
                    <h6>${diagnosis.code} ${diagnosis.name}</h6>
                    <p class="mb-0">Тип в осмотре: ${diagnosis.type} <br> Расшифровка: ${diagnosis.description}</p>
                `
                
                diagnosesContainerModal.appendChild(diagnosisElement);
            });

            const conclusion = document.getElementById('conclusion');
            switch(inspection.conclusion) {
                case 'Recovery':
                    conclusion.innerHTML = `<p><strong>Выздоровление</strong></p>`;
                    break;
                case 'Disease':
                    conclusion.innerHTML = `<p><strong>Болезнь</strong><br> ${this.formatDate(inspection.nextVisitDate)}</p>`;
                    break;
                case 'Death':
                    conclusion.innerHTML = `<p><strong>Смерть</strong><br> ${this.formatDate(inspection.deathDate)}</p>`;
                    break;
                default:
                    conclusion.textContent = inspection.conclusion;
            }

            

            const addDiagnosisButton = document.getElementById('addDiagnosisButton');
            const diseaseTextarea = document.getElementById('disease');
            const diagnosesSelect = document.getElementById('diagnosesSelect');

            try {
                const roots = await getDiagnosesICD();
    
                roots.records.forEach(root => {
                    const option = document.createElement('option');
                    option.setAttribute("data-tokens", root.code)
                    option.setAttribute("class", "icd-option")
                    option.value = root.id + ' ' + root.code + ' ' +  root.name;
                    option.textContent = root.code + ' - ' + root.name;
                    diagnosesSelect.appendChild(option);
                });
                $('.selectpicker').selectpicker('refresh');
            } catch (error) {
                console.error('Ошибка загрузки roots:', error);
            }

            addDiagnosisButton.addEventListener('click', () => {
                const selectedDisease = diagnosesSelect.options[diagnosesSelect.selectedIndex].value;
                const diseaseText = diseaseTextarea.value.trim();
                const diagnosisType = $('input[name=inlineRadioOptions]:checked').val();
    
                if (selectedDisease && diseaseText) {
                    const diagnosisElement = document.createElement('div');
                    diagnosisElement.className = 'diagnosis-item mb-2';
                    diagnosisElement.innerHTML = `
                        <h6>${selectedDisease.split(' ')[1]} ${selectedDisease.split(' ')[2]}</h6>
                        <p>Тип в осмотре: ${diagnosisType} <br> Расшифровка: ${diseaseText}</p>
                    `;
                    diagnosesContainerModal.appendChild(diagnosisElement);
                    const diagnosis = {
                        icdDiagnosisId: selectedDisease.split(' ')[0], 
                        description: diseaseText,
                        type: diagnosisType
                    };
                    diagnoses.push(diagnosis);
    
                    diseaseTextarea.value = '';
                    diagnosesSelect.selectedIndex = -1;
                    $('.selectpicker').selectpicker('refresh');
                    $('input[type="radio"]').prop("disabled", false);
                    
                    console.log('Диагноз добавлен', diagnosis);
                } 
            });

            document.getElementById('saveEditedInspection').addEventListener('click', async (e) => {
                e.preventDefault();
                submitMessage.textContent ='';
    
                const anamnesis = modal.querySelector('#anamnesis').value.trim();
                const complaints = modal.querySelector('#complaints').value.trim();
                const treatment = modal.querySelector('#treatment').value.trim();
    
                if (!anamnesis) {
                    submitMessage.textContent = 'Анамнез не заполнен.';
                    return;
                }
            
                if (!complaints) {
                    submitMessage.textContent = 'Жалобы не заполнены.';
                    return;
                }
            
                if (!treatment) {
                    submitMessage.textContent = 'Рекомендации к лечению не заполнены.';
                    return;
                }
    
                if (diagnoses.length === 0) {
                    submitMessage.textContent = 'Нет Диагноза.';
                    return;
                }
    
                const [existingInspections, paginatioon] = await getPatientInspections(inspection.patient.id, '');
                const hasDeathConclusion = existingInspections.some(inspection => inspection.conclusion === 'Death');
                if (hasDeathConclusion) {
                    submitMessage.textContent = 'У пациента не может быть более одного осмотра с заключением "Смерть".';
                    return;
                }
    
                const inspectionData = {
                    anamnesis: modal.querySelector('#anamnesis').value.trim(),
                    complaints: modal.querySelector('#complaints').value.trim(),
                    treatment: modal.querySelector('#treatment').value.trim(),
                    conclusion: conclusionsSelect.value,
                    nextVisitDate: conclusionsSelect.value !== 'Recovery' ? new Date(modal.querySelector('#nextDate').value).toISOString() : null,
                    deathDate: conclusionsSelect.value === 'Death' ? new Date(modal.querySelector('#nextDate').value).toISOString() : null,
                    diagnoses: diagnoses
                };
                console.log('Inspection created:', inspection);
                const jsonData = JSON.stringify(inspectionData);
    
                try {
                    const result = await editInspection(jsonData, inspection.id);
                    
                    if (result.status === 403) {
                        submitMessage.textContent = "Вы не автор осмотра.";
                        submitMessage.style.color = 'red';
                    }
                    if (result.status === 200) {
                        submitMessage.textContent = "Success";
                        submitMessage.style.color = 'green';
                        window.location.href = "/patients";
                    }
    
                } catch (error) {
                    console.error('Ошибка:', error);
                    submitMessage.textContent = "Произошла ошибка.";
                    submitMessage.style.color = 'red';
                }
    
            });
                        
        } catch (error) {
            console.error('Ошибка при загрузке данных осмотра:', error);
        }

    }

    renderNestedComments(comments) {
        return comments.map(comment => `
            <div class="comment border-bottom mt-2" id="${comment.id}">
                <div class="d-flex mb-0">
                    <strong>${comment.author}</strong>
                </div>
                <div class="comment-content">
                    <p class="ms-2 mb-0">${comment.content}</p>
                </div>
                <div class="d-flex align-items-center">
                    <p class="mb-0 text-secondary">${this.formatDate(comment.createTime)}</p>
                    ${comment.modifiedDate !== comment.createTime ? 
                        `<span class="text-muted ms-2" 
                            title="${this.formatDate(comment.modifiedDate)}">
                            Изменено
                        </span>` : 
                        ''
                    }
                    <button class="btn btn-link p-1 reply-button">Ответить</button>
                    ${this.isCurrentUserAuthor(comment.authorId) ? 
                        `<button class="btn btn-warning btn-sm p-1 edit-comment">
                            Редактировать
                        </button>` : 
                        ''
                    }
                </div>
                <div class="reply-form" style="display:none;">
                    <textarea class="form-control mb-2 reply-text" 
                        placeholder="Введите текст комментария"></textarea>
                    <button class="btn btn-primary submit-reply">
                        Оставить комментарий
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderConsultations(consultations) {
        const consultationsContainer = document.getElementById('consultationsContainer');
        consultationsContainer.innerHTML = consultations.map(consultation => `
            <div class="row p-3 mb-2" style="background-color: #f6f6fb;">
                <div class="container p-0">
                    <div class="consultation-card" id="${consultation.id}">
                        <h5 class="text-primary">Консультация</h5>
                        <div class="mb-2 ">
                            <b class="specialization-text">Требуемый специалист: ${consultation.speciality.name}</b>
                        </div>
                        <div class="comments-section">
                            ${this.renderRootComment(consultation.comments[0], consultation.comments.length - 1)}
                            <div class="nested-comments ms-4" style="display:none;">
                                ${this.renderNestedComments(consultation.comments.slice(1))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    
        this.addEventListeners();
    }

    renderRootComment(rootComment, commentsNumber) {
        if (!rootComment) return '';
        
        const modified = rootComment.modifiedDate && rootComment.modifiedDate !== rootComment.createTime;
        const authorName = rootComment.author;
        
        return `
            <div class="d-flex flex-sm-column comment border-bottom" id="${rootComment.id}">
                <div class="d-flex mb-0">
                    <strong>${authorName}</strong>
                </div>
                <div class="comment-content">
                    <p class="ms-2 mb-0">${rootComment.content}</p>
                </div>
                <div class="d-flex align-items-center">
                    <p class="mb-0 align-items-center text-center text-secondary">
                        ${this.formatDate(rootComment.createTime)}
                    </p>
                    ${modified ? 
                        `<span class="text-muted ms-2" title="${this.formatDate(rootComment.modifiedDate)}">
                            Изменено
                        </span>` : 
                        ''
                    }
                    ${commentsNumber > 0 ? 
                        `<button class="btn btn-link p-1 toggle-replies">
                            Показать ответы (${commentsNumber})
                        </button>` : 
                        ''
                    }
                    <button class="btn btn-link p-1 reply-button">Ответить</button>
                    ${this.isCurrentUserAuthor(rootComment.authorId) ? 
                        `<button class="btn btn-warning btn-sm p-1 edit-comment">
                            Редактировать
                        </button>` : 
                        ''
                    }
                </div>
                <div class="reply-form" style="display:none;">
                    <textarea class="form-control mb-2 reply-text" 
                        placeholder="Введите текст комментария"></textarea>
                    <button class="btn btn-primary submit-reply">
                        Оставить комментарий
                    </button>
                </div>
            </div>
        `;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString().slice(0, 5);
    }

    isCurrentUserAuthor(authorId) {
        return this.user.id === authorId; 
    }

    submitReply = async e => {
        e.preventDefault();
        this.user = await getCurrentUser(localStorage.getItem('token'));
        const replyForm = e.target.closest('.reply-form');
        const replyText = replyForm.querySelector('.reply-text').value;
        const parentComment = e.target.closest('.comment');
        const consultationCard = e.target.closest('.consultation-card');
        const specializationText = consultationCard.querySelector('.specialization-text');

        const consultationId = consultationCard.id;
        const parentCommentId = e.target.closest('.comment').id;
        console.log(specializationText);
        const data = {
            content: replyText,
            parentId: parentCommentId
        };

        const jsonData = JSON.stringify(data);
        

        try {
            const result = await postComment(jsonData, consultationId);

            if (result.status === 404) {
                specializationText.style.color ='red';
            }
            if (result.status === 200) {
                const newCommentHtml = `
                    <div class="comment border-bottom mt-2" id="${result.data}">
                        <div class="d-flex mb-0">
                            <strong>${this.user.name}</strong>
                        </div>
                        <div class="comment-content">
                            <p class="ms-2 mb-0">${replyText}</p>
                        </div>
                        <div class="d-flex align-items-center">
                            <p class="mb-0 text-secondary">${new Date().toLocaleString()}</p>
                            <button class="btn btn-link p-1 reply-button">Ответить</button>
                            <button class="btn btn-warning btn-sm p-1 edit-comment">Редактировать</button>
                        </div>
                        <div class="reply-form" style="display:none;">
                            <textarea class="form-control mb-2 reply-text" placeholder="Введите текст комментария"></textarea>
                            <button class="btn btn-primary submit-reply">Оставить комментарий</button>
                        </div>
                    </div>
                `;
            
                let nestedComments = parentComment.querySelector('.nested-comments');
            
                if (!nestedComments) {
                    nestedComments = document.createElement('div');
                    nestedComments.className = 'nested-comments ms-4';
                    parentComment.appendChild(nestedComments);
                }

                nestedComments.insertAdjacentHTML('beforeend', newCommentHtml);
                
                nestedComments.style.display = 'block';

                const toggleRepliesButton = parentComment.querySelector('.toggle-replies');
                if (toggleRepliesButton) {
                    const currentCount = parseInt(toggleRepliesButton.textContent.match(/\d+/)[0] || '0');
                    toggleRepliesButton.textContent = `Скрыть ответы (${currentCount + 1})`;
                }
                
                replyForm.querySelector('.reply-text').value = '';
                replyForm.style.display = 'none';
                specializationText.style.color = 'black';
                this.addEventListeners();
            }

        } catch (error) {
            specializationText.style.color = "red";
            console.error('Ошибка:', error);
        }

        
    }
    

    addEventListeners = () => {
        document.querySelectorAll('.toggle-replies').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const commentsSection = e.target.closest('.comments-section');
                const nestedComments = commentsSection.querySelector('.nested-comments');
                const isHidden = nestedComments.style.display === 'none';
                nestedComments.style.display = isHidden ? 'block' : 'none';
                e.target.textContent = isHidden ? 'Скрыть ответы' : 
                    `Показать ответы (${this.getCommentsCount(nestedComments)})`;
            });
        });
    
        document.querySelectorAll('.reply-button').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();

                const replyForm = e.target.closest('.comment')
                    .querySelector('.reply-form');
                replyForm.style.display = replyForm.style.display === 'none' ? 
                    'block' : 'none';
            });
        });
    
        document.querySelectorAll('.edit-comment').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const commentContent = e.target.closest('.comment').querySelector('.comment-content');
                const currentText = commentContent.querySelector('p').textContent;
                
                commentContent.innerHTML = `
                    <textarea class="form-control mb-2">${currentText}</textarea>
                    <div class="d-flex">
                        <button class="btn btn-primary me-2 save-edit">Сохранить</button>
                        <button class="btn btn-secondary cancel-edit">Отмена</button>
                    </div>
                `;
    
                const saveButton = commentContent.querySelector('.save-edit');
                const cancelButton = commentContent.querySelector('.cancel-edit');
    
                saveButton.addEventListener('click', this.saveEdit);
                cancelButton.addEventListener('click', this.cancelEdit);
            });
        });

        document.querySelectorAll('.submit-reply').forEach(button => {
            button.addEventListener('click', this.submitReply);
        });
    }

    async saveEdit(e) {
        e.preventDefault();
        const commentContent = e.target.closest('.comment-content');
        const newText = commentContent.querySelector('textarea').value;
        const commentId = e.target.closest('.comment').id;

        const data = {
            content: newText
        };

        const jsonData = JSON.stringify(data);

        try {
            const result = await editComment(jsonData, commentId);

            if (result.status === 200) {
                console.log("Edited comment");
                commentContent.innerHTML = `<p class="ms-2 mb-0">${newText}</p>`;
            }

        } catch (error) {
            console.error('Ошибка:', error);
        }

        
    }

    cancelEdit(e) {
        const commentContent = e.target.closest('.comment-content');
        const originalText = commentContent.querySelector('textarea').value;
        commentContent.innerHTML = `<p class="ms-2 mb-0">${originalText}</p>`;
    }
    
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString();
    }
    
    
    
    getCommentsCount(nestedCommentsElement) {
        return nestedCommentsElement.querySelectorAll('.comment').length;
    }
}