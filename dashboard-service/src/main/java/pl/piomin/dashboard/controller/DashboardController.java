package pl.piomin.dashboard.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import pl.piomin.base.domain.Order;

@Controller
public class DashboardController {

    @Autowired
    private SimpMessagingTemplate template;

    @GetMapping("/")
    public String dashboard() {
        return "dashboard";
    }

    @KafkaListener(topics = {"orders", "payment-orders", "stock-orders"}, groupId = "dashboard")
    public void listen(Order order) {
        template.convertAndSend("/topic/orders", order);
    }
}
