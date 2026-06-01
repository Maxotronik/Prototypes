const NotificationManager = {
    isOpen: false,
    notifications: [
        { id: 1, vehicleId: 0, title: 'Auction ended!', message: '2002 Chevrolet Silverado 2500 — Seller\'s reserve price was: $5,000. Accept or counter offer?', time: 'a day ago' },
        { id: 2, vehicleId: 1, title: 'Auction ended!', message: '2009 Mercury Milan — Seller\'s reserve price was: $5,000. Accept or counter offer?', time: 'a day ago' },
        { id: 3, vehicleId: 2, title: 'Auction ended!', message: '2009 Ford F350SD — Seller\'s reserve price was: $105,000. Accept or counter offer?', time: 'a month ago' },
        { id: 4, vehicleId: 3, title: 'Auction ended!', message: '2011 Ford F350SD — Seller\'s reserve price was: $5,000. Accept or counter offer?', time: 'a year ago' },
        { id: 5, vehicleId: 4, title: 'Auction ended!', message: '2011 Volkswagen Jetta — Seller\'s reserve price was: $8,500. Accept or counter offer?', time: 'a year ago' },
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
                <div class="notif-thumb">
                    <span class="material-symbols-outlined notif-thumb-icon">directions_car</span>
                </div>
                <div class="notif-content">
                    <div class="notification-message">${n.title}</div>
                    <div class="notif-body">${n.message}</div>
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
