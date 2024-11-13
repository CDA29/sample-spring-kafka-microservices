package pl.piomin.dashboard.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.piomin.base.domain.Order;

import java.util.concurrent.atomic.AtomicLong;

@RestController
public class StatisticsController {

    private AtomicLong paymentCount = new AtomicLong();

    @Autowired
    private SimpMessagingTemplate template;

    @Autowired
    private KafkaTemplate<Long, Order> kafkaTemplate;

    @KafkaListener(topics = "payment-orders", groupId = "dashboard")
    public void listenPayments(Order order) {
        paymentCount.incrementAndGet();
        template.convertAndSend("/topic/payments", paymentCount.get());
    }

    @GetMapping("/stats")
    public long getPaymentCount() {
        return paymentCount.get();
    }
}