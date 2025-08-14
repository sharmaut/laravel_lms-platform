FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build the production-ready static files
RUN npm run build


# STAGE 2: The "Server" Stage (the bakery shop)
# Use a lightweight Nginx image to serve the files
FROM nginx:stable-alpine

# Copy the built files from the "build" stage into the Nginx web root
# Vite builds to a "dist" folder, so we copy from there
COPY --from=build /app/dist /usr/share/nginx/html

# Copy our custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for the web server
EXPOSE 80

# The command to start the Nginx server
CMD ["nginx", "-g", "daemon off;"]