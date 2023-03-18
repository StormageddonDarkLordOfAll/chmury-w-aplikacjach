FROM node:16-alpine

WORKDIR /app

COPY ./app .

RUN npm ci
# && npm run build\
# && npm uninstall -g serve\
# && npm install -g serve@10.1.1

ENV NODE_ENV production

EXPOSE 5173

# CMD [ "npx", "serve", "-s", "build", "-p", "5173" ]
CMD [ "npm", "run", "dev" ]