import { getCurrentUser , updateUser  } from "../api.js"; // Импортируем необходимые функции
import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    async getHtml() {
        return `
             <div class="container main-content">
                <div class="topper"> 
                    <h1>Пациенты</h1>
                    <button class="btn btn-primary">Регистрация нового пациента</button>
                </div>
                
                 <div class="filters">
                    <div class="row">
                        <div class="col">
                            <label for="patients-name">Сортировка пациентов</label>
                            <input id="patients-name"type="text" placeholder="Имя">
                        </div>
                        <div class="col">
                            <label for="select-statement">Имеющиеся заключения</label>
                            <select id="select-statement" placeholder="Имя">
                            </select>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col form-check">
                            <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                            <label class="form-check-label" for="flexCheckDefault">
                                Есть запланированные визиты
                            </label>
                        </div>
                        <div class="col form-check">
                            <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked" checked>
                            <label class="form-check-label" for="flexCheckChecked">
                                Мои пациенты
                            </label>
                        </div>

                        <div class="col">
                            <label for="select-sort">Сортировка пациентов</label>
                            <select id="select-sort">
                                <option>По имени (А-Я)</option>
                                <option>По имени (Я-А)</option>
                            </select>
                        </div>
                        
                    </div>
                    <div class="row">
                        <div class="col">
                            <button class="btn btn-primary">Поиск</button>
                        </div>
                    </div>
                </div>

                <!-- Список пациентов -->
                <div class="patients-list">
                    <div class="patient-card">
                        <p>Кашафутдинов Ильдар Александрович</p>
                        <p>Email: ildar1991@mail.ru</p>
                        <p>Пол: Мужчина</p>
                        <p>Дата рождения: 26.02.1991</p>
                    </div>
                    <div class="patient-card">
                        <p>Кашафутдинов Ильдар Александрович</p>
                        <p>Email: ildar1991@mail.ru</p>
                        <p>Пол: Мужчина</p>
                        <p>Дата рождения: 26.02.1991</p>
                    </div>
                    <div class="patient-card">
                        <p>Кашафутдинов Ильдар Александрович</p>
                        <p>Email: ildar1991@mail.ru</p>
                        <p>Пол: Мужчина</p>
                        <p>Дата рождения: 26.02.1991</p>
                    </div>
                    <div class="patient-card">
                        <p>Кашафутдинов Ильдар Александрович</p>
                        <p>Email: ildar1991@mail.ru</p>
                        <p>Пол: Мужчина</p>
                        <p>Дата рождения: 26.02.1991</p>
                    </div>
                </div>

                <!-- Список пациентов -->
                <div class="patients-list">
                    <div class="patient-card">
                        <p>Кашафутдинов Ильдар Александрович</p>
                        <p>Email: ildar1991@mail.ru</p>
                        <p>Пол: Мужчина</p>
                        <p>Дата рождения: 26.02.1991</p>
                    </div>
                    <div class="patient-card">
                        <p>Кашафутдинов Ильдар Александрович</p>
                        <p>Email: ildar1991@mail.ru</p>
                        <p>Пол: Мужчина</p>
                        <p>Дата рождения: 26.02.1991</p>
                    </div>
                    <div class="patient-card">
                        <p>Кашафутдинов Ильдар Александрович</p>
                        <p>Email: ildar1991@mail.ru</p>
                        <p>Пол: Мужчина</p>
                        <p>Дата рождения: 26.02.1991</p>
                    </div>
                    <div class="patient-card">
                        <p>Кашафутдинов Ильдар Александрович</p>
                        <p>Email: ildar1991@mail.ru</p>
                        <p>Пол: Мужчина</p>
                        <p>Дата рождения: 26.02.1991</p>
                    </div>
                </div>

                <!-- Пагинация -->
                <div class="pagination">
                    <button>&laquo;</button>
                    <button>1</button>
                    <button>2</button>
                    <button>3</button>
                    <button>4</button>
                    <button>5</button>
                    <button>&raquo;</button>
                </div>
            </div>
        `;
    }

    async executeViewScript() {
        console.log("PatientsView script executed.");
    }
}