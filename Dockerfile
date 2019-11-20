FROM node:10-slim
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
RUN apt-get update && \
  apt-get upgrade -y && \
  apt-get install -y git && \
  apt-get install -y ruby-full && \
  gem install hoc && \
  apt-get install -y iputils-ping && \
  apt-get install -y nano
COPY . .
RUN ./bin/install-sonar-scanner.sh
EXPOSE 9001
CMD npm start