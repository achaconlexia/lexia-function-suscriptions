# Link suscripción: https://lexia-function-suscriptions-v1.tolaw-dev-workspace.workers.dev

# para el caso test-gateway@example.com

```bash
curl -X POST "https://api.devlexia.cc/v1/auth/sign-in/email" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test-gateway@example.com",
    "password": "superseguro123"
  }' \
  -i
```

# Payments

## Crear payments

- Solicitud

```bash

curl http://localhost:8787/payments \
  --request POST \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer AaRN5SCRzN1ZrGh1s5rpOtsgYeJudZY3' \
  --data '{
    "workspaceId": "workspace-2",
    "gatewayId": "gateway-2",
    "amount": "100.00",
    "currency": "USD",
    "method": "Tarjeta",
    "type": "manual",
    "status": "Pendiente",
    "organizationName": "MiOrganización",
    "attemptDate": "2025-04-05T10:00:00Z"
  }'
```

- Respuesta

```json
{
	"success": true,
	"data": [
		{
			"id": "fb73b7ba-3eaf-457f-83eb-6ae683c0ad32",
			"organizationName": "MiOrganización",
			"workspaceId": "workspace-id",
			"invoiceId": null,
			"gatewayId": "gateway-id",
			"amount": "100.00",
			"currency": "USD",
			"status": "Pendiente",
			"method": "Tarjeta",
			"type": "manual",
			"attemptDate": "2025-04-05T10:00:00.000Z",
			"confirmedDate": null,
			"storagePath": null,
			"createdAt": "2025-09-24T07:30:19.062Z",
			"updatedAt": "2025-09-24T07:30:19.062Z"
		}
	]
}
```

## Listar payments

- Solicitud

```bash

curl "https://api.devlexia.cc/v1/payments?workspaceId=workspace-id&page=1&limit=20&status=Exitoso&method=Tarjeta" \
  --header 'Authorization: Bearer AaRN5SCRzN1ZrGh1s5rpOtsgYeJudZY3'

  curl "https://api.devlexia.cc/v1/payments?workspaceId=workspace-id&page=1&limit=20&status=Pendiente&method=Tarjeta" \
  --header 'Authorization: Bearer AaRN5SCRzN1ZrGh1s5rpOtsgYeJudZY3'
```

- Respuesta

```json

```

## Obtener payments por ID del payments

- Solicitud

```bash

curl https://api.devlexia.cc/payments/fb73b7ba-3eaf-457f-83eb-6ae683c0ad32 \
  --header 'Authorization: Bearer AaRN5SCRzN1ZrGh1s5rpOtsgYeJudZY3'
```

- Respuesta

```json
{
	"success": true,
	"data": {
		"id": "fb73b7ba-3eaf-457f-83eb-6ae683c0ad32",
		"organizationName": "Mi Organización",
		"workspaceId": "workspace-id",
		"invoiceId": null,
		"gatewayId": "gateway-id",
		"amount": "100.00",
		"currency": "USD",
		"status": "Pendiente",
		"method": "Tarjeta",
		"type": "manual",
		"attemptDate": "2025-04-05T10:00:00.000Z",
		"confirmedDate": null,
		"storagePath": null,
		"createdAt": "2025-09-24T07:30:19.062Z",
		"updatedAt": "2025-09-24T07:30:19.062Z"
	}
}
```

## Actualizar un pago

- Solicitud

```bash

curl https://api.devlexia.cc/payments/payment-id \
  --request PUT \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer AaRN5SCRzN1ZrGh1s5rpOtsgYeJudZY3' \
  --data '{
    "status": "Exitoso",
    "amount": "120.00",
    "method": "PayPal",
    "confirmedDate": "2025-04-05T12:00:00Z"
  }'
```

- Respuesta

```json

```

## Eliminar un pago

- Solicitud

```bash

curl https://api.devlexia.cc/payments/payment-id \
  --request DELETE \
  --header 'Authorization: Bearer AaRN5SCRzN1ZrGh1s5rpOtsgYeJudZY3'
```

- Respuesta

```json

```

## Subir comprobante de pago

- Solicitud

```bash

curl https://api.devlexia.cc/payments/payment-id/receipt \
  --request POST \
  --header 'Authorization: Bearer AaRN5SCRzN1ZrGh1s5rpOtsgYeJudZY3' \
  --form 'file=@ruta/al/archivo.pdf' \
  --form 'workspaceId=workspace-id' \
  --form 'userId=user-id'
```

- Respuesta

```json

```

## Obtener URL del comprobante

- Solicitud

```bash

curl https://api.devlexia.cc/payments/payment-id/receipt \
  --header 'Authorization: Bearer AaRN5SCRzN1ZrGh1s5rpOtsgYeJudZY3'
```

- Respuesta

```json

```
