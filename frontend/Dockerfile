FROM node:20-alpine AS build

WORKDIR /app

# copy package files first for better layer caching
COPY package*.json ./

# use npm ci when package-lock.json is present for reproducible builds
RUN if [ -f package-lock.json ]; then npm ci --legacy-peer-deps; else npm install --legacy-peer-deps; fi

# copy source and build
COPY . .
RUN npm run build

FROM nginx:stable-alpine

# replace default nginx config if provided
RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/

# copy built assets
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]