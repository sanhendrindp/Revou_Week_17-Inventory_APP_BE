# Use Node.js runtime as a parent image
FROM node:latest

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the entire current directory into the working directory
COPY . .

# Expose the port your Express app will run on
EXPOSE 3000

# Start your Express app
CMD [ "node", "app.js" ]