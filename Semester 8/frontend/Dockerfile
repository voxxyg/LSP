# Build stage
FROM node:18.16.0-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN apk add --no-cache tzdata
RUN npm install
COPY . ./
RUN npm run build

# Runtime stage
FROM nginx:1.19-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
ENV TZ=Asia/Jakarta
EXPOSE 3005
CMD ["nginx", "-g", "daemon off;"]