# Aplikacje w chmurze

## Projekt 1 - Tworzenie backendu, frontendu i bazy danych.

Link do danych: [**Life Expectancy 2000-2015**](https://www.kaggle.com/datasets/vrec99/life-expectancy-2000-2015) (kaggle)

kind create cluster --config=kind-cluster.yml

docker build -t backend:1.0 backend
docker build -t frontend:1.0 frontend

kind load docker-image backend:1.0
kind load docker-image frontend:1.0

DB:
kubectl apply -f database-config.yml
kubectl apply -f database-pvc-pv.yml
kubectl apply -f database-pod.yml
kubectl apply -f database-service.yml

kubectl exec -it database-pod -- psql -h localhost -U postgres --password -p 5432 chmury

BACKEND:
kubectl create -f dev-secret.yml
kubectl apply -f backend-pod.yml
kubectl apply -f backend-service.yml
kubectl logs backend-pod

FRONTEND:
kubectl apply -f frontend-pod.yml
kubectl apply -f frontend-service.yml
