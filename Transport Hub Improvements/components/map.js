const MapManager = {
    isOpen: false,

    // Simulated US map positions (x%, y%) per vehicle id
    // Approximates real geography on a lower-48 US map viewport
    positions: {
        1: { x: 71, y: 29 },  // in-transit, between Buffalo NY and Chicago IL
        2: { x: 48, y: 68 },  // dispatched at pickup, Hondo TX (near San Antonio)
        3: { x: 83, y: 26 },  // dispatched at pickup, Buffalo NY
        4: { x: 50, y: 73 },  // finding carrier, Ecleto TX (near Corpus Christi)
        5: { x: 79, y: 55 },  // delivered, Charlotte NC
    },

    toggle() {
        this.isOpen ? this.close() : this.open();
    },

    open() {
        this.isOpen = true;
        document.getElementById('contentArea').classList.add('split-view');
        document.getElementById('fleetMapPanel').classList.add('active');
        document.getElementById('mapToggleBtn').classList.add('active');
        this.render();
    },

    close() {
        this.isOpen = false;
        document.getElementById('contentArea').classList.remove('split-view');
        document.getElementById('fleetMapPanel').classList.remove('active');
        document.getElementById('mapToggleBtn').classList.remove('active');
    },

    render() {
        const map = document.getElementById('fleetMap');
        const statusLabels = {
            'finding': 'Finding Carrier',
            'dispatched': 'Dispatched',
            'in-transit': 'In Transit',
            'delivered': 'Delivered'
        };

        map.innerHTML = MOCK_VEHICLES.map(v => {
            const pos = this.positions[v.id] || { x: 50, y: 50 };
            const label = statusLabels[v.status] || v.status;
            const vid = v.id;
            return `
                <div class="fleet-marker status-${v.status}"
                     style="left: ${pos.x}%; top: ${pos.y}%"
                     onclick="PanelManager.open(MOCK_VEHICLES.find(function(x){return x.id===${vid}}))">
                    <div class="fleet-marker-pip"></div>
                    <div class="fleet-marker-tooltip">
                        <div class="fleet-marker-name">${v.name}</div>
                        <div class="fleet-marker-status-label">${label}</div>
                        <div class="fleet-marker-eta">ETA ${v.eta}</div>
                    </div>
                </div>`;
        }).join('');
    }
};
