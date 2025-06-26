# frontend/Dockerfile
# Étape 1 : Build Angular
FROM node:18-alpine as build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --prod

# Étape 2 : Serve via Nginx
FROM nginx:alpine
COPY --from=build /app/dist/ /usr/share/nginx/html
EXPOSE 80
