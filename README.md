# ProSupport Enterprise Support System

ProSupport is a high-end, full-stack technical support management system designed for enterprise environments. It provides a seamless interface for Customers to raise tickets, Admins to manage resources, and Engineers to resolve technical issues with a live audit lifecycle.

![Version](https://img.shields.io/badge/version-2.5.0-indigo)
![Status](https://img.shields.io/badge/status-Production--Ready-emerald)
![Database](https://img.shields.io/badge/backend-Supabase-blue)

## 🚀 Key Features

- **Enterprise Dashboard:** Real-time metrics and resource distribution.
- **Smart Queue Management:** Contextual sidebars for managing tickets without page reloads.
- **Role-Based Access Control (RBAC):** Distinct portals for Admins, Engineers, and Customers.
- **Live Audit Lifecycle:** Transparent tracking of every action taken on a support request.
- **Supabase Integration:** Secure authentication and real-time database capabilities.

## 📋 Database Setup (Supabase)

Go to your [Supabase Dashboard](https://supabase.com), open the **SQL Editor**, and run the following commands:

```sql
-- 1. Profiles Table (For User Roles)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  email text,
  role text default 'CUSTOMER',
  created_at timestamp with time zone default now()
);

-- 2. Customers Table
create table customers (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  customer_code text unique default 'CUST-' || upper(substring(md5(random()::text) from 1 for 6)),
  created_at timestamp with time zone default now()
);

-- 3. Projects Table
create table projects (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  code text unique,
  customer_id uuid references customers(id),
  region text,
  created_at timestamp with time zone default now()
);

-- 4. Sites Table
create table sites (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  project_id uuid references projects(id),
  equipment_name text,
  created_at timestamp with time zone default now()
);

-- 5. Tickets Table
create table tickets (
  id bigserial primary key,
  issue text not null,
  description text,
  status text default 'OPEN',
  priority text default 'MEDIUM',
  customer_id uuid references customers(id),
  project_id uuid references projects(id),
  site_id uuid references sites(id),
  engineer_id uuid references auth.users(id),
  equipment text,
  created_at timestamp with time zone default now()
);
```

## 🚀 Deployment Guide (Google Cloud Run)

1. Click the **Deploy** button in AI Studio.
2. If you see "Set up billing", you must link a billing account to your GCP project.
3. Once deployed, add your `*.a.run.app` URL to **Supabase > Authentication > URL Configuration**.

---
&copy; 2024 PROSUPPORT GLOBAL INC. Professional Support Architecture.