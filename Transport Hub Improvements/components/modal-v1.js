// Modal Manager - handles order details display
const ModalManager = {
    currentVehicle: null,

    open(vehicle) {
        this.currentVehicle = vehicle;
        document.getElementById('modalVehicleName').textContent = vehicle.name;
        document.getElementById('modalVehicleVIN').textContent = `VIN: ${vehicle.vin}`;

        this.renderModalBody();

        const modal = document.getElementById('orderModal');
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    },

    close() {
        const modal = document.getElementById('orderModal');
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        this.currentVehicle = null;
    },

    renderModalBody() {
        const v = this.currentVehicle;
        const html = `
            <!-- Order Summary -->
            <div class="modal-section">
                <div class="section-title">Order Information</div>
                <div class="info-grid">
                    <div class="info-field">
                        <div class="info-label">Order ID</div>
                        <div class="info-value">${v.orderId}</div>
                    </div>
                    <div class="info-field">
                        <div class="info-label">Order Date</div>
                        <div class="info-value">${v.orderDate}</div>
                    </div>
                    <div class="info-field">
                        <div class="info-label">Transport Distance</div>
                        <div class="info-value">${v.distance}</div>
                    </div>
                    <div class="info-field">
                        <div class="info-label">Transport Cost</div>
                        <div class="info-value">${v.cost}</div>
                    </div>
                </div>
            </div>

            <!-- Full Progress Stepper -->
            <div class="modal-section">
                <div class="section-title">Transport Progress</div>
                <div class="full-stepper">
                    ${v.progressTimestamps.map((ts, idx) => {
                        const isCompleted = v.progress[idx];
                        const isActive = !isCompleted && idx === v.progress.findIndex(p => !p);
                        const stepperClass = isCompleted ? 'completed' : isActive ? 'active' : '';
                        const circleContent = isCompleted ? '✓' : isActive ? '📍' : '🏁';

                        return `
                            <div class="stepper-item ${stepperClass}">
                                <div class="stepper-circle">${circleContent}</div>
                                <div class="stepper-label">${ts.stage}</div>
                                <div class="stepper-time">${ts.time}</div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>

            <!-- Map -->
            <div class="modal-section">
                <div class="section-title">Route & Location</div>
                <div class="map-container">
                    <div class="map-route"></div>
                    <div class="map-marker current" title="Current location"></div>
                    <div class="map-marker destination" title="Destination"></div>
                    <div class="map-label">
                        <span>${v.pickupLocType}</span>
                        <span>${v.deliveryLocType}</span>
                    </div>
                </div>
            </div>

            <!-- Documents -->
            <div class="modal-section">
                <div class="section-title">Documents</div>
                <div class="file-list">
                    <div class="file-item">
                        <div class="file-icon">📄</div>
                        <div class="file-name">Gate Pass</div>
                        <div class="file-size">1.2 MB</div>
                    </div>
                    <div class="file-item">
                        <div class="file-icon">📋</div>
                        <div class="file-name">Bill of Lading</div>
                        <div class="file-size">456 KB</div>
                    </div>
                    <div class="file-item">
                        <div class="file-icon">💾</div>
                        <div class="file-name">Invoice</div>
                        <div class="file-size">234 KB</div>
                    </div>
                </div>
            </div>

            <!-- Addresses -->
            <div class="modal-section">
                <div class="section-title">Addresses</div>
                <div class="address-grid">
                    <div class="address-block">
                        <div class="address-type">📍 Pickup Location</div>
                        <div class="address-name">${v.pickupLocType}</div>
                        <div class="address-details">${v.pickupAddr}</div>
                        <div class="address-instructions">
                            <strong>Instructions:</strong> ${v.pickupInstructions}
                        </div>
                    </div>
                    <div class="address-block">
                        <div class="address-type">🏁 Delivery Location</div>
                        <div class="address-name">${v.deliveryLocType}</div>
                        <div class="address-details">${v.deliveryAddr}</div>
                        <div class="address-instructions">
                            <strong>Instructions:</strong> ${v.deliveryInstructions}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Contacts -->
            <div class="modal-section">
                <div class="section-title">Contact Information</div>
                <div class="contact-grid">
                    <div class="contact-block">
                        <div class="contact-title">Pickup Contact</div>
                        <div class="contact-info">
                            <div class="contact-label">Name</div>
                            <div class="contact-value">${v.pickupContact.name}</div>
                        </div>
                        <div class="contact-info">
                            <div class="contact-label">Phone</div>
                            <div class="contact-value phone" onclick="alert('Calling: ${v.pickupContact.phone}')">${v.pickupContact.phone}</div>
                        </div>
                    </div>
                    <div class="contact-block">
                        <div class="contact-title">Delivery Contact / Driver</div>
                        <div class="contact-info">
                            <div class="contact-label">Name</div>
                            <div class="contact-value">${v.driverContact.name}</div>
                        </div>
                        <div class="contact-info">
                            <div class="contact-label">Phone</div>
                            <div class="contact-value phone" onclick="alert('Calling: ${v.driverContact.phone}')">${v.driverContact.phone}</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Vehicle Details -->
            <div class="modal-section">
                <div class="section-title">Vehicle Details</div>
                <div class="info-grid">
                    <div class="info-field">
                        <div class="info-label">Year/Make/Model</div>
                        <div class="info-value">${v.name}</div>
                    </div>
                    <div class="info-field">
                        <div class="info-label">VIN</div>
                        <div class="info-value" style="font-size: 0.85rem;">${v.vin}</div>
                    </div>
                    <div class="info-field">
                        <div class="info-label">Operable Status</div>
                        <div class="info-value">${v.operableStatus}</div>
                    </div>
                    <div class="info-field">
                        <div class="info-label">Origin</div>
                        <div class="info-value">${v.origin}</div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('modalBody').innerHTML = html;
    }
};

// Close modal on backdrop click
document.getElementById('orderModal').addEventListener('click', (e) => {
    if (e.target.id === 'orderModal') {
        ModalManager.close();
    }
});
