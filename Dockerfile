FROM node:8
MAINTAINER Mario Behling <mb@mariobehling.de>

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN apt-get update && apt-get clean && rm -rf /var/lib/apt/lists/*

# install deps
RUN apt-get install curl
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash
RUN apt-get install -y --no-install-recommends nodejs && apt-get clean -y

# copy requirements
COPY package.json /usr/src/app/
COPY app.json /usr/src/app/
COPY tslint.json /usr/src/app/
COPY angular-cli.json /usr/src/app/

# Bundle app source
COPY . /usr/src/app

# install requirements
RUN npm install -g @angular/cli@latest
RUN npm install

EXPOSE 4200

CMD ["ng", "serve"]
