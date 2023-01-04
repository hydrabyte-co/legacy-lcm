git pull origin main
git submodule update --recursive
docker build /app/lcm-service/ -t lcm-service:latest