# Use the Node.js base image
FROM node:22

# Set the working directory inside the container
WORKDIR /usr/app

# Copy the package.json and package-lock.json to install dependencies
COPY package*.json ./

# Clear npm cache and install root dependencies (for concurrently)
RUN npm install

# Copy the application code into the container
COPY . .

# Install dependencies for the React app
WORKDIR /usr/app/tin-medica
RUN npm install

# Expose the ports used by the server and client
EXPOSE 5000 3000

# Start the application using concurrently
CMD ["npm", "run", "start"]
