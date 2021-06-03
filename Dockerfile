FROM node:10.24.1-alpine3.10

RUN addgroup appuser && adduser --disabled-password --gecos '' appuser --ingroup appuser

# Server
ENV CONTENT_BASE=/app/ui
COPY server /app/server
WORKDIR /app/server
RUN npm install --production

# Application
COPY build /app/ui/

RUN chown -R appuser:appuser /app
USER appuser

ARG BUILD_DATE
ENV BUILD_DATE=$BUILD_DATE

EXPOSE 9000
CMD ["node", "src/server.js"]
