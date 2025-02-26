#!/bin/bash

# Set variables
IMAGE_NAME="europe-west4-docker.pkg.dev/virtual-venue-stg-7102ffeb/screenshot-service/screenshot-api"
REGION="europe-west4"
PROJECT="virtual-venue-stg-7102ffeb"
SERVICE_NAME="screenshot-service"

# Build and deploy 
docker build -t ${IMAGE_NAME}:latest . && \
docker push ${IMAGE_NAME}:latest && \
gcloud run deploy ${SERVICE_NAME} \
  --image=${IMAGE_NAME}:latest \
  --region=${REGION} \
  --project=${PROJECT}