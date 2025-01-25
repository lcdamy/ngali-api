# environment to run my application into (Node version 18)
FROM node:23-alpine3.20

# setting container woking directory
WORKDIR /app

# copying my file into the container working directory
COPY . .

# Install package
RUN npm install

# Expose the port
EXPOSE 8001

# Final command to start my vite app
CMD ["npm", "run", "dev"]
