FROM golang:1.25-alpine AS build

WORKDIR /src

# download deps first to leverage cache
COPY go.mod go.sum ./
RUN go mod download

# copy source and build
COPY . .

# build static binary for linux
RUN CGO_ENABLED=0 GOOS=linux go build -o /server ./...

FROM alpine:3.18

# needed for TLS and other system cert lookups
RUN apk add --no-cache ca-certificates

# create unprivileged user
RUN addgroup -S app && adduser -S -G app app

WORKDIR /app
COPY --from=build /server /app/server
RUN chown app:app /app/server || true
USER app

EXPOSE 8080

CMD ["/app/server"]