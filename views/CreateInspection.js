import AbstractView from "./AbstractView.js";
import { getPatientById, getPatientInspections, loadSpecialties, getInspectionById, searchInspectionsWithoutChildren, getDiagnosesICD, postInspection } from "../api.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.currentState = {
            id: localStorage.getItem('currentPatientId'),
            previousId: localStorage.getItem('previousId') || null
        };
    }

    async getHtml() {
        return `

            <div class="container">
                <div class="d-flex justify-content-center mb-3">
                    
                    <form id="createForm" class="row  p-3 w-75 p-3 mb-4">
                        <h1 class="mb-4">Создание осмотра</h1>
                        <div class="row p-3 mb-3" style="background-color: #f6f6fb;">
                            <div class="row justify-content-between align-items-end mb-1">
                                <div class="col">
                                    <h2 id="patientName">
                                    </h2>   
                                </div>

                                <div class="col">
                                    <p class="text-end" id="patientBirthday"></p>
                                </div>
                            </div>

                            <div class="row mb-3">
                                <div class="d-flex">
                                    <div class="form-text">Первичный осмотр</div>
                                    <div class="d-flex flex-row form-check form-switch align-items-center">
                                        <div class="form-text"><input id="inspectionType" class="form-check-input " type="checkbox"></div> 
                                    </div>
                                    <div class="form-text">Повторный осмотр</div>
                                </div>
                            </div>
                            <div class="row mb-2" id="previousInspectionDateContainer">
                                <div class="form-group mb-3">
                                        <label for="previousInspectionsSelect" class="form-label text-muted">Предыдущий осмотр</label>
                                        <select class="form-control selectpicker" id="previousInspectionsSelect" data-live-search="true" title="Не выбрано" ></select>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-5">
                                    <label style="color: #8a8aa7;" for="inspectionDate">Дата осмотра</label>
                                    <input class="form-control" type="date" id="inspectionDate" required>
                                </div>
                            </div>
                        </div>

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
                                <h5 class="row text-primary">Консультации</h3>
                                <div class="row mb-2 check-toggle" id="consultations"></div>
                                <div class="row mb-2">
                                    <div class="d-flex form-check form-switch col-3 align-items-center">
                                        <input class="form-check-input" type="checkbox" id="consultationsCheck">
                                        <label class="form-check-label" for="consultationsCheck">
                                            Требуется консультация
                                        </label>
                                    </div>
                                    <div class="col-9 check-toggle">
                                        <select class="form-control selectpicker" data-live-search=true data-size="10" id="specialization" title="Специализация консультанта">
                                        </select>
                                    </div>
                                </div>
                                <div class="row p-3 check-toggle">
                                    <label style="color: #8a8aa7;" class="form-label" for="comment">Комментарий</label>
                                    <textarea class="form-control row" id="comment" rows="1"></textarea>
                                </div>

                                <div class="row check-toggle">
                                    <div class=" d-flex flex-column">                            
                                    <button type="button" class="btn btn-primary w-50" id="addConsultButton">
                                        <i class="bi bi-plus"></i>
                                        Добавить консультацию
                                    </button>
                                    </div>
                                </div>
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
        
        console.log(this.currentState);
        window.history.replaceState({}, "", "inspection/create");

        var previousInspections = null;
        var diagnoses = [];
        var consultations = [];
        
        const form = document.getElementById('createForm');
        const diagnosesSelect = document.getElementById('diagnosesSelect');
        const specialtySelect = document.getElementById('specialization');
        const conclusionsSelect = document.getElementById('conclusions');
        const previousInspectionsSelect = document.getElementById('previousInspectionsSelect');
        const inspectionTypeCheck = document.getElementById('inspectionType');
        const consultationsCheck = document.getElementById('consultationsCheck');
        const nextDateContainer = document.getElementById('nextDateContainer');
        const previousInspectionDateContainer = document.getElementById('previousInspectionDateContainer');
        const nextDateLabel = document.getElementById('nextDateLabel');
        const submitMessage = document.getElementById('submitMessage');
        const diagnosesContainer = document.getElementById('diagnoses');
        const consultationsContainer = document.getElementById('consultations');
        const addDiagnosisButton = document.getElementById('addDiagnosisButton');
        const addConsultationButton = document.getElementById('addConsultButton');
        const diseaseTextarea = document.getElementById('disease');
        const commentTextarea = document.getElementById('comment');
        submitMessage.style.color = 'red';


        if(consultationsCheck.checked) {
            document.querySelectorAll('.check-toggle').forEach(element => {
                element.style.display = 'block';
            });
        }
        else {
            consultations = [];
            document.querySelectorAll('.check-toggle').forEach(element => {
                element.style.display = 'none';
            });
        }
        
        try {
            previousInspections = await searchInspectionsWithoutChildren(this.currentState.id);
            previousInspections.forEach(inspection => {
                const option = document.createElement('option');
                option.value = inspection.id;
                option.textContent = new Date(inspection.date).toLocaleString() + ' ' + inspection.diagnosis.code + ' - ' + inspection.diagnosis.name;
                previousInspectionsSelect.appendChild(option);
            });
            
        } catch (error) {
            console.error('Ошибка загрузки осмотра:', error);
        }

        if(this.currentState.previousId != 'null') {
            const previousInspection = await getInspectionById(this.currentState.previousId);

            form.inspectionType.checked = true;
            const option = document.createElement('option');
            option.value = this.currentState.previousId;
            option.textContent = new Date(previousInspection.date).toLocaleString() + ' ' + previousInspection.diagnoses[0].code + ' - ' + previousInspection.diagnoses[0].name;
            previousInspectionsSelect.appendChild(option);

            $('#previousInspectionsSelect').selectpicker('val', this.currentState.previousId);
            $('#previousInspectionsSelect').selectpicker('refresh');
            previousInspectionDateContainer.style.display = 'block';
        } else {
            form.inspectionType.checked = false;
            previousInspectionDateContainer.style.display = 'none';
        }

        inspectionTypeCheck.addEventListener('change', () => {
            if(inspectionTypeCheck.checked) {
                previousInspectionDateContainer.style.display = 'block';
            }
            else {
                previousInspectionDateContainer.style.display = 'none';
            }

        });

        consultationsCheck.addEventListener('change', () => {
            if(consultationsCheck.checked) {
                document.querySelectorAll('.check-toggle').forEach(element => {
                    element.style.display = 'block';
                });
            }
            else {
                consultations = [];
                document.querySelectorAll('.check-toggle').forEach(element => {
                    element.style.display = 'none';
                });
            }

        });

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
        
        try {
            const specialties = await loadSpecialties();

            specialties.forEach(specialty => {
                const option = document.createElement('option');
                option.value = specialty.id + ' ' + specialty.name;
                option.textContent = specialty.name;
                specialtySelect.appendChild(option);
            });
            $('.selectpicker').selectpicker('refresh');
        } catch (error) {
            console.error('Ошибка загрузки специальностей:', error);
        }
        $('.selectpicker').selectpicker('refresh');

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

        try {
            const patient = await getPatientById(this.currentState.id);
            document.getElementById('patientName').innerHTML = `
                ${patient.name}
                ${this.getGenderIcon(patient.gender)}
            `
            document.getElementById('patientBirthday').textContent = "Дата рождения: " + new Date(patient.birthday).toLocaleDateString();

        } catch (error) {
            console.error('Ошибка при загрузке данных пользователя:', error);
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
                diagnosesContainer.appendChild(diagnosisElement);
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

        addConsultationButton.addEventListener('click', () => {
            const selectedSpecialty = specialtySelect.options[specialtySelect.selectedIndex].value;
            const comment = commentTextarea.value.trim();

            if (selectedSpecialty && comment) {
                const consultElement = document.createElement('div');
                consultElement.className = 'consult-item mb-2';
                consultElement.textContent = `${selectedSpecialty.value}`;
                consultElement.innerHTML = `
                    <h6>${selectedSpecialty.split(' ')[1]}</h6>
                    <p>Комментарий: ${comment}</p>
                `;
                consultationsContainer.appendChild(consultElement);
                const consultation = {
                    specialityId: selectedSpecialty.split(' ')[0], 
                    comment: {
                        content: comment
                    }
                };
                consultations.push(consultation);
                commentTextarea.value = '';
                specialtySelect.selectedIndex = -1;
                console.log('Консультация добавлена', consultation);
            } 
            $('.selectpicker').selectpicker('refresh');

        });


        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            submitMessage.textContent ='';

            const anamnesis = document.getElementById('anamnesis').value.trim();
            const complaints = document.getElementById('complaints').value.trim();
            const treatment = document.getElementById('treatment').value.trim();

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

            const inspectionDate = new Date(form.inspectionDate.value);
            const today = new Date();
            if (inspectionDate > today) {
                submitMessage.textContent = 'Дата осмотра не может быть в будущем.';
                return;
            }
            console.log(this.currentState.previousId);
            if (form.inspectionType.checked == true) {
                const lastInspectionId = $('#previousInspectionsSelect').val();
                console.log('lastInspectionId: ' + lastInspectionId);
                const lastInspection = await getInspectionById(lastInspectionId);
                const lastInspectionDate =  new Date(lastInspection.date);

                if (lastInspectionDate > inspectionDate) {
                        submitMessage.textContent = 'Осмотр не может быть сделан ранее предыдущего осмотра.';
                        return;
                }
            }

            const [existingInspections, paginatioon] = await getPatientInspections(this.currentState.id, '');
            const hasDeathConclusion = existingInspections.some(inspection => inspection.conclusion === 'Death');
            if (hasDeathConclusion) {
                submitMessage.textContent = 'У пациента не может быть более одного осмотра с заключением "Смерть".';
                return;
            }

            const inspection = {
                date: inspectionDate.toISOString(),
                anamnesis: document.getElementById('anamnesis').value.trim(),
                complaints: document.getElementById('complaints').value.trim(),
                treatment: document.getElementById('treatment').value.trim(),
                conclusion: conclusionsSelect.value,
                nextVisitDate: conclusionsSelect.value !== 'Recovery' ? new Date(document.getElementById('nextDate').value).toISOString() : null,
                deathDate: conclusionsSelect.value === 'Death' ? new Date(document.getElementById('nextDate').value).toISOString() : null,
                previousInspectionId: form.inspectionType.checked ? $('#previousInspectionsSelect').val() : null,
                diagnoses: diagnoses,
                consultations: consultations
            };
            console.log('Inspection created:', inspection);
            const jsonData = JSON.stringify(inspection);

            try {
                const result = await postInspection(jsonData, this.currentState.id);

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

    }

    getGenderIcon(gender) {
        return gender === 'Male' 
            ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-gender-male" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M9.5 2a.5.5 0 0 1 0-1h5a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0V2.707L9.871 6.836a5 5 0 1 1-.707-.707L13.293 2zM6 6a4 4 0 1 0 0 8 4 4 0 0 0 0-8"/></svg>'
            : '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-gender-female" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 1a4 4 0 1 0 0 8 4 4 0 0 0 0-8M3 5a5 5 0 1 1 5.5 4.975V12h2a.5.5 0 0 1 0 1h-2v2.5a.5.5 0 0 1-1 0V13h-2a.5.5 0 0 1 0-1h2V9.975A5 5 0 0 1 3 5"/></svg>';
    }
}    

$(document).ready(function() {
    setTimeout(function() {
        $('#previousInspectionsSelect').selectpicker('val', '1');
        $('#previousInspectionsSelect').selectpicker('refresh');
    }, 500); 
});