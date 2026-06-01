const TableManager = {
    vehicles: [],
    filtered: [],
    currentFilter: 'all',

    init() {
        this.vehicles = MOCK_VEHICLES;
        this.filtered = [...this.vehicles];
        this.renderFilters();
        this.renderCards();
        this.attachEventListeners();
    },

    renderFilters() {
        const stats = getStats();
        const filters = [
            { label: 'All', status: 'all', count: this.vehicles.length },
            { label: 'Finding Carrier', status: 'finding', count: stats['finding'] },
            { label: 'Dispatched', status: 'dispatched', count: stats['dispatched'] },
            { label: 'In Transit', status: 'in-transit', count: stats['in-transit'] },
            { label: 'Delivered', status: 'delivered', count: stats['delivered'] },
        ];
        const group = document.getElementById('filterGroup');
        group.innerHTML = filters.map(f => {
            const active = f.status === 'all' ? 'active' : '';
            return `<button class="filter-btn ${active}" onclick="TableManager.filterByStatus('${f.status}')">
                ${f.label} <span class="filter-count">${f.count}</span>
            </button>`;
        }).join('');
    },

    filterByStatus(status) {
        this.currentFilter = status;
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        event.target.closest('.filter-btn').classList.add('active');
        this.filtered = status === 'all'
            ? [...this.vehicles]
            : this.vehicles.filter(v => v.status === status);
        this.renderCards();
    },

    renderCards() {
        const container = document.getElementById('vehicleTable');
        container.innerHTML = '';

        this.filtered.forEach(vehicle => {
            const statusText = {
                'finding': 'Finding Carrier',
                'dispatched': 'Dispatched',
                'in-transit': 'In Transit',
                'delivered': 'Delivered'
            }[vehicle.status];

            const stages = ['Finding', 'Dispatched', 'In Transit', 'Delivered'];

            const stepperHtml = stages.map((label, idx) => {
                const completed = vehicle.progress[idx];
                const active = !completed && idx === vehicle.progress.findIndex(p => !p);
                return `
                    <div class="stepper-compact-item ${completed ? 'completed' : ''} ${active ? 'active' : ''}">
                        <div class="stepper-compact-dot">
                            <span class="material-symbols-outlined">${completed ? 'check' : active ? 'radio_button_checked' : 'radio_button_unchecked'}</span>
                        </div>
                        <div class="stepper-compact-label">${label}</div>
                    </div>`;
            }).join('');

            const badgesHtml = [
                vehicle.inoperable ? '<span class="badge inoperable">Inoperable</span>' : '',
                vehicle.origin.includes('3rd') ? '<span class="badge third-party">3rd Party</span>' : ''
            ].filter(Boolean).join('');

            const card = document.createElement('div');
            card.className = 'vehicle-card';
            card.onclick = () => PanelManager.open(vehicle);
            card.innerHTML = `
                <div class="vehicle-card-left">
                    <div class="vehicle-thumb">
                        <span class="material-symbols-outlined">directions_car</span>
                    </div>
                    <div class="vehicle-card-info">
                        <div class="vehicle-card-name">${vehicle.name}</div>
                        <div class="vehicle-card-vin">${vehicle.vin}</div>
                        ${badgesHtml ? `<div class="vehicle-badges">${badgesHtml}</div>` : ''}
                    </div>
                </div>
                <div class="vehicle-card-center">
                    <div class="stepper-compact">${stepperHtml}</div>
                </div>
                <div class="vehicle-card-right">
                    <span class="status-badge status-${vehicle.status}">${statusText}</span>
                    <div class="eta-block">
                        <div class="eta-label">Delivery ETA</div>
                        <div class="eta-value">${vehicle.eta}</div>
                    </div>
                    <span class="material-symbols-outlined card-chevron">chevron_right</span>
                </div>
            `;
            container.appendChild(card);
        });

        document.getElementById('paginationInfo').textContent =
            `${this.filtered.length} of ${this.vehicles.length} orders`;
    },

    attachEventListeners() {
        document.getElementById('searchInput').addEventListener('input', (e) => {
            const q = e.target.value.toLowerCase();
            this.filtered = this.vehicles.filter(v =>
                v.vin.toLowerCase().includes(q) ||
                v.orderId.toLowerCase().includes(q) ||
                v.auctionId.toLowerCase().includes(q)
            );
            this.renderCards();
        });
    }
};
