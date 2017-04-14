FROM markadams/chromium-xvfb-js:7
COPY . /usr/src/app
WORKDIR /usr/src/app
CMD npm install && \
    node_modules/.bin/ng build && \
    node_modules/.bin/ng test --watch=false && \
    node_modules/.bin/ng lint && \
