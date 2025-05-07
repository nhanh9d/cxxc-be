
# Use the official Node.js image as the base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the NestJS application
RUN npm run build

# Echo DB_HOST with prefix
RUN echo "DB_HOST: $DB_HOST"

# Run migrations
RUN npm run migration:run:prod
RUN npm run migration:show:prod

# Expose the application port
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/src/main"]
