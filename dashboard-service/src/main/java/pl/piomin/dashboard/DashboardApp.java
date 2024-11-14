package pl.piomin.dashboard;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.kafka.annotation.EnableKafka;

@SpringBootApplication
@EnableKafka
public class DashboardApp {
    private static final Logger logger = LoggerFactory.getLogger(DashboardApp.class);

    public static void main(String[] args) {
        logger.info("Starting Dashboard Application");
        SpringApplication.run(DashboardApp.class, args);
        logger.info("Dashboard Application started successfully");
    }
}