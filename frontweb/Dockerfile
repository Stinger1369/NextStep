# frontweb/Dockerfile
FROM node:20

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .

# Désactiver ESLint pendant la construction
ENV DISABLE_ESLINT_PLUGIN=true

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]
