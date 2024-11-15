
var socket = new SockJS('/ws');
var stompClient = Stomp.over(socket);
var ordersChart, kafkaMessagesChart, microservicesHealthChart, realTimeOrdersChart;

stompClient.connect({}, function (frame) {
    console.log('Connected: ' + frame);
    stompClient.subscribe('/topic/orders', function (orderMessage) {
        console.log(orderMessage);
        updateOrdersChart(JSON.parse(orderMessage.body));
    });
    stompClient.subscribe('/topic/kafka', function (kafkaMessage) {
        console.log(kafkaMessage);
        updateKafkaMessagesChart(JSON.parse(kafkaMessage.body));
    });
    stompClient.subscribe('/topic/microservices', function (healthMessage) {
        console.log(healthMessage);
        updateMicroservicesHealthChart(JSON.parse(healthMessage.body));
    });
    stompClient.subscribe('/topic/realtime-orders', function (realtimeOrderMessage) {
        console.log(realtimeOrderMessage);
        updateRealTimeOrdersChart(JSON.parse(realtimeOrderMessage.body));
    });
});

function updateOrdersChart(order) {
    if (!ordersChart) {
        var ctx = document.getElementById('ordersChart').getContext('2d');
        ordersChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['New', 'Paid', 'Confirmed', 'Rejected'],
                datasets: [{
                    label: '# of Orders',
                    data: [0, 0, 0, 0],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(255, 206, 86, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(255, 206, 86, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    var statusIndex;
    switch(order.status) {
        case 'NEW':
            statusIndex = 0;
            break;
        case 'PAID':
            statusIndex = 1;
            break;
        case 'CONFIRMED':
            statusIndex = 2;
            break;
        case 'REJECTED':
            statusIndex = 3;
            break;
    }

    ordersChart.data.datasets[0].data[statusIndex]++;
    ordersChart.update();
}

function updateKafkaMessagesChart(kafkaData) {
    if (!kafkaMessagesChart) {
        var ctx = document.getElementById('kafkaMessagesChart').getContext('2d');
        kafkaMessagesChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: '# of Kafka Messages',
                    data: [],
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    kafkaMessagesChart.data.labels.push(new Date().toLocaleTimeString());
    kafkaMessagesChart.data.datasets[0].data.push(kafkaData.messageCount);

    if (kafkaMessagesChart.data.labels.length > 10) {
        kafkaMessagesChart.data.labels.shift();
        kafkaMessagesChart.data.datasets[0].data.shift();
    }
    kafkaMessagesChart.update();
}

function updateMicroservicesHealthChart(healthData) {
    if (!microservicesHealthChart) {
        var ctx = document.getElementById('microservicesHealthChart').getContext('2d');
        microservicesHealthChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Order Service', 'Payment Service', 'Stock Service'],
                datasets: [{
                    label: 'Health Status',
                    data: [100, 100, 100],
                    backgroundColor: [
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 206, 86, 0.6)'
                    ],
                    borderColor: [
                        'rgba(75, 192, 192, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }

    microservicesHealthChart.data.datasets[0].data = [
        healthData.orderService,
        healthData.paymentService,
        healthData.stockService
    ];
    microservicesHealthChart.update();
}

function updateRealTimeOrdersChart(orderData) {
    if (!realTimeOrdersChart) {
        var ctx = document.getElementById('realTimeOrdersChart').getContext('2d');
        realTimeOrdersChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Orders Processed',
                    data: [],
                    borderColor: 'rgb(255, 99, 132)',
                    tension: 0.1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    realTimeOrdersChart.data.labels.push(new Date().toLocaleTimeString());
    realTimeOrdersChart.data.datasets[0].data.push(orderData.processedOrders);

    if (realTimeOrdersChart.data.labels.length > 10) {
        realTimeOrdersChart.data.labels.shift();
        realTimeOrdersChart.data.datasets[0].data.shift();
    }
    realTimeOrdersChart.update();
}