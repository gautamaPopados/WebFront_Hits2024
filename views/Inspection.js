import AbstractView from "./AbstractView.js";
import { getConsultationById, getPatientById, getPatientInspections, loadSpecialties, getInspectionById, searchInspectionsWithoutChildren, getDiagnosesICD, postInspection, getCurrentUser } from "../api.js";

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
                        
        } catch (error) {
            console.error('Ошибка при загрузке данных осмотра:', error);
        }

    }

    renderNestedComments(comments) {
        return comments.map(comment => `
            <div class="comment border-bottom mt-2">
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
                <div class="container">
                    <div class="consultation-card" id="consultation-${consultation.id}">
                        <h5 class="text-primary">Консультация</h5>
                        <div class="mb-2">
                            <b>Требуемый специалист: ${consultation.speciality.name}</b>
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
    
        // Добавляем обработчики событий после рендеринга
        this.addEventListeners();
    }

    renderRootComment(rootComment, commentsNumber) {
        if (!rootComment) return '';
        
        const modified = rootComment.modifiedDate && rootComment.modifiedDate !== rootComment.createTime;
        const authorName = rootComment.author;
        
        return `
            <div class="d-flex flex-sm-column comment border-bottom">
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

        const parentCommentId = e.target.closest('.comment').id.split('-')[1];
    
        // Здесь должен быть код для отправки нового комментария на сервер
        // Например: postNewComment(parentCommentId, replyText);
    
        // После успешной отправки, добавляем новый комментарий в DOM
        const newCommentHtml = `
            <div class="comment border-bottom mt-2">
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
    
        // Если .nested-comments не существует, создаем его
        if (!nestedComments) {
            nestedComments = document.createElement('div');
            nestedComments.className = 'nested-comments ms-4';
            parentComment.appendChild(nestedComments);
        }

        // Добавляем новый комментарий
        nestedComments.insertAdjacentHTML('beforeend', newCommentHtml);
        
        // Показываем .nested-comments, если он был скрыт
        nestedComments.style.display = 'block';

        // Обновляем счетчик ответов, если он существует
        const toggleRepliesButton = parentComment.querySelector('.toggle-replies');
        if (toggleRepliesButton) {
            const currentCount = parseInt(toggleRepliesButton.textContent.match(/\d+/)[0] || '0');
            toggleRepliesButton.textContent = `Скрыть ответы (${currentCount + 1})`;
        }
        
        // Очищаем и скрываем форму ответа
        replyForm.querySelector('.reply-text').value = '';
        replyForm.style.display = 'none';
    
        // Обновляем обработчики событий для нового комментария
        this.addEventListeners();
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
    
                // Добавляем обработчики для кнопок сохранения и отмены редактирования
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

    // Функция для сохранения отредактированного комментария
    saveEdit(e) {
        const commentContent = e.target.closest('.comment-content');
        const newText = commentContent.querySelector('textarea').value;
        const commentId = e.target.closest('.comment').id.split('-')[1];

        // Здесь должен быть код для отправки отредактированного комментария на сервер
        // Например: updateComment(commentId, newText);

        commentContent.innerHTML = `<p class="ms-2 mb-0">${newText}</p>`;
    }

// Функция для отмены редактирования
    cancelEdit(e) {
        const commentContent = e.target.closest('.comment-content');
        const originalText = commentContent.querySelector('textarea').value;
        commentContent.innerHTML = `<p class="ms-2 mb-0">${originalText}</p>`;
    }
    
    // Вспомогательные функции
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString();
    }
    
    
    
    getCommentsCount(nestedCommentsElement) {
        return nestedCommentsElement.querySelectorAll('.comment').length;
    }


    // updateConsultationsList(consultations) {
    //     const consultationsContainer = document.getElementById('consultationsContainer');
    //     consultationsContainer.innerHTML = '';


    //     consultations.forEach((consultationData) => {
    //         const consultation = await getConsultationById(consultationData.id);
    //         const parentElement = document.createElement('div');
    //         const chainElements = [];
    //         const hasChain = consultation.chain && consultation.chain.length > 0;
    //         var margin = ``;
                
    //         if (hasChain) {
    //             consultation.chain.forEach((chainItem, index) => {
    //                 const container = document.createElement('div');
    //                 const row = document.createElement('div');
    //                 const chain = document.createElement('span');
    //                 row.classList.add('row');
    //                 container.classList.add('container', 'chain-element');
    //                 container.style.display = 'none';
    //                 chain.classList.add('col-1','border', 'border-3', 'border-end-0', 'border-top-0', 'm-2');
    //                 chain.style.height = "50px";
    //                 chain.style.width = "10px";
    //                 const chainElement = document.createElement('div');
    //                 chainElement.classList.add('col','card', 'p-3', 'shadow-sm', 'mt-3');
                    
    //                 if (index < 3) {
    //                     margin =  `${(index+1) * 50}px`;
    //                     row.style.marginLeft = margin;
    //                 } else {
    //                     row.style.marginLeft = margin;
    //                 }

    //                 console.log(chainItem);
    //                 chainElement.innerHTML = `
    //                     <div class="d-flex justify-content-between align-items-start">
    //                         <div>
    //                             <span class="badge bg-secondary mb-2">${new Date(chainItem.date).toLocaleDateString()}</span>
    //                             <h5 class="mb-1">Амбулаторный осмотр</h5>
    //                         </div>
    //                         <div>
    //                             <a href="/inspection/create" class="append-button">
    //                                 <i class="bi bi-pencil-square"></i> Добавить осмотр
    //                             </a>
    //                             <a href="/inspection/${chainItem.id}" class="text-decoration-none">
    //                                 <i class="bi bi-search"></i> Детали осмотра
    //                             </a>
    //                         </div>
    //                     </div>
    //                     <p class="mb-1"><strong>Заключение: </strong>${chainItem.conclusion}</p>
    //                     <p class="mb-1"><strong>Основной диагноз:</strong> ${chainItem.diagnosis.name} </p>
    //                     <p class="text-muted mb-0">Медицинский работник: ${chainItem.doctor}</p>
    //                 `;
    //                 row.innerHTML += chain.outerHTML;
    //                 row.innerHTML += chainElement.outerHTML;
    //                 container.innerHTML += row.outerHTML;
    //                 chainElements.push(container);
    //                 const addInspectionButton = parentElement.querySelector('.append-button');
    //                 addInspectionButton.addEventListener('click', (e) => {
    //                     localStorage.setItem('currentPatientId', this.currentState.id);
    //                     localStorage.setItem('previousId', chainItem.id);
    //                 });
    //             });
    //         }
    
    //         parentElement.innerHTML = `
    //             <div class="container mt-4">
    //                 <div class="card p-3 shadow-sm" style="background-color: ${consultation.conclusion == "Death" ? "#ffefe8" : "#f6f6fb"} ; ">
    //                     <div class="d-flex justify-content-between align-items-start">
    //                         <div>
    //                             <i class="bi bi-plus-square-fill toggle-icon" style = "display: ${hasChain == true ? "inline-block" : "none"}"></i>
    //                             <span class="badge bg-secondary mb-2">${new Date(consultation.date).toLocaleDateString()}</span>
    //                             <h5 class="mb-1">Амбулаторный осмотр</h5>
    //                         </div>
    //                         <div>
    //                             <a href="/inspection/create"  class="text-decoration-none append-button-main" style = "display: ${consultation.hasNested == true ? "none" : "inline-block"}">
    //                                 <i class="bi bi-pencil-square"></i> Добавить осмотр
    //                             </a>
    //                             <a href="/inspection/${consultation.id}" class="text-decoration-none">
    //                                 <i class="bi bi-search"></i> Детали осмотра
    //                             </a>
    //                         </div>
    //                     </div>
    //                     <p class="mb-1"><strong>Заключение: </strong>${consultation.conclusion}</p>
    //                     <p class="mb-1"><strong>Основной диагноз:</strong> ${consultation.diagnosis.name} (${consultation.diagnosis.code})</p>
    //                     <p class="text-muted mb-0">Медицинский работник: ${consultation.doctor}</p>
    //                 </div>
                
    //         `;

            
            
    //         chainElements.forEach(chainElement => parentElement.append(chainElement));
    //         parentElement.innerHTML += `</div>`;
    //         consultationsContainer.appendChild(parentElement);
            
    //         const addInspectionButton = parentElement.querySelector('.append-button-main');
    //         addInspectionButton.addEventListener('click', (e) => {
    //             localStorage.setItem('currentPatientId', this.currentState.id)
    //             localStorage.setItem('previousId', consultation.id)
    //         });

    //         const toggleIcon = parentElement.querySelector('.toggle-icon');
    //         toggleIcon.addEventListener('click', (e) => {
    //             e.stopPropagation();
    //             this.toggleChainElements(parentElement); 
    //             toggleIcon.classList.toggle('bi-plus-square-fill'); 
    //             toggleIcon.classList.toggle('bi-dash-square-fill');
    //         });
    //     });
    // }

    
}    



// Функция для рендеринга корневого комментария


// Функция для рендеринга вложенных комментариев


// Функция добавления обработчиков событий


// <h5 class="text-primary">Консультация</h5>
//                 <b>Консультант: ${authorName}</b>
//                 <p>Специализация: ${speciality.name}</p>
//                 <h5 class="text-primary">Комментарии</h5>
//                 <div class="ms-3 comments-section">
//                     <div class="d-flex flex-sm-column comment border-bottom">
//                         <div class="d-flex mb-0">
//                             <strong>${authorName}</strong> 
//                             <p class="mb-0">(${speciality.name})</p>
//                         </div>
//                         <p class="ms-2 mb-0">${rootComment.content}</p>
//                         <div class="d-flex align-items-center">
//                             <p class="mb-0 align-items-center text-center text-secondary">${this.formatDate(rootComment.createTime)}</p>
//                             ${modified ? `<span class="text-muted" title="${this.formatDate(rootComment.modifyTime)}">Изменено</span>` : ''}
//                             <button class="btn btn-link p-1 toggle-replies">Показать ответы (${commentsNumber})</button>
//                             <button class="btn btn-link p-1 show-form">Ответить</button>
//                             ${this.user.name === rootComment.author.name ? 
//                                 `<button class="btn btn-warning btn-sm p-1">Редактировать</button>` : 
//                                 ''}
//                         </div>
//                         <div class="reply-form" style="display:none;">
//                             <textarea class="form-control mb-2 reply-text" placeholder="Введите текст комментария"></textarea>
//                             <button class="btn btn-primary submit-reply">Оставить комментарий</button>
//                         </div>
//                     </div>
//                     <div class="replies" style="display:none;"></div>
//                 </div>