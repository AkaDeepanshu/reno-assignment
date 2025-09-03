# School Management System

A modern, responsive web application built with Next.js for managing schools data. This application allows users to add schools with complete information including images and view all schools in an attractive grid layout.

## Features

- ✅ **Add Schools**: Complete form with validation for adding school information
- 🏫 **View Schools**: Grid-based display showing all schools with images
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- 🖼️ **Image Upload**: Store and display school images
- ✔️ **Form Validation**: Real-time validation using Zod and React Hook Form
- 🎨 **Modern UI**: Clean, professional interface with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Database**: MySQL with mysql2
- **Styling**: Tailwind CSS
- **Form Handling**: React Hook Form with Zod validation
- **Image Storage**: Local file system storage

## Database Schema

The application uses a `schools` table with the following structure:

```sql
CREATE TABLE schools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  contact BIGINT NOT NULL,
  image TEXT,
  email_id TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Environment Variables

Create a `.env` file in the root directory with your MySQL database credentials:

```env
DB_HOST=your_mysql_host
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=your_database_name
DB_PORT=3306
```

## Installation & Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
schoolapp/
├── app/
│   ├── add-school/
│   │   └── page.tsx          # Add school form page
│   ├── show-schools/
│   │   └── page.tsx          # Schools listing page
│   ├── api/
│   │   └── schools/
│   │       └── route.ts      # API routes for school operations
│   ├── globals.css           # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── lib/
│   ├── db.ts                # Database connection utilities
│   └── validation.ts        # Form validation schemas
├── public/
│   └── schoolImages/        # Directory for uploaded school images
└── package.json
```

## Pages

1. **Home Page (/)**: Landing page with navigation to add schools or view schools
2. **Add School (/add-school)**: Form to add new schools with validation
3. **Show Schools (/show-schools)**: Grid view of all schools similar to an e-commerce product listing
