# API Integration Guide - Automation CRUD (Auto Dialer)

---

## 🔐 Authentication

All requests require authentication headers:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

---
## IAM API Endpoints

**Base URL**: `https://api.hydrabyte.co/id`  
**Module**: User

### 1. GET users
**GET** `/users?pageSize=100`

```json
{
    "data": [
        {
            "username": "haind@hna-dr.vn",
            "fullname": "Nguyễn Đình Hải",
            "staffCode": "404",
            "phonenumber": "0935992379",
            "email": "",
            "roles": [
                "org.agent"
            ],
            "orgId": "632434849aad3a5b1ba600b7",
            "attributes": {},
            "isActive": false,
            "createdAt": "2024-04-08T04:02:13.647Z",
            "changedAt": "2024-04-08T04:02:13.647Z",
            "createdBy": {
                "orgId": "",
                "appId": "",
                "userId": ""
            },
            "isDeleted": false,
            "id": "66136c451e717bf94199f961"
        }
    ],
    "paging": {
        "pageIndex": 0,
        "pageSize": 25,
        "totalPages": 1,
        "totalItems": 1
    }
}
```

## Voice API Endpoints


**Base URL**: `https://api.hydrabyte.co/voice`  
**Module**: Number  

### 1. **Get numbers** 
**GET** `/numbers?pageSize=200`

```json
{
    "data": [
        {
            "createdBy": {
                "userId": "65490ba422c3b06e224d5806",
                "appId": "",
                "orgId": "632434849aad3a5b1ba600b7",
                "role": "org.tech",
                "scope": "organization"
            },
            "isDeleted": false,
            "id": "689307be6185d1dfc2250060",
            "number": "0592012236",
            "alias": "",
            "note": "CMC, Gtel, ATC",
            "isActive": true,
            "createdAt": "2025-08-06T07:43:58.145Z",
            "changedAt": "2025-08-06T07:43:58.145Z"
        }
    ],
    "paging": {
        "pageIndex": 0,
        "pageSize": 25,
        "totalPages": 1,
        "totalItems": 1
    }
}
```

## 📋 LCM API Endpoints

**Base URL**: `https://api.hydrabyte.co/lcm`  
**Module**: Automation  
**Type**: Auto Dialer  

### 1. **Create Auto Dialer** 
**POST** `/automations`

```json
{
  "type": "auto-dialer",
  "frequency": 300,
  "workingHours": [8, 9, 10, 11, 13, 14, 15, 16, 17],
  "workingDays": ["monday", "tuesday", "wednesday", "thursday", "friday"],
  "config": {
    "partner": {
      "id": "234k234j23k4234234",
      "name": "Hoàn Kim Law Firm",
      "code": "HKLF_001"
    },
    "staffs": [
      {
        "id": "2342n3k4k23423",
        "name": "Nguyễn Văn A",
        "email": "nguyenvana@hoankimlaw.com",
        "staffCode": "NVA001"
      }
    ],
    "phoneNumbers": ["+84901234567", "+84901234568"],
    "retryAttempts": 3,
    "concurrentCallRatio": 1.5
  },
  "status": "inactive",
  "notes": "Auto dialer for debt collection"
}
```

**Response**: Full automation object with `id`, `createdAt`, `updatedAt`

---

### 2. **Get Automation by ID**
**GET** `/automations/{id}`

**Response**: Complete automation object

---

### 3. **List Automations**
**GET** `/automations?type=auto-dialer&status=active&page=1&limit=10`

**Query Parameters**:
- `type`: Filter by automation type (`auto-dialer`)
- `status`: Filter by status (`active`, `inactive`)
- `partnerId`: Filter by partner ID
- `staffId`: Filter by staff ID
- `activeOnly`: Boolean, only active automations
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

**Response**:
```json
{
  "data": [/* array of automation objects */],
  "paging": {
    "index": 1,
    "size": 10,
    "totalItems": 25,
    "totalPages": 3
  }
}
```

---

### 4. **Update Automation**
**PUT** `/automations/{id}`

