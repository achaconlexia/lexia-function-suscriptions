-- npm run worker:dev:local
-- npm run worker:tail
-- npm run worker:deploy

# Crear Plan: Se crea en OpenMeter y se agrega a la base de datos:

## Caso local

```bash
curl -X POST http://localhost:8787/subscriptions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer iR6wTBj1vb4OeefgGAm2TY9uG14PUQsa" \
  -d '{
    "subjectKey": "user_9",
    "organizationName": "Mi Empresa",
    "planKey": "enterprise",ñ
    "paymentId": "payment_123"
  }'


```

- Response :

```json
{
	"success": true,
	"data": [
		{
			"id": "e7477669-45fd-4bbd-abcf-0377208a12ee",
			"subscriptionId": "01K5YWQ7W4ZZPDM5EXAM9AWA2T",
			"customerId": "01K5YWQ6W9061DYE3T9V24ZA5A",
			"subjectKey": "user_10",
			"userId": "user_10",
			"workspaceId": "Axel_10",
			"organizationName": "Axel_10",
			"planKey": "enterprise",
			"status": "active",
			"startDate": "2025-09-24T22:15:20.678Z",
			"endDate": null,
			"currency": "USD",
			"paymentId": "payment_1233",
			"metadata": null,
			"createdAt": "2025-09-24T17:15:21.181Z",
			"updatedAt": "2025-09-24T17:15:21.181Z"
		}
	]
}
```

## Caso nube

## Caso local

```bash
curl -X POST https://lexia-function-suscriptions-v2.tolaw-dev-workspace.workers.dev/subscriptions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer iR6wTBj1vb4OeefgGAm2TY9uG14PUQsa" \
  -d '{
    "subjectKey": "user_11",
    "organizationName": "Axel_11",
    "planKey": "enterprise",
	"monto": "300",
    "paymentId": "payment_1234"
  }'


```

- Response :

```json
{
	"success": true,
	"data": [
		{
			"id": "e7477669-45fd-4bbd-abcf-0377208a12ee",
			"subscriptionId": "01K5YWQ7W4ZZPDM5EXAM9AWA2T",
			"customerId": "01K5YWQ6W9061DYE3T9V24ZA5A",
			"subjectKey": "user_10",
			"userId": "user_10",
			"workspaceId": "Axel_10",
			"organizationName": "Axel_10",
			"planKey": "enterprise",
			"status": "active",
			"startDate": "2025-09-24T22:15:20.678Z",
			"endDate": null,
			"currency": "USD",
			"paymentId": "payment_1233",
			"metadata": null,
			"createdAt": "2025-09-24T17:15:21.181Z",
			"updatedAt": "2025-09-24T17:15:21.181Z"
		}
	]
}
```

# Listar todas las suscripciones
