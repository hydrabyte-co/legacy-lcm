cat hosts | xargs -I HOST scp -r ./dist HOST:~/apps/lcm-service/;
cat hosts | xargs -I HOST ssh HOST pm2 restart lcm-api