```json
{
  "frequency": 600,
  "workingHours": [9, 10, 11, 13, 14, 15, 16],
  "status": "active",
  "config": {
    "partner": {
      "id": "partner_123",
      "name": "Updated Partner Name",
      "code": "HKLF_001"
    },
    "staffs": [/* updated staff array */],
    "phoneNumbers": ["+84901234567"],
    "retryAttempts": 5,
    "concurrentCallRatio": 2.0
  }
}
```

**Response**: Updated automation object

---

### 5. **Update Status Only**
**PATCH** `/automations/{id}/status`

```json
{
  "status": "active",
  "reason": "Started automation for peak hours"
}
```

**Response**:
```json
{
  "id": "64f7b1234567890abcdef123",
  "status": "active",
  "updatedAt": "2025-08-29T10:30:00.000Z",
  "reason": "Started automation for peak hours"
}
```

---

### 6. **Delete Automation**
**DELETE** `/automations/{id}`

**Note**: Cannot delete active automations. Must set status to `inactive` first.

**Response**:
```json
{
  "id": "64f7b1234567890abcdef123",
  "deletedAt": "2025-08-29T10:30:00.000Z"
}
```

### 7. **Get Partners**
**GET** `/partner?pageSize=100`

```json
{
    "data": [
        {
            "createdAt": "2022-12-17T15:52:28.054Z",
            "changedAt": "2022-12-17T15:57:32.404Z",
            "code": "vpbank2",
            "name": "Ngân hàng TMCP Việt Nam Thịnh Vượng",
            "userId": "",
            "businessCode": "0100233583",
            "contractCode": "HKL-VP-001",
            "address": "89 Láng Hạ, Quận Đống Đa, Hà Nội",
            "note": "",
            "isActive": true,
            "startedAt": "2022-12-17T15:55:19.023Z",
            "endedAt": "2022-12-17T15:55:19.023Z",
            "id": "639de5bc0fbdd5532415b484",
            "owner": {
                "orgId": "632434849aad3a5b1ba600b7",
                "userId": "62a681ccf43d0b62dec8919e"
            }
        }
    ],
    "paging": {
        "pageIndex": 0,
        "pageSize": 25,
        "totalPages": 1,
        "totalItems": 1
    }
}
```

---

## 📊 Data Models

### AutoDialerConfig
```typescript
{
  partner: {
    id: string;
    name: string;
    code: string;
  };
  staffs: Array<{
    id: string;
    name: string;
    email: string;
    staffCode: string;
  }>;
  phoneNumbers: string[];
  retryAttempts: number; // 1-10
  concurrentCallRatio: number; // 0.5-2.0
}
```

### Automation Object
```typescript
{
  id: string;
  type: "auto-dialer";
  frequency: number; // 30-1800 seconds
  workingHours?: number[]; // 0-23 hours array
  workingDays?: string[]; // ["monday", "tuesday", ...]
  config: AutoDialerConfig;
  status: "active" | "inactive";
  notes?: string;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}
```

---

## ⚠️ Validation Rules

### Required Fields
- `type`: Must be "auto-dialer"
- `frequency`: 30-1800 seconds (30s to 30 minutes)
- `config.partner`: Valid partner object
- `config.staffs`: Array with at least 1 staff
- `config.phoneNumbers`: Array with at least 1 phone number
- `config.retryAttempts`: 1-10
- `config.concurrentCallRatio`: 0.5-2.0

### Optional Fields
- `workingHours`: Array of hours (0-23)
- `workingDays`: Array of weekdays
- `status`: Defaults to "inactive"
- `notes`: Max 500 characters

---

## 🔥 Quick Test Examples

### Create Test Automation
```bash
curl -X POST https://api.hydrabyte.co/lcm/automations \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "auto-dialer",
    "frequency": 300,
    "config": {
      "partner": {"id": "test_partner", "name": "Test Partner", "code": "TP001"},
      "staffs": [{"id": "test_staff", "name": "Test Staff", "email": "test@example.com", "staffCode": "TS001"}],
      "phoneNumbers": ["+84901234567"],
      "retryAttempts": 3,
      "concurrentCallRatio": 1.0
    }
  }'
```

### Get All Auto Dialers
```bash
curl -X GET "https://api.hydrabyte.co/lcm/automations?type=auto-dialer" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

**Contact**: Development Team for API key setup and authentication details.  
**Version**: LCM Service v1.0  
**Last Updated**: August 29, 2025
