import AbstractView from "./AbstractView.js";
import { getRootsICD, getPatientById, getPatientInspections, loadSpecialties, getInspectionById, searchInspectionsWithoutChildren, getDiagnosesICD, postInspection } from "../api.js";

export default class extends AbstractView {
    constructor(params) {
        super();
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
                        <h1 class="mb-4">Создание осмотра</h1>
                        <div class="row p-3 mb-3" style="background-color: #f6f6fb;">
                            <div class="row justify-content-between align-items-end mb-1">
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
        console.log(this.currentState.id);
        try {
            const inspection = await getInspectionById(this.currentState.id);
            console.log('Загружен осмотр:', inspection);
        } catch (error) {
            console.error('Ошибка при загрузке данных осмотра:', error);
        }

    }
}    