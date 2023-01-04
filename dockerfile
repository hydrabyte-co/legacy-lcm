FROM node:16.14.2-slim AS BASEIMAGE

WORKDIR /src
COPY package*.json ./
RUN npm i
COPY . .
RUN npm run prebuild && npm run build && npm prune --production

FROM node:16.14.2-slim

WORKDIR /src
ENV TZ=Asia/Ho_Chi_Minh
COPY --from=BASEIMAGE /src/dist /src/dist
COPY --from=BASEIMAGE /src/node_modules /src/node_modules
EXPOSE 3000

CMD ["node", "dist/main.js"]