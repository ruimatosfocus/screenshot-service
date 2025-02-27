#!/bin/bash

# Set variables
IMAGE_NAME="europe-west4-docker.pkg.dev/virtual-venue-stg-7102ffeb/screenshot-service/screenshot-api"
REGION="europe-west4"
PROJECT="virtual-venue-stg-7102ffeb"
SERVICE_NAME="screenshot-service"

# Build and deploy 
echo "Building and pushing Docker image..."
docker build --platform="linux/amd64" -t ${IMAGE_NAME}:latest .
docker push ${IMAGE_NAME}:latest 

echo "Deploying to Cloud Run..."
gcloud run deploy ${SERVICE_NAME} \
  --image=${IMAGE_NAME}:latest \
  --region=${REGION} \
  --project=${PROJECT}