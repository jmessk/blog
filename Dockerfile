FROM node:22-bookworm

ARG UID
ARG GID

RUN groupmod -g ${UID} node  \
    && usermod -u ${UID} -g ${GID} node

USER ${UID}
WORKDIR /home/node
