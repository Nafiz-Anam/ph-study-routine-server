# Use the official Node.js 20 as a parent image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) files
# COPY package*.json ./
# If you're using Yarn, you might also need to copy yarn.lock file
COPY package.json yarn.lock ./

# Install dependencies
# For npm users:
# RUN npm install
# For Yarn users:
RUN yarn install

# Copy the rest of your app's source code from your host to your image filesystem.
COPY . .

# Expose port 5000 to the outside once the container has launched
EXPOSE 5000

# Define the command to run your app using CMD which defines your runtime
# Here we will use node to run the application
CMD [ "npm", "start" ]
