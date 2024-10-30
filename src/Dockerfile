FROM node:alpine
COPY package*.json /app/
WORKDIR /app
RUN npm install
COPY index.js /app/index.js
ENV FORCE_COLOR=1
CMD ["node", "index.js"]