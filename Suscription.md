# link repo: https://github.com/achaconlexia/lexia-function-suscriptions

# token_openMeter="om_hy8XwZ7gZQOAXM9DbUIRZhxdUFjKaF01.IX2r-UvhELv3MqTn6bCKEc7n64I0qkBCAzT36NaF4wk"

# Suscription

## Crear la suscripción (Organización, plan y pago. )

## Plan ed pago por organizaciones

- Paso 1 creas el subject y extraes el "key" del subject

```bash
curl -X POST https://openmeter.cloud/api/v1/subjects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer om_hy8XwZ7gZQOAXM9DbUIRZhxdUFjKaF01.IX2r-UvhELv3MqTn6bCKEc7n64I0qkBCAzT36NaF4wk" \
  -d '[
    {
        "key": "user_7",
        "displayName": "Juan Pérez 6",
        "metadata": {
            "email": "123456",
        }
    }
]'
```

- response

```json
[
	{
		"createdAt": "2025-09-24T08:56:19.879902Z",
		"displayName": "Juan Pérez 6",
		"id": "01K5XF06N7DWR1BF3GF3QJ5K9T",
		"key": "user_7",
		"metadata": {
			"department": "engineering",
			"hubspotId": "123456",
			"plan": "premium"
		},
		"stripeCustomerId": null,
		"updatedAt": "2025-09-24T08:59:59.599191Z"
	}
]
```

- Paso 2 en Custores se asigna de manera automática el subject con su propio key y extraes el ID del customer

```bash
curl -X GET "https://openmeter.cloud/api/v1/customers/user_7" \
  -H "Content-Type: application/json"
```

- response

```json
{
	"annotations": {
		"createdBy": "customer.provisioner",
		"subjectId": "01K5XF06N7DWR1BF3GF3QJ5K9T"
	},
	"createdAt": "2025-09-24T08:56:19.897536Z",
	"id": "01K5XF06NS71R176CKFG5GZF3W",
	"key": "user_7",
	"metadata": {
		"department": "engineering",
		"hubspotId": "123456",
		"plan": "premium"
	},
	"name": "Juan Pérez 6",
	"updatedAt": "2025-09-24T08:56:19.897537Z",
	"usageAttribution": {
		"subjectKeys": ["user_7"]
	}
}
```

- Paso 3: con ese id que es "01K5XF06NS71R176CKFG5GZF3W", añades el plan de suscripción:

```bash
curl -X POST https://openmeter.cloud/api/v1/subscriptions \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "01K5XF06NS71R176CKFG5GZF3W",
    "plan": {
        "key": "enterprise",
        "version": 1
    },
    "metadata": {
        "IdPago": "019142cc-a016-796a-8113-1a942fecd26d",
        "Monto": "300"
    }
}'
```

- response

```json
{
	"activeFrom": "2025-09-24T09:31:51.542978Z",
	"alignment": {
		"billablesMustAlign": true
	},
	"billingAnchor": "2025-09-24T09:31:51.542978Z",
	"billingCadence": "P1M",
	"createdAt": "2025-09-24T09:31:51.560635Z",
	"currency": "USD",
	"customerId": "01K5XF06NS71R176CKFG5GZF3W",
	"id": "01K5XH18C82X6QQH5E0SRW8BTV",
	"metadata": {
		"IdPago": "019142cc-a016-796a-8113-1a942fecd26d",
		"Monto": "300"
	},
	"name": "Enterprise",
	"plan": {
		"id": "01K5QWGGNEG8FJR01CN79256M0",
		"key": "enterprise",
		"version": 1
	},
	"proRatingConfig": {
		"enabled": true,
		"mode": "prorate_prices"
	},
	"status": "active",
	"updatedAt": "2025-09-24T09:31:51.560635Z"
}
```

## Listar los suscription

- Paso 1: Get Suscription creados (obtengo todo menos el nombre de la organización sino solo sus ID user que es customerId)

