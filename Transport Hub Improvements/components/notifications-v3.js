const NotificationManager = {
    isOpen: false,
    notifications: [
        { id: 1, vehicleId: 0, icon: 'inventory_2', message: 'Vehicle dispatched', sub: '2011 Hyundai SANTA FE', time: '2 min ago' },
        { id: 2, vehicleId: 0, icon: 'person', message: 'Driver assigned: Sean Mann', sub: '2011 Hyundai SANTA FE', time: '30 min ago' },
        { id: 3, vehicleId: 1, icon: 'directions_car', message: 'Vehicle in transit', sub: '2013 Ford F-150 STX', time: '2 hours ago' }
    ],

    init() {
        this.renderNotifications();
        // Close panel when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && !e.target.closest('.notification-icon') && !e.target.closest('.notification-panel')) {
                this.close();
            }
        });
    },

    toggle() {
        this.isOpen ? this.close() : this.open();
    },

    open() {
        document.getElementById('notificationPanel').classList.add('active');
        this.isOpen = true;
    },

    close() {
        document.getElementById('notificationPanel').classList.remove('active');
        this.isOpen = false;
    },

    renderNotifications() {
        document.getElementById('notificationList').innerHTML = this.notifications.map(n => `
            <div class="notification-item" onclick="NotificationManager.handleClick(${n.vehicleId})">
                <span class="material-symbols-outlined notif-icon">
                    ${n.icon}
                </span>
                <div class="notif-content">
                    <div class="notification-message">${n.message}</div>
                    <div class="notif-sub">${n.sub}</div>
                    <div class="notification-time">${n.time}</div>
                </div>
            </div>
        `).join('');
    },

    handleClick(vehicleId) {
        this.close();
        PanelManager.open(MOCK_VEHICLES[vehicleId]);
    }
};
