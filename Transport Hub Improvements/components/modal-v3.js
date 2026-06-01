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
        const statusText = { 'finding': 'Finding Carrier', 'dispatched': 'Dispatched', 'in-transit': 'In Transit', 'delivered': 'Delivered' }[v.status];

        // Fixed vehicle header
        document.getElementById('panelVehicleFixed').innerHTML = `
            <div class="panel-vehicle-header">
                <div class="panel-vehicle-thumb">
                    <span class="material-symbols-outlined">directions_car</span>
                </div>
                <div class="panel-vehicle-meta">
                    <div class="panel-vehicle-name">${v.name}</div>
                    <div class="panel-vehicle-vin">${v.vin}</div>
                    <div class="panel-vehicle-sub">Order #${v.orderId} · ${v.distance} · ${v.orderDate}</div>
                </div>
            </div>`;

        // Fixed stepper footer
        const stages = ['Finding Carrier', 'Dispatched', 'In Transit', 'Delivered'];
        const stepperHtml = stages.map((label, idx) => {
            const completed = v.progress[idx];
            const active = !completed && idx === v.progress.findIndex(p => !p);
            const icon = completed ? 'check_circle' : active ? 'radio_button_checked' : 'radio_button_unchecked';
            return `
                <div class="stepper-item ${completed ? 'completed' : ''} ${active ? 'active' : ''}">
                    <div class="stepper-circle">
                        <span class="material-symbols-outlined">${icon}</span>
                    </div>
                    <div class="stepper-label">${label}</div>
                    <div class="stepper-time">${v.progressTimestamps[idx].time}</div>
                </div>`;
        }).join('');

        document.getElementById('panelStepperFooter').innerHTML = `
            <div class="footer-meta-row">
                <div class="footer-meta-item">
                    <span class="footer-meta-label">Order Date</span>
                    <span class="footer-meta-value">${v.orderDate}</span>
                </div>
                <div class="footer-meta-item">
                    <span class="footer-meta-label">Total Distance</span>
                    <span class="footer-meta-value">${v.distance}</span>
                </div>
            </div>
            <div class="panel-section-label">Transport Progress</div>
            <div class="full-stepper">${stepperHtml}</div>`;

        // Scrollable body
        document.getElementById('panelBody').innerHTML = `
            <!-- Status & ETA -->
            <div class="panel-section primary">
                <div class="status-eta-row">
                    <div>
                        <div class="panel-section-label">Status</div>
                        <div class="status-large status-${v.status}">${statusText}</div>
                    </div>
                    <div class="eta-large">
                        <div class="eta-large-label">Estimated Delivery</div>
                        <div class="eta-large-value">${v.eta}</div>
                        <div class="eta-large-range">${v.etaRange}</div>
                    </div>
                </div>
            </div>

            <!-- Map -->
            <div class="panel-section">
                <div class="panel-section-label">Route & Location</div>
                <div class="map-container">
                    <div class="map-route"></div>
                    <div class="map-marker current"></div>
                    <div class="map-marker destination"></div>
                    <div class="map-label">
                        <span>${v.pickupLocType}</span>
                        <span>${v.deliveryLocType}</span>
                    </div>
                </div>
            </div>

            <!-- Documents -->
            <div class="panel-section">
                <div class="panel-section-label">Documents</div>
                <div class="file-list">
                    <div class="file-item">
                        <span class="material-symbols-outlined file-icon">description</span>
                        <div class="file-name">Gate Pass</div>
                    </div>
                    <div class="file-item">
                        <span class="material-symbols-outlined file-icon">receipt_long</span>
                        <div class="file-name">BOL</div>
                    </div>
                    <div class="file-item">
                        <span class="material-symbols-outlined file-icon">receipt</span>
                        <div class="file-name">Invoice</div>
                    </div>
                </div>
            </div>

            <!-- Addresses -->
            <div class="panel-section">
                <div class="panel-section-label">Addresses</div>
                <div class="address-block-compact">
                    <div class="address-type"><span class="material-symbols-outlined" style="font-size:14px;vertical-align:-2px">location_on</span> Pickup</div>
                    <div class="address-name">${v.pickupLocType}</div>
                    <div class="address-details">${v.pickupAddr}</div>
                    <div class="address-instructions"><strong>Instructions:</strong> ${v.pickupInstructions}</div>
                </div>
                <div class="address-block-compact">
                    <div class="address-type"><span class="material-symbols-outlined" style="font-size:14px;vertical-align:-2px">flag</span> Delivery</div>
                    <div class="address-name">${v.deliveryLocType}</div>
                    <div class="address-details">${v.deliveryAddr}</div>
                    <div class="address-instructions"><strong>Instructions:</strong> ${v.deliveryInstructions}</div>
                </div>
            </div>

            <!-- Support -->
            <div class="panel-section">
                <div class="panel-section-label">Need Help?</div>
                <div class="support-block">
                    <span class="material-symbols-outlined support-icon">support_agent</span>
                    <div class="support-info">
                        <div class="support-text">ACV Transport Support</div>
                        <a class="support-phone" href="tel:18005551234">1-800-555-1234</a>
                    </div>
                </div>
            </div>

            <!-- Cancel Order -->
            <div class="panel-section">
                <button class="cancel-order-btn">
                    <span class="material-symbols-outlined" style="font-size:16px;vertical-align:-3px">cancel</span>
                    Request Order Cancellation
                </button>
            </div>
        `;
    }
};
