# Use lightweight NGINX base image
FROM nginx:alpine

# Copy all frontend files into NGINX html folder
COPY . /usr/share/nginx/html

# Expose port 80 for HTTP traffic
EXPOSE 80

# Start NGINX server
CMD ["nginx", "-g", "daemon off;"]
