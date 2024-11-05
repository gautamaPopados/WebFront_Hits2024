import AbstractView from "./AbstractView.js";
import { getInspectionChain, getPatientById, getInspections, getPatients, getRootsICD, registerPatient } from "../api.js";

export default class extends AbstractView {
    constructor() {
        super();
    }

    async getHtml() {
        return `
            <div class="container mt-5">
                <h2>Статистика осмотров</h2>
                <form id="reportForm" class="border p-4 rounded mb-4">
                    <div class="form-row">
                        <div class="form-group col-md-3">
                            <label for="dateFrom">Дата с</label>
                            <input type="date" class="form-control" id="dateFrom">
                        </div>
                        <div class="form-group col-md-3">
                            <label for="dateTo">Дата по</label>
                            <input type="date" class="form-control" id="dateTo">
                        </div>
                        <div class="form-group col-md-3">
                            <label for="roots" class="form-label text-muted">МКБ-10</label>
                            <select class="form-control selectpicker" multiple id="roots" data-live-search="true" title="Не выбрано" size=10 style="width: 200px;">
                            </select>
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
            const dateFrom = document.getElementById("dateFrom").value;
            const dateTo = document.getElementById("dateTo").value;
            const mkb10Codes = $('#roots').val();

        });
    }
}


