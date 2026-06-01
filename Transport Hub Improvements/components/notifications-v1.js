// Notification Manager - handles notification panel and alerts
const NotificationManager = {
    notifications: [],

    toggle() {
        const list = this.notifications.map(n => {
            const icon = n.type === 'dispatch' ? '📦' : n.type === 'driver' ? '👤' : '🚗';
            return `${icon} ${n.message} (${n.time})`;
        }).join('\n');

        alert(`Notifications\n\n${list}`);
    }
};

// Initialize notifications
document.addEventListener('DOMContentLoaded', () => {
    NotificationManager.notifications = [
        { id: 1, type: 'dispatch', message: 'Vehicle #5992583 dispatched', time: '2 min ago' },
        { id: 2, type: 'driver', message: 'Driver assigned: Sean Mann', time: '30 min ago' },
        { id: 3, type: 'transit', message: 'Vehicle #9463764 in transit', time: '2 hours ago' }
    ];
});
