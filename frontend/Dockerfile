# Use Node.js as base image
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and install dependencies
<<<<<<< HEAD
COPY package.json ./
=======
COPY package.json package-lock.json ./
>>>>>>> 8e856e6 (initial commit)
RUN npm install

# Copy all files
COPY . .

CMD ["npm", "start"]

# # Build React app
# RUN npm run build

# # Serve the app using a lightweight web server
# RUN npm install -g serve
# CMD ["serve", "-s", "build", "-l", "3000"]

<<<<<<< HEAD
<<<<<<< HEAD
EXPOSE 3001
=======
EXPOSE 3000
>>>>>>> 8e856e6 (initial commit)
=======
EXPOSE 3001
>>>>>>> d0e94ba (initial commit)