```bash
curl -X GET https://openmeter.cloud/api/v1/subscriptions/01K5XH18C82X6QQH5E0SRW8BTV
```

- response

```json
{
	"activeFrom": "2025-09-24T09:31:51.542978Z",
	"alignment": {
		"billablesMustAlign": true,
		"currentAlignedBillingPeriod": {
			"from": "2025-09-24T09:31:51.542978Z",
			"to": "2025-10-24T09:31:51.542978Z"
		}
	},
	"billingAnchor": "2025-09-24T09:31:51.542978Z",
	"billingCadence": "P1M",
	"createdAt": "2025-09-24T09:31:51.560635Z",
	"currency": "USD",
	"customerId": "01K5XF06NS71R176CKFG5GZF3W",
	"id": "01K5XH18C82X6QQH5E0SRW8BTV",
	"metadata": {
		"IdPago": "019142cc-a016-796a-8113-1a942fecd26d",
		"Monto": "300"
	},
	"name": "Enterprise",
	"phases": [
		{
			"activeFrom": "2025-09-24T09:31:51.542978Z",
			"createdAt": "2025-09-24T09:31:51.57371Z",
			"id": "01K5XH18CNDSRV5PAN4Y8VEKRT",
			"itemTimelines": {
				"tokens_total_axel": [
					{
						"activeFrom": "2025-09-24T09:31:51.542978Z",
						"billingCadence": "P1M",
						"createdAt": "2025-09-24T09:31:51.705712Z",
						"featureKey": "tokens_total_axel",
						"id": "01K5XH18GSG2RCTNVS5JQA9DBN",
						"included": {
							"entitlement": {
								"activeFrom": "2025-09-24T09:31:51.542978Z",
								"annotations": {
									"subscription.id": "01K5XH18C82X6QQH5E0SRW8BTV"
								},
								"createdAt": "2025-09-24T09:31:51.624354Z",
								"currentUsagePeriod": {
									"from": "2025-09-24T09:31:00Z",
									"to": "2025-10-24T09:31:00Z"
								},
								"featureId": "01K5QWS2N8S53FZH5TA9XC9VS3",
								"featureKey": "tokens_total_axel",
								"id": "01K5XH18E8439MF1ESDP7MKVJ5",
								"isSoftLimit": false,
								"isUnlimited": false,
								"issueAfterReset": 1,
								"lastReset": "2025-09-24T09:31:00Z",
								"measureUsageFrom": "2025-09-24T09:31:00Z",
								"preserveOverageAtReset": false,
								"subjectKey": "user_7",
								"type": "metered",
								"updatedAt": "2025-09-24T09:31:51.624354Z",
								"usagePeriod": {
									"anchor": "2025-09-24T09:31:00Z",
									"interval": "MONTH",
									"intervalISO": "P1M"
								}
							},
							"feature": {
								"createdAt": "2025-09-22T05:01:39.880165Z",
								"id": "01K5QWS2N8S53FZH5TA9XC9VS3",
								"key": "tokens_total_axel",
								"meterSlug": "tokens_total_axel",
								"name": "tokens_total_axel",
								"updatedAt": "2025-09-22T05:01:39.880165Z"
							}
						},
						"key": "tokens_total_axel",
						"metadata": null,
						"name": "tokens_total_axel",
						"price": {
							"amount": "5",
							"type": "unit"
						},
						"taxConfig": {},
						"updatedAt": "2025-09-24T09:31:51.705712Z"
					}
				]
			},
			"items": [
				{
					"activeFrom": "2025-09-24T09:31:51.542978Z",
					"billingCadence": "P1M",
					"createdAt": "2025-09-24T09:31:51.705712Z",
					"featureKey": "tokens_total_axel",
					"id": "01K5XH18GSG2RCTNVS5JQA9DBN",
					"included": {
						"entitlement": {
							"activeFrom": "2025-09-24T09:31:51.542978Z",
							"annotations": {
								"subscription.id": "01K5XH18C82X6QQH5E0SRW8BTV"
							},
							"createdAt": "2025-09-24T09:31:51.624354Z",
							"currentUsagePeriod": {
								"from": "2025-09-24T09:31:00Z",
								"to": "2025-10-24T09:31:00Z"
							},
							"featureId": "01K5QWS2N8S53FZH5TA9XC9VS3",
							"featureKey": "tokens_total_axel",
							"id": "01K5XH18E8439MF1ESDP7MKVJ5",
							"isSoftLimit": false,
							"isUnlimited": false,
							"issueAfterReset": 1,
							"lastReset": "2025-09-24T09:31:00Z",
							"measureUsageFrom": "2025-09-24T09:31:00Z",
							"preserveOverageAtReset": false,
							"subjectKey": "user_7",
							"type": "metered",
							"updatedAt": "2025-09-24T09:31:51.624354Z",
							"usagePeriod": {
								"anchor": "2025-09-24T09:31:00Z",
								"interval": "MONTH",
								"intervalISO": "P1M"
							}
						},
						"feature": {
							"createdAt": "2025-09-22T05:01:39.880165Z",
							"id": "01K5QWS2N8S53FZH5TA9XC9VS3",
							"key": "tokens_total_axel",
							"meterSlug": "tokens_total_axel",
							"name": "tokens_total_axel",
							"updatedAt": "2025-09-22T05:01:39.880165Z"
						}
					},
					"key": "tokens_total_axel",
					"metadata": null,
					"name": "tokens_total_axel",
					"price": {
						"amount": "5",
						"type": "unit"
					},
					"taxConfig": {},
					"updatedAt": "2025-09-24T09:31:51.705712Z"
				}
			],
			"key": "default",
			"metadata": null,
			"name": "Default",
			"updatedAt": "2025-09-24T09:31:51.573715Z"
		}
	],
	"plan": {
		"id": "01K5QWGGNEG8FJR01CN79256M0",
		"key": "enterprise",
		"version": 1
	},
	"proRatingConfig": {
		"enabled": true,
		"mode": "prorate_prices"
	},
	"status": "active",
	"updatedAt": "2025-09-24T09:31:51.560635Z"
}
```

