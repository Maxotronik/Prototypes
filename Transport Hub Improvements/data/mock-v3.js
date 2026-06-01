// Sample vehicle data with all statuses
const MOCK_VEHICLES = [
    {
        id: 1,
        vin: '5NMZ4BB7BV771PAM',
        name: '2011 Hyundai SANTA FE',
        auctionId: '5992583',
        orderId: '9926583',
        image: '🚗',
        status: 'in-transit',
        eta: 'Apr 3',
        etaRange: 'Apr 3 to Apr 4',
        origin: 'ACV In App',
        inoperable: false,
        progress: [true, true, true, false],
        orderDate: 'Mar 30, 2026',
        distance: '536 mi.',
        cost: '$2,139',
        pickupAddr: '640 Ellicott Street, Buffalo, NY 14203',
        pickupLocType: 'Buffalo Auto Auction',
        pickupInstructions: 'No after hours pickup',
        deliveryAddr: '123 Fake Street, Oak Lawn, IL 60453',
        deliveryLocType: 'Residential Address',
        deliveryInstructions: 'No after hours delivery',
        pickupContact: { name: 'Sukh Singh', phone: '(123) 456-7890' },
        driverContact: { name: 'Sean Mann (Primary Transport Contact)', phone: '(716) 867-6391' },
        operableStatus: 'Yes',
        progressTimestamps: [
            { stage: 'Finding Carrier', time: 'Mar 30 - 2:15 PM' },
            { stage: 'Dispatched', time: 'Mar 31 - 10:30 AM' },
            { stage: 'On Its Way', time: 'Currently in transit' },
            { stage: 'Delivered', time: 'Exp. Apr 3' }
        ]
    },
    {
        id: 2,
        vin: '1FTMF1EF9DKF87019',
        name: '2013 Ford F-150 STX',
        auctionId: '9463',
        orderId: '9463764',
        image: '🚙',
        status: 'dispatched',
        eta: 'Apr 2',
        etaRange: 'Apr 2 to Apr 3',
        origin: '3rd Party',
        inoperable: false,
        progress: [true, true, false, false],
        orderDate: 'Mar 30, 2026',
        distance: '450 mi.',
        cost: '$1,850',
        pickupAddr: '1708 18th St, Hondo, TX 78861',
        pickupLocType: 'Dealership',
        pickupInstructions: 'Call ahead for pickup time',
        deliveryAddr: '456 Auto Lane, Houston, TX 77002',
        deliveryLocType: 'Dealership',
        deliveryInstructions: 'Dock area, east gate',
        pickupContact: { name: 'John Martinez', phone: '(210) 555-0123' },
        driverContact: { name: 'Carlos Rodriguez', phone: '(512) 555-0156' },
        operableStatus: 'Yes',
        progressTimestamps: [
            { stage: 'Finding Carrier', time: 'Mar 30 - 1:00 PM' },
            { stage: 'Dispatched', time: 'Mar 31 - 9:00 AM' },
            { stage: 'On Its Way', time: 'Pickup in progress' },
            { stage: 'Delivered', time: 'Exp. Apr 2' }
        ]
    },
    {
        id: 3,
        vin: '1FTFW1ET0DKD34607',
        name: '2013 Ford F-150 FX4',
        auctionId: '9024',
        orderId: '90240867',
        image: '🚙',
        status: 'dispatched',
        eta: 'Apr 2',
        etaRange: 'Apr 2 to Apr 3',
        origin: 'ACV In App',
        inoperable: true,
        progress: [true, true, false, false],
        orderDate: 'Mar 30, 2026',
        distance: '520 mi.',
        cost: '$2,050',
        pickupAddr: '640 Ellicott Street, Buffalo, NY 14203',
        pickupLocType: 'Buffalo Auto Auction',
        pickupInstructions: 'No after hours pickup',
        deliveryAddr: '16999 Ghost Street, Buffalo, NY 14203',
        deliveryLocType: 'Holding Lot',
        deliveryInstructions: 'Security gate, lot C',
        pickupContact: { name: 'Sukh Singh', phone: '(123) 456-7890' },
        driverContact: { name: 'Mike Thompson', phone: '(716) 555-0189' },
        operableStatus: 'No',
        progressTimestamps: [
            { stage: 'Finding Carrier', time: 'Mar 30 - 3:45 PM' },
            { stage: 'Dispatched', time: 'Mar 31 - 2:00 PM' },
            { stage: 'On Its Way', time: 'Awaiting pickup' },
            { stage: 'Delivered', time: 'Exp. Apr 2' }
        ]
    },
    {
        id: 4,
        vin: '1C4SJVBP28S172593',
        name: '2024 Jeep Wagoneer Series II',
        auctionId: '6036',
        orderId: '6036507',
        image: '🚙',
        status: 'finding',
        eta: 'Apr 2',
        etaRange: 'Est. 1-2 days',
        origin: 'Lotsa Place',
        inoperable: false,
        progress: [true, false, false, false],
        orderDate: 'Mar 30, 2026',
        distance: '385 mi.',
        cost: 'Pending',
        pickupAddr: '123 Main Street, Ecleto, TX 78111',
        pickupLocType: 'Holding Lot',
        pickupInstructions: 'Business hours only',
        deliveryAddr: '123 Main Street, Ecleto, TX 78111',
        deliveryLocType: 'Port Terminal',
        deliveryInstructions: 'Lot E, section 3',
        pickupContact: { name: 'Maria Garcia', phone: '(361) 555-0132' },
        driverContact: { name: 'TBD', phone: 'TBD' },
        operableStatus: 'Yes',
        progressTimestamps: [
            { stage: 'Finding Carrier', time: 'Mar 30 - 11:30 AM' },
            { stage: 'Dispatched', time: 'Awaiting confirmation' },
            { stage: 'On Its Way', time: 'Pending' },
            { stage: 'Delivered', time: 'Exp. Apr 2' }
        ]
    },
    {
        id: 5,
        vin: '5TDJZRVH0LS123456',
        name: '2020 Toyota Highlander XLE',
        auctionId: '5501',
        orderId: '5501234',
        image: '🚗',
        status: 'delivered',
        eta: 'Mar 28',
        etaRange: 'Delivered',
        origin: 'ACV In App',
        inoperable: false,
        progress: [true, true, true, true],
        orderDate: 'Mar 20, 2026',
        distance: '610 mi.',
        cost: '$2,450',
        pickupAddr: '50 Auction Way, Atlanta, GA 30301',
        pickupLocType: 'ACV Atlanta',
        pickupInstructions: 'Loading dock 3',
        deliveryAddr: '999 Oak Ridge Rd, Charlotte, NC 28202',
        deliveryLocType: 'Residential Address',
        deliveryInstructions: 'Driveway access',
        pickupContact: { name: 'David Lee', phone: '(404) 555-0143' },
        driverContact: { name: 'Lisa Washington', phone: '(704) 555-0167' },
        operableStatus: 'Yes',
        progressTimestamps: [
            { stage: 'Finding Carrier', time: 'Mar 20 - 10:00 AM' },
            { stage: 'Dispatched', time: 'Mar 21 - 3:30 PM' },
            { stage: 'On Its Way', time: 'Mar 22 - 8:00 AM' },
            { stage: 'Delivered', time: 'Mar 28 - 2:15 PM' }
        ]
    }
];

// Summary stats
function getStats() {
    const stats = {
        'in-transit': 0,
        'dispatched': 0,
        'delivered': 0,
        'finding': 0
    };
    MOCK_VEHICLES.forEach(v => {
        stats[v.status]++;
    });
    return stats;
}
