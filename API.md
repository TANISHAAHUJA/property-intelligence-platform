# 🔗 Property Intelligence Platform - API Documentation

## Base URL
```
Development: http://localhost:8000/api/v1
Production: https://api.propertyintelligence.ai/v1
```

## Authentication

### Login
```http
POST /auth/login
Content-Type: application/x-www-form-urlencoded

username=user@example.com&password=password123
```

**Response:**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer",
  "expires_in": 1800,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "user"
  }
}
```

### Register
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "John Doe",
  "company_name": "Insurance Corp",
  "company_role": "Risk Analyst",
  "role": "user"
}
```

## Properties

### Create Property
```http
POST /properties
Authorization: Bearer {token}
Content-Type: application/json

{
  "address": "123 Main St",
  "city": "San Francisco",
  "state": "CA",
  "zip_code": "94102",
  "property_type": "residential",
  "year_built": 1995,
  "square_footage": 2500,
  "bedrooms": 3,
  "bathrooms": 2.5,
  "start_analysis": true
}
```

**Response:**
```json
{
  "id": "property-uuid",
  "address": "123 Main St",
  "city": "San Francisco",
  "state": "CA",
  "zip_code": "94102",
  "latitude": 37.7749,
  "longitude": -122.4194,
  "property_type": "residential",
  "year_built": 1995,
  "square_footage": 2500,
  "bedrooms": 3,
  "bathrooms": 2.5,
  "is_analyzed": false,
  "created_at": "2024-01-15T10:00:00Z"
}
```

### Get Properties
```http
GET /properties?skip=0&limit=50&city=San Francisco
Authorization: Bearer {token}
```

### Get Property Details
```http
GET /properties/{property_id}
Authorization: Bearer {token}
```

### Update Property
```http
PUT /properties/{property_id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "current_value": 850000,
  "square_footage": 2600
}
```

### Search Properties
```http
POST /properties/search
Authorization: Bearer {token}
Content-Type: application/json

{
  "query": "San Francisco",
  "property_type": "residential",
  "min_value": 500000,
  "max_value": 1000000,
  "center_lat": 37.7749,
  "center_lng": -122.4194,
  "radius_km": 5.0,
  "sort_by": "created_at",
  "sort_order": "desc",
  "limit": 50
}
```

### Get Nearby Properties
```http
GET /properties/{property_id}/nearby?radius_km=2.0&limit=10
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "property": {
      "id": "nearby-property-uuid",
      "address": "456 Oak St",
      "current_value": 780000
    },
    "distance_km": 0.8,
    "distance_miles": 0.5
  }
]
```

### Get Satellite Image
```http
GET /properties/{property_id}/satellite-image?zoom=18&size=1024
Authorization: Bearer {token}
```

## Analysis

### Start Analysis
```http
POST /analysis/{property_id}/start
Authorization: Bearer {token}
Content-Type: application/json

{
  "analysis_type": "full",
  "include_satellite": true,
  "include_hazard_assessment": true,
  "include_valuation": true,
  "priority": "normal"
}
```

**Response:**
```json
{
  "id": "analysis-uuid",
  "property_id": "property-uuid",
  "analysis_type": "full",
  "status": "pending",
  "progress": 0.0,
  "started_at": "2024-01-15T10:00:00Z",
  "model_version": "v1.0"
}
```

### Get Analysis Status
```http
GET /analysis/{analysis_id}/status
Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": "analysis-uuid",
  "status": "processing",
  "progress": 0.65,
  "current_step": "Assessing risks",
  "estimated_completion": "2024-01-15T10:05:00Z",
  "error_message": null
}
```

### Get Analysis Results
```http
GET /analysis/{analysis_id}
Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": "analysis-uuid",
  "property_id": "property-uuid",
  "status": "completed",
  "progress": 1.0,
  "overall_risk_score": 32.5,
  "confidence_score": 0.89,
  "structural_condition": "good",
  "roof_condition": "excellent",
  "satellite_analysis": {
    "property_boundaries": {
      "area_sqft": 8500,
      "lot_coverage": 0.45,
      "building_footprint": 2400
    },
    "roof_condition": {
      "condition_score": 0.92,
      "material_type": "asphalt",
      "age_estimate": 8
    },
    "vegetation": {
      "coverage_percentage": 35,
      "health_score": 0.78,
      "tree_count": 6
    },
    "water_features": {
      "pool_detected": false,
      "water_proximity": 1200
    }
  },
  "risk_factors": {
    "flood_risk": {
      "score": 15,
      "factors": ["elevation", "drainage"],
      "mitigation_recommendations": ["Install sump pump"]
    },
    "fire_risk": {
      "score": 25,
      "factors": ["vegetation_density"],
      "mitigation_recommendations": ["Clear vegetation"]
    },
    "crime_risk": {
      "score": 20,
      "factors": ["neighborhood_statistics"],
      "mitigation_recommendations": ["Install security system"]
    }
  },
  "completed_at": "2024-01-15T10:05:23Z",
  "processing_time": 323.5
}
```

### Generate Analysis Report
```http
GET /analysis/{analysis_id}/report?format=pdf
Authorization: Bearer {token}
```

### Batch Analysis
```http
POST /analysis/batch
Authorization: Bearer {token}
Content-Type: application/json

{
  "property_ids": ["uuid1", "uuid2", "uuid3"],
  "analysis_type": "full",
  "priority": "normal"
}
```

## Hazard Assessment

