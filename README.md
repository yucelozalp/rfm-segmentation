# 🎯 RFM Segmentation Interface

A modern RFM (Recency, Frequency, Monetary) analysis interface for customer segmentation, built with React and Next.js.

![RFM Segmentation Interface](https://img.shields.io/badge/Next.js-15.4.5-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)

## 📋 Table of Contents

- [Features](#-features)
- [Technologies](#-technologies)
- [Installation](#-installation)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Screenshots](#-screenshots)

## ✨ Features

### 🎨 Modern UI/UX
- **5×5 Interactive Grid**: Visual RFM segmentation matrix
- **Professional Tooltips**: Detailed segment information on hover
- **Advanced Selection System**: Ring effects, checkmarks, and badges
- **Responsive Design**: Perfect display on all devices

### 📊 Data Management
- **Dual Data Sources**:
  - 📄 Static data from JSON file
  - 🔄 Dynamic data generation (balanced distribution)
- **150+ Customer Records**: Realistic RFM values
- **Smart Scoring**: 1-5 scale scoring based on percentiles

### 🔍 Filtering & Analysis
- **3 Filter Types**: Recency, Frequency, Monetary
- **Range Sliders**: Min/max value adjustment
- **Real-time Updates**: Instant grid refresh
- **Segment Definition**: Champions, Loyal Customers, etc.

### 🚀 API Integration
- **Mock API Endpoint**: `/api/selected-ids`
- **JSON Data Submission**: Selected customer IDs
- **Success Notifications**: User-friendly messages

## 🛠 Technologies

| Technology | Version | Description |
|------------|---------|-------------|
| **Next.js** | 15.4.5 | React framework |
| **TypeScript** | 5.0+ | Type safety |
| **Tailwind CSS** | 4.0 | Utility-first CSS |
| **React** | 19.1.0 | UI library |

## 🚀 Installation

### Prerequisites
- Node.js 18.0 or higher
- npm or yarn

### Steps

1. **Clone the repository**
```bash
git clone https://github.com/username/rfm-segmentation.git
cd rfm-segmentation
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Start the development server**
```bash
npm run dev
# or
yarn dev
```

4. **Open in browser**
```
http://localhost:3000
```

## 📖 Usage

### 1. Data Source Selection
- **JSON File**: For consistent test data
- **Dynamic Generate**: For random data with balanced distribution

### 2. Filtering
- Use sliders in the left panel to filter customers
- Set ranges for Recency, Frequency, and Monetary values

### 3. Customer Selection
- Click on grid cells to select customers
- Selected customers are listed in the bottom panel
- Detailed RFM scores are displayed for each customer

### 4. API Submission
- Use "Send to API" button to submit selected IDs
- Success/error messages are automatically displayed

## 📁 Project Structure

```
rfm-segmentation/
├── 📄 README.md                    # This file
├── 📄 package.json                 # Project dependencies
├── 📄 tailwind.config.ts           # Tailwind configuration
├── 📄 tsconfig.json                # TypeScript configuration
├── 📁 src/
│   ├── 📁 app/
│   │   ├── 📄 page.tsx             # Main page component
│   │   ├── 📄 layout.tsx           # Layout wrapper
│   │   └── 📁 api/
│   │       └── 📁 selected-ids/
│   │           └── 📄 route.ts     # API endpoint
│   ├── 📁 components/
│   │   ├── 📄 RFMGrid.tsx          # 5×5 grid component
│   │   ├── 📄 RFMFilters.tsx       # Filtering component
│   │   └── 📄 SelectedCustomers.tsx # Selected customers
│   ├── 📁 data/
│   │   └── 📄 mockData.json        # 150 customer records
│   ├── 📁 types/
│   │   └── 📄 rfm.ts               # TypeScript type definitions
│   └── 📁 utils/
│       └── 📄 rfmUtils.ts          # RFM calculation functions
```

## 🔌 API Documentation

### POST `/api/selected-ids`

Receives and processes selected customer IDs.

**Request Body:**
```json
{
  "selectedIds": ["customer_001", "customer_002", "customer_003"]
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "3 customers successfully selected",
  "selectedIds": ["customer_001", "customer_002", "customer_003"],
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Response (400):**
```json
{
  "error": "selectedIds must be an array"
}
```

## 🎯 RFM Scoring System

### Coordinate System
- **X Axis**: Frequency Score (1-5)
- **Y Axis**: Monetary Score (1-5)
- **Grid Size**: 5×5 = 25 cells

### Segment Definitions
| Segment | Frequency | Monetary | Description |
|---------|-----------|----------|-------------|
| 🏆 **Champions** | 4-5 | 4-5 | Most valuable customers |
| 💎 **Loyal Customers** | 4-5 | 2-3 | Frequent shoppers |
| 🌟 **Potential Loyalists** | 3 | 3-4 | Customers with growth potential |
| 🆕 **New Customers** | 3 | 1-2 | Recently joined customers |
| ⚠️ **At Risk** | 2 | 1-2 | Customers losing interest |
| 📉 **Lost Customers** | 1 | 1-2 | High risk of churn |

## 📸 Screenshots

### Main Interface
- 5×5 interactive grid
- Color-coded segment display
- Data source selection buttons

### Filter Panel
- Range sliders
- Min/max value display
- Reset button

### Selection System
- Ring effect selection indicators
- Checkmarks and badges
- Detailed customer list

