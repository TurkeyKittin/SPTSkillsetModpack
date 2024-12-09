# Stage 1: Build FIKA Server
FROM node:20.11.1-alpine AS fika-builder
ARG FIKA_VERSION=main
RUN apk add --no-cache git unzip && \
git clone -b ${FIKA_VERSION} --depth=1 https://github.com/project-fika/Fika-Server.git /fika-server && \
cd /fika-server && \
npm install && npm run build && \
mkdir output && cd output && unzip /fika-server/dist/fika-server.zip

# Stage 2: Build SPT Server
FROM node:20.11.1-alpine AS server-builder
ARG SPT_VERSION=master
RUN apk add --no-cache git git-lfs && \
git clone -b ${SPT_VERSION} --depth=1 https://github.com/sp-tarkov/server.git /spt-server-build && \
cd /spt-server-build && git lfs pull && \
cd project && \
npm install && npm run build:release

# Stage 3: Clone SPTSkillsetModpack
FROM alpine:latest AS mods-builder
RUN apk add --no-cache git && \
git clone --depth=1 https://github.com/TurkeyKittin/SPTSkillsetModpack.git /spt-mods && \
mkdir -p /spt-mods/output && \
cp -r /spt-mods/user /spt-mods/output && \
cp -r /spt-mods/BepInEx /spt-mods/output

# Stage 4: Final Image
FROM debian:bookworm-slim

COPY --from=server-builder /spt-server-build/project/build/ /app/spt-server/
COPY --from=fika-builder /fika-server/output/ /app/spt-server/
COPY --from=mods-builder /spt-mods/output/ /app/spt-server/

VOLUME /opt/spt-server
WORKDIR /opt/spt-server

EXPOSE 6969
ENV TZ=America/Chicago
ENV backendIp=""
ENV backendPort="6969"
ENV webSocketPingDelayMs="90000"
ENV FIKA_VERSION=main
ENV SPT_VERSION=master

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 CMD curl -f http://localhost:6969/health || exit 1