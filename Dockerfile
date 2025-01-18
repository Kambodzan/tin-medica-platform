# Use the Node.js base image
FROM node:18

# Set the working directory inside the container
WORKDIR /

# Copy the package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install root dependencies (for concurrently)
RUN npm install

# Copy the application code into the container
COPY . .

# Install dependencies for the React app
RUN npm install --prefix tin-medica

# Expose the ports used by the server and client
EXPOSE 5000 3000

# Start the application using concurrently
CMD ["npm", "run", "start"]