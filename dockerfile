FROM node:18-alpine AS BASEIMAGE

WORKDIR /src
COPY package*.json ./
RUN npm i
COPY . .
RUN npm run prebuild && npm run build && npm prune --production

FROM node:18-alpine

WORKDIR /src
ENV TZ=Asia/Ho_Chi_Minh
RUN mkdir -p /src/data
COPY --from=BASEIMAGE /tmp/* /src/data
COPY --from=BASEIMAGE /src/dist /src/dist
COPY --from=BASEIMAGE /src/node_modules /src/node_modules
EXPOSE 3000

CMD ["node", "dist/main.js"]