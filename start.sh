#!/bin/bash

# Run Prisma migration
npx prisma migrate deploy --schema=/app/prisma/schema.prisma

# Start the server
/app/shoppiserver/index
