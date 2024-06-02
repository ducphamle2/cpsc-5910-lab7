ARG NODE_VERSION=18.18.0

FROM node:${NODE_VERSION}

WORKDIR /app

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.yarn to speed up subsequent builds.
# Leverage a bind mounts to package.json and yarn.lock to avoid having to copy them into
# into this layer.

COPY . .

RUN yarn install --frozen-lockfile

# Expose the port that the application listens on.
EXPOSE 5001

# Run the application.
CMD yarn start
