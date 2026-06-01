// Table Manager - handles vehicle list, filtering, search, and stats
const TableManager = {
    vehicles: [],
    filtered: [],
    currentFilter: 'all',

    init() {
        this.vehicles = MOCK_VEHICLES;
        this.filtered = [...this.vehicles];
        this.renderStats();
        this.renderFilters();
        this.renderTable();
        this.attachEventListeners();
    },

    renderStats() {
        const stats = getStats();
        const statsHtml = `
            <div class="stat-card">
                <div class="stat-label">In Transit</div>
                <div class="stat-value">${stats['in-transit']}</div>
                <div class="stat-trend">↑ 2 today</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Dispatched</div>
                <div class="stat-value">${stats['dispatched']}</div>
                <div class="stat-trend">3 awaiting pickup</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Delivered</div>
                <div class="stat-value">${stats['delivered']}</div>
                <div class="stat-trend">This month</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Finding Carrier</div>
                <div class="stat-value">${stats['finding']}</div>
                <div class="stat-trend">Avg 1-2 days</div>
            </div>
        `;
        document.getElementById('statsGrid').innerHTML = statsHtml;
    },

    renderFilters() {
        const filters = ['All', 'Finding Carrier', 'Dispatched', 'In Transit', 'Delivered'];
        const statuses = ['all', 'finding', 'dispatched', 'in-transit', 'delivered'];
        const group = document.getElementById('filterGroup');

        group.innerHTML = filters.map((label, idx) => {
            const status = statuses[idx];
            const active = status === 'all' ? 'active' : '';
            return `<button class="filter-btn ${active}" onclick="TableManager.filterByStatus('${status}')">${label}</button>`;
        }).join('');
    },

    filterByStatus(status) {
        this.currentFilter = status;

        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');

        if (status === 'all') {
            this.filtered = [...this.vehicles];
        } else {
            this.filtered = this.vehicles.filter(v => v.status === status);
        }

        this.renderTable();
    },

    renderTable() {
        const tbody = document.getElementById('vehicleTable');
        tbody.innerHTML = '';

        this.filtered.forEach(vehicle => {
            const statusClass = `status-${vehicle.status}`;
            const statusText = vehicle.status
                .split('-')
                .map(w => w.charAt(0).toUpperCase() + w.slice(1))
                .join(' ');

            const badgesHtml = [
                vehicle.inoperable ? '<span class="badge inoperable">Inoperable</span>' : '',
                vehicle.origin.includes('3rd') ? '<span class="badge third-party">3rd Party</span>' : ''
            ].filter(Boolean).join('');

            const row = document.createElement('tr');
            row.onclick = () => ModalManager.open(vehicle);
            row.innerHTML = `
                <td>
                    <div class="vehicle-cell">
                        <div class="vehicle-image">${vehicle.image}</div>
                        <div class="vehicle-info">
                            <h4>${vehicle.name}</h4>
                            <p>${vehicle.vin}</p>
                            <div class="vehicle-badges">
                                ${badgesHtml}
                            </div>
                        </div>
                    </div>
                </td>
                <td style="text-align: center;">
                    <div class="status-stepper">
                        ${vehicle.progress.map((completed, idx) => {
                            const isActive = !completed && idx === vehicle.progress.findIndex(p => !p);
                            return `<div class="stepper-step ${completed ? 'completed' : ''} ${isActive ? 'active' : ''}"></div>`;
                        }).join('')}
                    </div>
                </td>
                <td>
                    <div class="eta-cell">
                        <div class="eta-date">${vehicle.eta}</div>
                        <div class="eta-range">${vehicle.etaRange}</div>
                        ${vehicle.status === 'finding' ? '<div class="eta-confidence">⚠ Est. 1-2 days</div>' : ''}
                    </div>
                </td>
                <td>
                    <span class="status-badge ${statusClass}">${statusText}</span>
                </td>
                <td style="text-align: center;">
                    <span class="cta-link">View Details →</span>
                </td>
            `;
            tbody.appendChild(row);
        });

        document.getElementById('paginationInfo').textContent =
            `Viewing ${Math.min(this.filtered.length, 100)} out of ${this.vehicles.length} results`;
    },

    attachEventListeners() {
        document.getElementById('searchInput').addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            this.filtered = this.vehicles.filter(v =>
                v.vin.toLowerCase().includes(query) ||
                v.orderId.toLowerCase().includes(query) ||
                v.auctionId.toLowerCase().includes(query)
            );
            this.renderTable();
        });
    }
};
