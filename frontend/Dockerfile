FROM node:18

WORKDIR /srv/frontend

COPY package*.json ./
RUN npm ci --silent

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
