import AbstractView from "./AbstractView.js";
import {getReport, getRootsICD } from "../api.js";

export default class extends AbstractView {
    constructor() {
        super();
    }

    async getHtml() {
        return `
            <div class="container mt-5">
                <h2>Статистика осмотров</h2>
                <form id="reportForm" class="border p-4 rounded mb-4" style="background-color: #f6f6fb;">
                    <div class="form">
                        <div class="row">
                            <div class="form-group col-md-3">
                                <label for="dateFrom">Дата с</label>
                                <input type="date" class="form-control" id="dateFrom" required>
                            </div>
                            <div class="form-group col-md-3">
                                <label for="dateTo">Дата по</label>
                                <input type="date" class="form-control" id="dateTo" required>
                            </div>
                            <div class="form-group col-md-3">
                                <label for="roots" class="form-label text-muted">МКБ-10</label>
                                <select class="form-control selectpicker" multiple id="roots" data-live-search="true" title="Не выбрано" size=10 style="width: 200px;">
                                </select>
                            </div>
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary">Сохранить сводку</button>
                </form>

                <div id="reportTableContainer">
                </div>
            </div>
          
        `;
    }

    async executeViewScript() {
        const form = document.getElementById('reportForm');
        const rootsSelect = document.getElementById('roots');

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

            
            const start = document.getElementById("dateFrom").value;
            const end = document.getElementById("dateTo").value;
            const icdRoots = Array.from(form.roots.selectedOptions).map(opt => opt.value)
            const params = {
                start: start,
                end: end,
                icdRoots: icdRoots
            };

            const [filters, records, summaryByRoot] = await getReport(buildQueryString(params));

            const reportTableContainer = document.getElementById('reportTableContainer');
            reportTableContainer.innerHTML = '';

            const table = document.createElement('table');
            table.classList.add('table', 'table-bordered', 'table-striped');
            const thead = document.createElement('thead');
            const tr = document.createElement('tr');

            thead.appendChild(tr);
            table.appendChild(thead);

            const nameTh = document.createElement('th');
            const dobTh = document.createElement('th');
            const genderTh = document.createElement('th');
            nameTh.textContent = 'Имя';
            dobTh.textContent = 'Дата рождения';
            genderTh.textContent = 'Пол';
            tr.append(nameTh, dobTh, genderTh, dobTh);    

            filters.icdRoots.forEach(root => {
                const th = document.createElement('th');
                th.textContent = root;
                tr.append(th);
            });

            const tbody = document.createElement('tbody');
            records.forEach(record => {
                const tr = document.createElement('tr');
                const nameTd = document.createElement('td');
                const dobTd = document.createElement('td');
                const genderTd = document.createElement('td');

                nameTd.textContent = record.patientName;
                dobTd.textContent = new Date(record.patientBirthdate).toLocaleDateString();
                genderTd.textContent = record.gender;
                tr.append(nameTd, genderTd, dobTd);

                filters.icdRoots.forEach(root => {
                    const countTd = document.createElement('td');
                    countTd.textContent = (record.visitsByRoot[root]) ? record.visitsByRoot[root] : 0;
                    tr.append(countTd);
                });
                tbody.appendChild(tr);
            });

            const sumTr = document.createElement('tr');
            const nameTd = document.createElement('td')
            nameTd.setAttribute('colspan', '3');
            nameTd.textContent = "Итого";
            sumTr.append(nameTd);

            filters.icdRoots.forEach(root => {
                const countTd = document.createElement('td');
                countTd.textContent = (summaryByRoot[root]) ? summaryByRoot[root] : 0;
                sumTr.append(countTd);
            });

            tbody.appendChild(sumTr);
            table.appendChild(tbody);
            reportTableContainer.appendChild(table);

        });
    }
}

function buildQueryString(params) {
    const queryParams = new URLSearchParams();
    console.log(params);
    if (params.icdRoots?.length) queryParams.append('icdRoots', params.icdRoots.join(','));
    queryParams.append('start', params.start);
    queryParams.append('end', params.end);
    
    return queryParams;
}

