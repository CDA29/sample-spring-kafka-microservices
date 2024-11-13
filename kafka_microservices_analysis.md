# Analyse de l'Architecture Microservices avec Kafka

## Vue d'ensemble

Ce projet implémente une architecture de microservices utilisant Apache Kafka pour la communication entre les services. L'application gère le processus de commande, de paiement et de gestion des stocks.

## Services

1. **Order Service**
2. **Payment Service**
3. **Stock Service**

## Configuration Kafka

### Docker Compose

```yaml
services:
  broker:
    image: moeenz/docker-kafka-kraft:latest
    ports:
      - "9092:9092"
    environment:
      - KRAFT_CONTAINER_HOST_NAME=broker
```

### Configuration Spring Boot (application.yml)

```yaml
spring.kafka:
  producer:
    key-serializer: org.apache.kafka.common.serialization.LongSerializer
    value-serializer: org.springframework.kafka.support.serializer.JsonSerializer
  streams:
    properties:
      default.key.serde: org.apache.kafka.common.serialization.Serdes$LongSerde
      default.value.serde: org.springframework.kafka.support.serializer.JsonSerde
```

## Flux de données

1. **Order Service** génère des commandes et les publie sur le topic "orders".
2. **Payment Service** et **Stock Service** consomment les messages du topic "orders".
3. **Payment Service** traite les paiements et publie les résultats sur le topic "payment-orders".
4. **Stock Service** gère les stocks et publie probablement les résultats sur un topic "stock-orders".
5. **Order Service** consomme probablement les messages des topics "payment-orders" et "stock-orders" pour finaliser les commandes.

## Détails d'implémentation

### Order Service

```java
// OrderGeneratorService.java
@Service
public class OrderGeneratorService {
    private KafkaTemplate<Long, Order> template;

    public void generate() {
        // ...
        template.send("orders", o.getId(), o);
    }
}
```

### Payment Service

```java
// PaymentApp.java
@SpringBootApplication
@EnableKafka
public class PaymentApp {
    @KafkaListener(id = "orders", topics = "orders", groupId = "payment")
    public void onEvent(Order o) {
        if (o.getStatus().equals("NEW"))
            orderManageService.reserve(o);
        else
            orderManageService.confirm(o);
    }
}

// OrderManageService.java
@Service
public class OrderManageService {
    private KafkaTemplate<Long, Order> template;

    public void reserve(Order order) {
        // Logique de réservation
        template.send("payment-orders", order.getId(), order);
    }
}
```

## Avantages de cette architecture

1. **Découplage** : Les services sont faiblement couplés, communiquant via Kafka.
2. **Scalabilité** : Chaque service peut être mis à l'échelle indépendamment.
3. **Résilience** : Kafka assure la persistance des messages, permettant aux services de rattraper leur retard en cas de panne.
4. **Traitement asynchrone** : Permet un traitement efficace des commandes sans blocage.

## Améliorations possibles

1. Implémenter des stratégies de gestion des erreurs et de reprise.
2. Ajouter des tests d'intégration pour vérifier le flux complet.
3. Monitorer les performances de Kafka et des consommateurs.
4. Implémenter des schémas Avro pour une meilleure gestion des versions des messages.
