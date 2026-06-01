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
        const filters = [
            { label: 'All', status: 'all' },
            { label: 'Finding Carrier', status: 'finding' },
            { label: 'Dispatched', status: 'dispatched' },
            { label: 'On Its Way', status: 'in-transit' },
            { label: 'Delivered', status: 'delivered' },
        ];
        const group = document.getElementById('filterGroup');
        group.innerHTML = filters.map((f, i) => {
            const isFirst = i === 0;
            const isLast = i === filters.length - 1;
            const isActive = f.status === this.currentFilter;
            const pos = isFirst ? 'seg-start' : isLast ? 'seg-end' : 'seg-mid';
            const check = isActive ? '<span class="material-symbols-outlined seg-check">check</span>' : '';
            return `<button class="seg-btn ${pos}${isActive ? ' active' : ''}" onclick="TableManager.filterByStatus('${f.status}')">${check}${f.label}</button>`;
        }).join('');
    },

    filterByStatus(status) {
        this.currentFilter = status;
        this.filtered = status === 'all'
            ? [...this.vehicles]
            : this.vehicles.filter(v => v.status === status);
        this.renderFilters();
        this.renderCards();
    },

    renderCards() {
        const container = document.getElementById('vehicleTable');
        container.innerHTML = '';

        this.filtered.forEach(vehicle => {
            const statusText = {
                'finding': 'Finding Carrier',
                'dispatched': 'Dispatched',
                'in-transit': 'On Its Way',
                'delivered': 'Delivered'
            }[vehicle.status];

            const etaLabel = vehicle.status === 'delivered' ? 'Delivered' : 'Delivery ETA';

            // CSS-circle stepper matching Figma DS design
            const allDone = vehicle.status === 'delivered';
            const stepperParts = [];
            vehicle.progress.forEach((done, idx) => {
                const active = !done && idx === vehicle.progress.findIndex(p => !p);
                stepperParts.push(`<div class="cs-step ${done ? 'done' : active ? 'active' : ''}"></div>`);
                if (idx < vehicle.progress.length - 1) {
                    stepperParts.push(`<div class="cs-line ${done ? 'done' : ''}"></div>`);
                }
            });
            const stepperHtml = stepperParts.join('');
            const stepperClass = `card-stepper${allDone ? ' all-done' : ''}`;

            // Chips
            const chips = [];
            if (vehicle.origin.includes('3rd')) {
                chips.push('<span class="card-chip chip-info">3rd Party</span>');
            } else if (vehicle.origin.includes('ACV')) {
                chips.push('<span class="card-chip chip-info">ACV In-App</span>');
            } else {
                chips.push(`<span class="card-chip chip-info">${vehicle.origin}</span>`);
            }
            if (vehicle.inoperable) chips.push('<span class="card-chip chip-caution">INOP</span>');
            const chipsHtml = chips.join('');

            const vid = vehicle.id;
            const card = document.createElement('div');
            card.className = 'vehicle-card';
            card.onclick = () => PanelManager.open(vehicle);
            card.innerHTML = `
                <div class="card-col-status card-col-status-${vehicle.status}">
                    <span class="card-status-chip chip-${vehicle.status}">${statusText}</span>
                    <div class="card-eta">
                        <div class="card-eta-label">${etaLabel}</div>
                        <div class="card-eta-date">${vehicle.eta}</div>
                    </div>
                </div>
                <div class="card-col-main">
                    <div class="card-vehicle-block">
                        <div class="card-thumb">
                            <span class="material-symbols-outlined">directions_car</span>
                        </div>
                        <div class="card-info">
                            <div class="card-name">${vehicle.name}</div>
                            <div class="card-vin">${vehicle.vin}</div>
                            <div class="card-meta-row">
                                <span class="card-meta-label">Order ID</span>
                                <span class="card-meta-value">${vehicle.orderId}</span>
                                ${chipsHtml}
                            </div>
                        </div>
                    </div>
                    <div class="card-progress-block">
                        <div class="${stepperClass}">${stepperHtml}</div>
                        <div class="card-addr-row">
                            <span class="card-addr">${vehicle.pickupAddr}</span>
                            <span class="card-addr card-addr-end">${vehicle.deliveryAddr}</span>
                        </div>
                    </div>
                </div>
                <div class="card-col-action">
                    <button class="card-details-btn" onclick="event.stopPropagation(); PanelManager.open(MOCK_VEHICLES.find(function(v){return v.id===${vid}}))">Order details</button>
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