### Get Hazard Assessment
```http
GET /hazards/property/{property_id}
Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": "hazard-uuid",
  "property_id": "property-uuid",
  "flood_risk_score": 15.2,
  "fire_risk_score": 25.8,
  "earthquake_risk_score": 45.0,
  "crime_risk_score": 20.1,
  "composite_risk_score": 26.5,
  "risk_category": "low",
  "flood_zone_designation": "X",
  "distance_to_water_body": 1200,
  "wildfire_interface_zone": false,
  "seismic_zone": "2",
  "recommendations": [
    "Install smoke detectors",
    "Maintain defensible space",
    "Consider earthquake insurance"
  ],
  "assessment_confidence": 0.87,
  "assessment_date": "2024-01-15T10:05:00Z"
}
```

## Property Valuation

### Get Property Valuation
```http
GET /valuation/property/{property_id}
Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": "valuation-uuid",
  "property_id": "property-uuid",
  "estimated_value": 785000,
  "confidence_interval": {
    "low": 735000,
    "high": 835000
  },
  "confidence_score": 0.84,
  "value_per_sqft": 314,
  "comparable_properties": [
    {
      "address": "789 Pine St",
      "distance_miles": 0.3,
      "sale_price": 820000,
      "sale_date": "2024-01-10",
      "square_footage": 2600
    }
  ],
  "replacement_cost": 650000,
  "actual_cash_value": 580000,
  "dwelling_coverage_amount": 650000,
  "valuation_factors": {
    "location": 0.30,
    "size": 0.25,
    "condition": 0.20,
    "features": 0.15,
    "market_trends": 0.10
  },
  "valuation_date": "2024-01-15T10:05:00Z"
}
```

### Request New Valuation
```http
POST /valuation/{property_id}/request
Authorization: Bearer {token}
Content-Type: application/json

{
  "valuation_type": "market",
  "include_comparables": true,
  "comparable_radius_miles": 1.0
}
```

## File Upload

### Upload Property Images
```http
POST /upload/property-images
Authorization: Bearer {token}
Content-Type: multipart/form-data

files: [file1.jpg, file2.jpg]
property_id: property-uuid
```

**Response:**
```json
{
  "uploaded_files": [
    {
      "filename": "file1.jpg",
      "url": "https://storage.example.com/property-images/file1.jpg",
      "size": 2048576
    }
  ],
  "property_id": "property-uuid"
}
```

## Dashboard

### Get Dashboard Statistics
```http
GET /dashboard/stats
Authorization: Bearer {token}
```

**Response:**
```json
{
  "total_properties": 156,
  "analyzed_properties": 134,
  "pending_analyses": 22,
  "avg_property_value": 485000,
  "avg_risk_score": 35.2,
  "high_risk_properties": 12,
  "recent_analyses": 8,
  "property_types": {
    "residential": 120,
    "commercial": 25,
    "industrial": 11
  },
  "risk_distribution": {
    "low": 89,
    "medium": 45,
    "high": 22
  }
}
```

## Error Handling

### Error Response Format
```json
{
  "detail": "Error message",
  "error_code": "VALIDATION_ERROR",
  "timestamp": "2024-01-15T10:00:00Z",
  "path": "/api/v1/properties"
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `429` - Rate Limit Exceeded
- `500` - Internal Server Error

## Rate Limiting

- **Public endpoints**: 100 requests per minute
- **Authenticated endpoints**: 1000 requests per minute
- **Analysis endpoints**: 50 requests per minute
- **Batch operations**: 10 requests per minute

## Pagination

Large result sets are paginated:

```http
GET /properties?skip=0&limit=50
```

**Response includes pagination metadata:**
```json
{
  "items": [...],
  "total": 1250,
  "skip": 0,
  "limit": 50,
  "has_more": true
}
```

## Webhooks

### Analysis Completion Webhook
```http
POST {your_webhook_url}
Content-Type: application/json
X-Property-Intelligence-Signature: sha256=...

{
  "event": "analysis.completed",
  "timestamp": "2024-01-15T10:05:00Z",
  "data": {
    "analysis_id": "analysis-uuid",
    "property_id": "property-uuid",
    "status": "completed",
    "overall_risk_score": 32.5
  }
}
```

### Available Events
- `analysis.started`
- `analysis.completed`
- `analysis.failed`
- `property.created`
- `property.updated`
- `valuation.completed`

## SDKs and Libraries

### Python SDK
```python
from property_intelligence import PropertyIntelligenceClient

client = PropertyIntelligenceClient(api_key="your-api-key")

# Create property
property = client.properties.create({
    "address": "123 Main St",
    "city": "San Francisco",
    "state": "CA"
})

# Start analysis
analysis = client.analysis.start(property.id)

# Get results
results = client.analysis.get(analysis.id)
```

### JavaScript SDK
```javascript
import { PropertyIntelligenceClient } from 'property-intelligence-js';

const client = new PropertyIntelligenceClient({
  apiKey: 'your-api-key'
});

// Create property
const property = await client.properties.create({
  address: '123 Main St',
  city: 'San Francisco',
  state: 'CA'
});

// Start analysis
const analysis = await client.analysis.start(property.id);
```

## Testing

### Test API Key
Use this test API key for development:
```
Test Key: test_pk_1234567890abcdef
```

### Mock Data
The API provides mock data for testing when using test credentials.

---

**Need help?** Check out our [API Examples](examples/) or contact support at api-support@propertyintelligence.ai