FROM mcr.microsoft.com/playwright:v1.58.1-jammy

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

ENV CI=true
ENV SKIP_WEBKIT=true
ENV HEADLESS=true

CMD ["npm", "run", "test:e2e"]
