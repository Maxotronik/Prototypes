const PanelManager = {
    currentVehicle: null,

    open(vehicle) {
        this.currentVehicle = vehicle;
        this.renderPanel();
        document.getElementById('detailPanel').classList.add('active');
        document.getElementById('panelOverlay').classList.add('active');
        document.body.style.overflow = 'hidden';
    },

    close() {
        document.getElementById('detailPanel').classList.remove('active');
        document.getElementById('panelOverlay').classList.remove('active');
        document.body.style.overflow = 'auto';
        this.currentVehicle = null;
    },

    renderPanel() {
        const v = this.currentVehicle;
        const statusText = {
            'finding': 'Finding Carrier',
            'dispatched': 'Dispatched',
            'in-transit': 'On Its Way',
            'delivered': 'Delivered'
        }[v.status];

        // --- Fixed vehicle header ---
        const chips = [];
        if (v.origin.includes('ACV')) {
            chips.push('<span class="pnl-chip chip-info">ACV In-App</span>');
        } else if (v.origin.includes('3rd')) {
            chips.push('<span class="pnl-chip chip-info">3rd Party</span>');
        } else {
            chips.push(`<span class="pnl-chip chip-info">${v.origin}</span>`);
        }
        if (v.inoperable) chips.push('<span class="pnl-chip chip-caution">INOP</span>');

        document.getElementById('panelVehicleFixed').innerHTML = `
            <div class="panel-title">${v.name}</div>
            <div class="panel-subtitle-row">
                <span class="panel-meta-label">VIN:</span>
                <span class="panel-meta-value">${v.vin}</span>
                <span class="panel-meta-label" style="margin-left:6px">Order ID:</span>
                <span class="panel-meta-value">${v.orderId}</span>
                ${chips.join('')}
                <span class="panel-price">${v.cost}</span>
            </div>`;

        // --- Status bar ---
        const pickupEtaText = v.progressTimestamps[2].time;
        document.getElementById('panelStatusBar').innerHTML = `
            <div class="pnl-status-item">
                <div class="pnl-status-label">Status</div>
                <div class="pnl-status-value pnl-status-bold">${statusText}</div>
            </div>
            <div class="pnl-status-item">
                <div class="pnl-status-label">Pickup ETA</div>
                <div class="pnl-status-value">${pickupEtaText}</div>
            </div>
            <div class="pnl-status-item pnl-status-item-right">
                <div class="pnl-status-label">Delivery ETA</div>
                <div class="pnl-status-value pnl-status-bold">${v.eta}</div>
            </div>`;

        // --- Instruction bullet logic ---
        const pickupHasNo = /\bno\b/i.test(v.pickupInstructions);
        const pickupBulletIcon = pickupHasNo ? 'remove_circle' : 'check_circle';
        const pickupBulletClass = pickupHasNo ? 'bullet-danger' : 'bullet-success';

        const deliveryHasNo = /\bno\b/i.test(v.deliveryInstructions);
        const deliveryBulletIcon = deliveryHasNo ? 'remove_circle' : 'check_circle';
        const deliveryBulletClass = deliveryHasNo ? 'bullet-danger' : 'bullet-success';

        // --- Scrollable body ---
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).toLowerCase();

        document.getElementById('panelBody').innerHTML = `
            <!-- Documents -->
            <div class="pnl-section">
                <div class="pnl-doc-cards">
                    <div class="pnl-doc-card pnl-doc-upload">
                        <div class="pnl-doc-title">
                            <span class="pnl-doc-link">Upload Gate Pass</span>
                            <span class="material-symbols-outlined pnl-doc-icon">file_upload</span>
                        </div>
                        <div class="pnl-doc-meta">image or PDF 15 MB</div>
                    </div>
                    <div class="pnl-doc-card">
                        <div class="pnl-doc-title">
                            <span class="pnl-doc-link">Transport Invoice</span>
                            <span class="material-symbols-outlined pnl-doc-icon">download</span>
                        </div>
                        <div class="pnl-doc-meta">11 MB</div>
                    </div>
                    <div class="pnl-doc-card">
                        <div class="pnl-doc-title">
                            <span class="pnl-doc-link">BOL</span>
                            <span class="material-symbols-outlined pnl-doc-icon">download</span>
                        </div>
                        <div class="pnl-doc-meta">11 MB</div>
                    </div>
                </div>
            </div>

            <!-- Map -->
            <div class="pnl-section">
                <div class="pnl-map">
                    <div class="map-container" style="height:300px;border-radius:8px;overflow:hidden">
                        <div class="map-route"></div>
                        <div class="map-marker current"></div>
                        <div class="map-marker destination"></div>
                        <div class="map-label">
                            <span>${v.pickupLocType}</span>
                            <span>${v.deliveryLocType}</span>
                        </div>
                    </div>
                    <div class="pnl-map-timestamp">Last update: ${timeStr}</div>
                </div>
            </div>

            <!-- Divider -->
            <div class="pnl-divider"></div>

            <!-- Pickup + Delivery -->
            <div class="pnl-addr-grid">
                <div class="pnl-addr-col">
                    <div>
                        <div class="pnl-addr-header">
                            <span class="pnl-addr-title">Pickup</span>
                            <span class="pnl-loc-chip">${v.pickupLocType}</span>
                        </div>
                        <div class="pnl-location-block" style="margin-top:8px">
                            <div class="pnl-location-name">${v.pickupLocType}</div>
                            <div class="pnl-addr-row">
                                <span class="material-symbols-outlined pnl-mini-icon">location_on</span>
                                <span class="pnl-addr-text">${v.pickupAddr}</span>
                            </div>
                            <div class="pnl-addr-row">
                                <span class="material-symbols-outlined pnl-mini-icon">phone</span>
                                <a class="pnl-contact-link">${v.pickupContact.name} · ${v.pickupContact.phone}</a>
                            </div>
                        </div>
                    </div>
                    <div class="pnl-instr-block">
                        <div class="pnl-instr-title">Pickup Instructions</div>
                        <div class="pnl-instr-bullet">
                            <span class="material-symbols-outlined pnl-bullet-icon ${pickupBulletClass}">${pickupBulletIcon}</span>
                            <span class="pnl-bullet-text ${pickupBulletClass}">${v.pickupInstructions}</span>
                        </div>
                    </div>
                </div>
                <div class="pnl-addr-col">
                    <div>
                        <div class="pnl-addr-header">
                            <span class="pnl-addr-title">Delivery</span>
                            <span class="pnl-loc-chip">${v.deliveryLocType}</span>
                        </div>
                        <div class="pnl-location-block" style="margin-top:8px">
                            <div class="pnl-location-name">${v.deliveryLocType}</div>
                            <div class="pnl-addr-row">
                                <span class="material-symbols-outlined pnl-mini-icon">location_on</span>
                                <span class="pnl-addr-text">${v.deliveryAddr}</span>
                            </div>
                            <div class="pnl-addr-row">
                                <span class="material-symbols-outlined pnl-mini-icon">phone</span>
                                <a class="pnl-contact-link">${v.driverContact.name} · ${v.driverContact.phone}</a>
                            </div>
                        </div>
                    </div>
                    <div class="pnl-instr-block">
                        <div class="pnl-instr-title">Delivery Instructions</div>
                        <div class="pnl-instr-bullet">
                            <span class="material-symbols-outlined pnl-bullet-icon ${deliveryBulletClass}">${deliveryBulletIcon}</span>
                            <span class="pnl-bullet-text ${deliveryBulletClass}">${v.deliveryInstructions}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // --- Fixed stepper footer ---
        const stages = ['Finding Carrier', 'Dispatched', 'On Its Way', 'Delivered'];
        const allDone = v.status === 'delivered';
        const stepperParts = [];
        stages.forEach((label, idx) => {
            const completed = v.progress[idx];
            const active = !completed && idx === v.progress.findIndex(p => !p);
            stepperParts.push(`
                <div class="pnl-step-col${active ? ' active' : ''}">
                    <div class="pnl-step-dot ${completed ? 'done' : active ? 'active' : ''}"></div>
                    <div class="pnl-step-label">${label}</div>
                    <div class="pnl-step-time">${v.progressTimestamps[idx].time}</div>
                </div>`);
            if (idx < stages.length - 1) {
                stepperParts.push(`<div class="pnl-step-line ${completed ? 'done' : ''}"></div>`);
            }
        });

        document.getElementById('panelStepperFooter').innerHTML = `
            <div class="pnl-footer-meta">
                <div class="pnl-footer-item">
                    <span class="pnl-footer-label">Order Date</span>
                    <span class="pnl-footer-value">${v.orderDate}</span>
                </div>
                <div class="pnl-footer-item pnl-footer-item-right">
                    <span class="pnl-footer-label">Distance</span>
                    <span class="pnl-footer-value">${v.distance}</span>
                </div>
            </div>
            <div class="pnl-stepper${allDone ? ' all-done' : ''}">${stepperParts.join('')}</div>`;
    }
};
