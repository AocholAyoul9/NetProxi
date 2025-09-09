# Stage 1: Build Angular
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
#RUN npm run build   # make sure "build" script exists in package.json

# Stage 2: Serve via Nginx
FROM nginx:alpine
#COPY --from=build /app/dist/your-angular-app /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
