#!/bin/sh
set -eu

base_url="${KEYCLOAK_BASE_URL:-http://keycloak:8080}"
admin_user="${KEYCLOAK_ADMIN:-admin}"
admin_pass="${KEYCLOAK_ADMIN_PASSWORD:-admin}"
realm="${KEYCLOAK_REALM:-rgr}"

echo "[keycloak-init] Waiting for Keycloak at $base_url ..."
for i in $(seq 1 60); do
  code=$(curl -s -o /dev/null -w "%{http_code}" "$base_url/realms/master") || code="000"
  if [ "$code" = "200" ]; then
    break
  fi
  sleep 2
done

echo "[keycloak-init] Getting admin token ..."
token=$(curl -s \
  -d "grant_type=password" \
  -d "client_id=admin-cli" \
  -d "username=$admin_user" \
  -d "password=$admin_pass" \
  "$base_url/realms/master/protocol/openid-connect/token" \
  | sed -n 's/.*"access_token"[ ]*:[ ]*"\([^"]*\)".*/\1/p')

if [ -z "$token" ]; then
  echo "[keycloak-init] Failed to obtain admin token" >&2
  exit 1
fi

echo "[keycloak-init] Ensuring realm verifyEmail=true ..."
curl -s -o /dev/null -X PUT \
  -H "Authorization: Bearer $token" \
  -H "Content-Type: application/json" \
  -d '{"verifyEmail":true}' \
  "$base_url/admin/realms/$realm" || true

if [ -z "${GOOGLE_CLIENT_ID:-}" ] || [ -z "${GOOGLE_CLIENT_SECRET:-}" ]; then
  echo "[keycloak-init] GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET not set; skipping Google IdP setup."
  exit 0
fi

payload=$(cat <<EOF
{
  "alias": "google",
  "providerId": "google",
  "enabled": true,
  "trustEmail": true,
  "storeToken": false,
  "addReadTokenRoleOnCreate": false,
  "authenticateByDefault": false,
  "linkOnly": false,
  "firstBrokerLoginFlowAlias": "first broker login",
  "config": {
    "clientId": "${GOOGLE_CLIENT_ID}",
    "clientSecret": "${GOOGLE_CLIENT_SECRET}",
    "defaultScope": "openid profile email"
  }
}
EOF
)

echo "[keycloak-init] Configuring Google IdP in realm $realm ..."
status=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer $token" \
  "$base_url/admin/realms/$realm/identity-provider/instances/google")

if [ "$status" = "200" ]; then
  curl -s -o /dev/null -X PUT \
    -H "Authorization: Bearer $token" \
    -H "Content-Type: application/json" \
    -d "$payload" \
    "$base_url/admin/realms/$realm/identity-provider/instances/google"
  echo "[keycloak-init] Google IdP updated."
else
  curl -s -o /dev/null -X POST \
    -H "Authorization: Bearer $token" \
    -H "Content-Type: application/json" \
    -d "$payload" \
    "$base_url/admin/realms/$realm/identity-provider/instances"
  echo "[keycloak-init] Google IdP created."
fi
