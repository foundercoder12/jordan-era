#!/bin/sh
set -e

if wget -q -O - http://localhost:3000/health | grep -q '"status":"healthy"'; then
  exit 0
else
  exit 1
fi
