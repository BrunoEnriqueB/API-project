FROM node:12

WORKDIR /src

ADD . /src 
RUN npm i --silent

EXPOSE 8080
CMD [ "npm", "run", "dev:watch" ]