# Use Node.js as base image
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy all files
COPY . .

CMD ["npm", "start"]

# # Build React app
# RUN npm run build

# # Serve the app using a lightweight web server
# RUN npm install -g serve
# CMD ["serve", "-s", "build", "-l", "3000"]

EXPOSE 3001
