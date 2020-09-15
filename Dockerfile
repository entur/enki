FROM node:9.11.2-alpine

# Server
ENV CONTENT_BASE=/app/ui
COPY server /app/server
WORKDIR /app/server
RUN npm install --production

# Application
COPY build /app/ui/
ARG BUILD_DATE
ENV BUILD_DATE=$BUILD_DATE

EXPOSE 9000
CMD ["node", "src/server.js"]