- Paso 2: Get nombre de la organiación donde extraigo a pepito

```bash
curl -X GET https://openmeter.cloud/api/v1/customers/01K5XF06NS71R176CKFG5GZF3W
```

- response

```json
{
	"annotations": {
		"createdBy": "customer.provisioner",
		"subjectId": "01K5XF06N7DWR1BF3GF3QJ5K9T"
	},
	"createdAt": "2025-09-24T08:56:19.897536Z",
	"currency": "USD",
	"currentSubscriptionId": "01K5XH18C82X6QQH5E0SRW8BTV",
	"id": "01K5XF06NS71R176CKFG5GZF3W",
	"key": "user_7",
	"metadata": {
		"department": "engineering",
		"hubspotId": "123456",
		"plan": "premium"
	},
	"name": "Juan Pérez 6",
	"updatedAt": "2025-09-24T09:31:51.77409Z",
	"usageAttribution": {
		"subjectKeys": ["user_7"]
	}
}
```

--- de tablas obtengo todos esos tres datos y todos los campos de la tabla

## Eliminar suscripción

curl https://openmeter.cloud/api/v1/subscriptions/01K5XH18C82X6QQH5E0SRW8BTV \
 --request DELETE \
 --header 'Authorization: Bearer YOUR_SECRET_TOKEN'

## SI está sucrito o no

- Crear tabla de suscripción donde está el user_id, suscription_id, id_organization, nombre_organiacion o user paa la tabla de crear ya que el ID de Sucription lo usaré
- Paso lógica:
  De las tablas , creo una fucnión para validar si está suscrito donde le paso el "suscription_id" con el respectivo "user_id" donde ve si está "activo" así que la respuesta es "Suscrito" o "null"
- Enviar una sucription como no activo y listar

# npx wrangler hyperdrive get cd60532fec124dbebddcf623a8adc5b9
