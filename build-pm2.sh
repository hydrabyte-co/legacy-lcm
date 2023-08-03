git pull origin main
git submodule foreach git pull origin main
npm run build
pm2 restart lcm-api
