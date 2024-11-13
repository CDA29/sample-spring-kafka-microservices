package pl.piomin.dashboard;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.kafka.annotation.EnableKafka;

@SpringBootApplication
@EnableKafka
public class DashboardApp {
    public static void main(String[] args) {
        SpringApplication.run(DashboardApp.class, args);
    }
}
