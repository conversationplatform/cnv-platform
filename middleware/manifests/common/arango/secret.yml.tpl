apiVersion: v1
kind: Secret
metadata:
  name: arango-secret
type: Opaque
stringData:
  ARANGO_ROOT_PASSWORD: $ARANGO_ROOT_PASSWORD
