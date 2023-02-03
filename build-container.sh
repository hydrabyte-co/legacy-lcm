git pull origin main
git submodule update --recursive
docker build ./ -t lcm-service:latest
docker push registry.gitlab.com/bitthing.io/lcm-service