FROM node:6-alpine
WORKDIR /proj
CMD npm install && \
    ng build && \
    ng test --watch=false && \
    ng lint && \
    mkdir -p shared && \
    mv coverage.txt shared
