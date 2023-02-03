git pull origin main
git submodule foreach git pull origin main
docker build ./ -t registry.gitlab.com/bitthing.io/lcm-service:latest
docker push registry.gitlab.com/bitthing.io/lcm-service