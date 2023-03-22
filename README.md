# Aplikacje w chmurze

## Projekt 4 - Przygotowanie aplikacji z podziałem komponentów (db, backend, frontend) na niezależne kapsuły i usługi wraz z sondami żywotności oraz trwałym woluminem do zachowania zawartości bazy danych.

Link do danych: [**Life Expectancy 2000-2015**](https://www.kaggle.com/datasets/vrec99/life-expectancy-2000-2015) (kaggle)

### Przygotowanie

Utworzenie klastra

    kind create cluster --config=kind-cluster.yml

Budowanie obrazów dockerowych

    docker build -t backend:1.0 backend
    docker build -t frontend:1.0 frontend

Wczytanie obrazów do klastra

    kind load docker-image backend:1.0
    kind load docker-image frontend:1.0

#### **Baza danych**

    kubectl apply -f database/database-config.yml
    kubectl apply -f database/database-pvc-pv.yml
    kubectl apply -f database/database-pod.yml
    kubectl apply -f database/database-service.yml

Połączenie z konsolą postgres

    kubectl exec -it database-pod -- psql -h localhost -U postgres --password -p 5432 chmury

#### **Backend**

    kubectl create -f backend/backend-secret.yml
    kubectl apply -f backend/backend-pod.yml
    kubectl apply -f backend/backend-service.yml

Wyświetlenie logów kapsuły backend

    kubectl logs backend-pod

#### **Frontend**

    kubectl apply -f frontend/frontend-pod.yml
    kubectl apply -f frontend/frontend-service.yml

Po wykonaniu powyższych czynności aplikacja powinna być dostępna pod adresem http://localhost:8080
