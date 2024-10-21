import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    async getHtml() {
        return `

            <div class="container">
                <div class="d-flex justify-content-center mb-3">
                    
                    <form id="sortForm" class="row card p-3 w-75 shadow p-3" style="background-color: #f6f6fb;">
                        <h1 class="mb-4">Пациенты</h1>
                        <div class="row">
                            <h4>Фильтры и сортировка</h4>
                        </div>

                        <div class="row mb-3">
                            <div class="col">
                                <label for="patientName" class="form-label text-muted">Имя</label>
                                <input type="text" class="form-control" id="patientName" placeholder="Имя Иван Иванович">
                            </div>
                            <div class="col">
                                <label for="recordStatus" class="form-label text-muted">Информация заключения</label>
                                <select class="form-select" id="recordStatus">
                                    <option selected>Выберите заключение</option>
                                    <!-- Добавьте опции -->
                                </select>
                            </div>
                        </div>
                        <div class="row mb-3 align-items-center">    
                            <div class="col">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" id="authorizedOnly">
                                    <label class="form-check-label" for="authorizedOnly">
                                        Есть авторизованные визиты
                                    </label>
                                </div>
                            </div>
                            <div class="form-group col">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" id="myPatients">
                                    <label class="form-check-label" for="myPatients">
                                        Мои пациенты
                                    </label>
                                </div>
                            </div>
                            <div class="form-group col">
                                <label for="sortPatients" class="form-label ">Сортировка пациентов</label>
                                <select class="form-select" id="sortPatients">
                                    <option selected>По имени (А-Я)</option>
                                    <option>По имени (Я-А)</option>
                                    <!-- Добавьте опции сортировки -->
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
                    <!-- Карточки пациентов -->
                    <div class="row row-cols-1 row-cols-md-2 g-4">
                        <div class="col">
                            <div class="card">
                                <div class="card-body">
                                    <h5 class="card-title">Камбулатинов Ильдар Александрович</h5>
                                    <p class="card-text">Email: il@1919@mail.ru</p>
                                    <p class="card-text">Пол: Мужчина</p>
                                    <p class="card-text">Дата рождения: 26.02.1901</p>
                                </div>
                            </div>
                        </div>
                        <!-- Повторите карточку для остальных пациентов -->
                        <div class="col">
                            <div class="card">
                                <div class="card-body">
                                    <h5 class="card-title">Камбулатинов Ильдар Александрович</h5>
                                    <p class="card-text">Email: il@1919@mail.ru</p>
                                    <p class="card-text">Пол: Мужчина</p>
                                    <p class="card-text">Дата рождения: 26.02.1901</p>
                                </div>
                            </div>
                        </div>
                        <!-- Карточки будут автоматически распределяться в 2 колонки на больших экранах -->
                    </div>

                    <!-- Пагинация -->
                    <nav aria-label="Page navigation">
                        <ul class="pagination justify-content-center mt-4">
                            <li class="page-item disabled">
                                <a class="page-link" href="#" tabindex="-1" aria-disabled="true">Предыдущая</a>
                            </li>
                            <li class="page-item"><a class="page-link" href="#">1</a></li>
                            <li class="page-item"><a class="page-link" href="#">2</a></li>
                            <li class="page-item"><a class="page-link" href="#">3</a></li>
                            <li class="page-item"><a class="page-link" href="#">4</a></li>
                            <li class="page-item"><a class="page-link" href="#">5</a></li>
                            <li class="page-item">
                                <a class="page-link" href="#">Следующая</a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        `;
    }

    async executeViewScript() {
        console.log("PatientsView script executed.");
    }
}