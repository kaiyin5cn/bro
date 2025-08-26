### **Project Flow Overview (Node.js, Express.js, MongoDB Stack)**

This document outlines the design and implementation of a URL shortener system using Node.js, Express.js, and MongoDB. It's structured to guide an agentic assistant (like Claude) through phased development, starting with a Proof of Concept and progressively scaling the architecture.

*   **Target Stack:** Node.js for backend logic, Express.js for the web framework, and MongoDB as the primary database.
*   **Core Principles:** API endpoints for shortening and redirection, base62 encoding for short URLs, and a robust data model.
*   **Phases:** Begin with a minimal functional PoC, then scale by introducing solutions like load balancing (NGINX/PM2), asynchronous processing with message queues, caching (Redis), and distributed components.
*   **Assumptions:** MongoDB for data storage; base62 hashing of sequential IDs; unique ID generation via a custom counter in MongoDB.
*   **Flow Format:** Structured as phased Markdown, describing the implementation steps and components.

---

### **Phase 1: Proof of Concept (Minimal Functional Components) - ✅ COMPLETED**

**Goal:** Validate the core functionalities (shorten URL, redirect) on a single process/server. This phase uses a lightweight setup for MongoDB.

**✅ Implemented Components:**

1.  **✅ Basic app structure:**
    *   Node.js project initialized with ES modules support
    *   Dependencies installed: `express`, `mongoose`, `dotenv`, `cors`, `valid-url`
    *   MongoDB connection established via `config/database.js`
    *   Development setup with `nodemon` and testing with `jest`
2.  **✅ Data Model:**
    *   Mongoose schema for `URL` entries with fields: `longURL`, `shortCode`, `accessCount`, and timestamps
    *   No Counter model needed - using random short code generation for simplicity and better distribution
3.  **✅ API Endpoints:**
    *   **`POST /shorten`:** Receives `longURL`, checks for existing entries, generates unique 7-character shortCode using base62 encoding, saves to MongoDB, returns full shortURL with base domain
    *   **`GET /:shortCode`:** Receives shortCode parameter, queries MongoDB, increments accessCount atomically, performs 302 redirect with cache prevention headers
4.  **✅ Short Code Generation:** 
    *   Random 7-character codes using base62 charset (0-9, a-z, A-Z)
    *   Collision detection with retry mechanism (up to 10 attempts)
    *   Provides 62^7 ≈ 3.5 trillion unique combinations
5.  **✅ Additional Features:**
    *   Access count tracking for analytics
    *   Duplicate URL detection (returns existing shortURL)
    *   Comprehensive error handling
    *   CORS support for frontend integration
    *   Cache prevention headers for accurate tracking
6.  **✅ Testing:**
    *   Jest test suite for short code generation utility
    *   Tests cover length validation, character set validation, uniqueness, and consistency
    *   Artillery load testing framework with automated JSON/HTML reporting
    *   Performance testing capabilities for stress testing the API
7.  **✅ Production Enhancements (Beyond Original Scope):**
    *   TTL indexing for automatic document expiration (7 days)
    *   MongoDB user authentication and security setup
    *   One-command development setup script (`npm run setup`)
    *   Comprehensive documentation (README.md, QUICKSTART.md)
    *   Environment configuration with .env.example template
    *   Load testing infrastructure with Artillery integration
8.  **✅ Database Infrastructure (Phase 2 Ready):**
    *   MongoDB replica set configuration files prepared
    *   Automated replica set initialization in setup scripts
    *   Database indexing on `shortCode` field for fast lookups
    *   Connection pooling configured (maxPoolSize: 10)
    *   Database setup supports both standalone and replica modes
    *   Ready for high availability and read scaling
9.  **✅ Frontend Implementation:**
    *   Complete React/TypeScript frontend with Vite build system
    *   Client page with URL shortening interface and animations
    *   Admin dashboard with login system and URL management
    *   Responsive design with Google-scale UI components
    *   **✅ Updated**: Real API integration with JWT authentication
10. **✅ JWT Authentication System (COMPLETED):**
    *   User model with bcrypt password hashing
    *   JWT token generation and verification middleware
    *   Auth routes: `/auth/login`, `/auth/register`
    *   Admin routes: `/admin/urls` (GET, PUT, DELETE) with role-based access
    *   Frontend integration with token storage and API calls
    *   Admin user creation script (`npm run setup:auth`)
    *   **Security**: Replaces hardcoded credentials with proper authentication
    *   **✅ NEW**: Controller architecture implemented for better code organization
11. **✅ Architecture Improvements (NEW):**
    *   **Controller Pattern**: Business logic extracted from routes into dedicated controllers
    *   **adminController.js**: Handles `getAllUrls`, `deleteUrl`, `updateUrl` operations
    *   **authController.js**: Manages `register` and `login` authentication flows
    *   **Route Simplification**: Routes now focus purely on middleware and controller delegation
    *   **Maintainability**: Improved code organization for easier testing and scaling
12. **✅ Admin Features Enhancement (NEW):**
    *   **Short Code Editing**: Admin can now modify shortCode instead of longURL
    *   **Duplicate Prevention**: Backend validates shortCode uniqueness during updates
    *   **Frontend Integration**: Dashboard updated to edit shortCode with proper validation
    *   **Session Persistence**: Login state persists across page refreshes
    *   **Loading States**: Skeleton loading effects for better UX during authentication checks

**✅ Current Status:** Phase 1 is fully implemented and functional with production-ready features:
- **Core API**: Both `/shorten` and `/:shortCode` endpoints with comprehensive error handling
- **Database**: MongoDB with proper indexing, TTL expiration (7 days), and user authentication
- **Authentication**: Complete JWT-based auth system with role-based access control
- **Architecture**: Controller pattern implemented for better code organization and maintainability
- **Admin Features**: Full CRUD operations with shortCode editing and duplicate prevention
- **Frontend**: Complete React/TypeScript SPA with persistent login and skeleton loading states
- **Testing**: Jest unit tests and Artillery load testing with automated reporting
- **Development**: One-command setup scripts and comprehensive documentation

**Ready for:** Production deployment or progression to Phase 2 scaling. All frontend-backend integration completed.

**Current Project Structure:**
```
bro/
├── backend/           # Phase 1 Complete - Production Ready
│   ├── server.js      # Express server with /shorten and /:shortCode endpoints
│   ├── models/URL.js  # Mongoose schema with validation and TTL
│   ├── utils/shortCode.js # Base62 generation utility
│   ├── config/database.js # MongoDB connection with options
│   ├── tests/         # Jest unit tests + Artillery load tests
│   └── scripts/       # Automated setup and configuration
└── frontend/          # React/TypeScript SPA - Needs API Integration
    ├── src/components/ # URL shortening UI + Admin dashboard
    ├── src/pages/     # Client and Admin pages
    └── PROGRESS.md    # Frontend implementation status
```

**Recent Completions:**
1. **✅ COMPLETED**: Frontend-Backend Integration with JWT authentication
2. **✅ COMPLETED**: Security fixes with proper authentication system  
3. **✅ COMPLETED**: Controller architecture refactoring for better maintainability
4. **✅ COMPLETED**: Admin shortCode editing with validation and UX improvements

**Next Steps:**
1. **Production Deployment**: Configure for production environment
2. **Phase 2 Planning**: Begin load balancing and caching implementation

**Quick Start with Authentication:**
```bash
# Backend setup
cd backend
npm run setup:auth    # Install deps + create admin user
npm run dev          # Start server

# Frontend setup  
cd frontend
npm install && npm run dev

# Login credentials: admin/admin123
```

---

### **Phase 2: Basic Scaling (Load Balancing & Process Management) - 🔄 READY TO START**

**Goal:** Handle moderate traffic (e.g., 1,000 requests per second) by incorporating process management and caching, building upon the existing Phase 1 foundation.

**Flow Process:**

1.  **✅ Database Enhancement (Partially Complete):** 
    *   ✅ MongoDB with existing `URL` schema (`longURL`, `shortCode`, `accessCount`, `timestamps`)
    *   ✅ MongoDB replica set configuration files and setup scripts ready
    *   ✅ Database indexing on `shortCode` field implemented for faster lookups
    *   ✅ Connection pooling configured with proper timeout settings
    *   ✅ Automated replica set initialization via `npm run setup --replica`
    *   ✅ Existing collision detection and retry mechanism maintained
    *   🔄 **TODO**: Deploy replica set in production environment
    *   🔄 **TODO**: Configure read preferences for read scaling optimization
2.  **Process Management:** 
    *   Deploy PM2 to run multiple instances of the existing `server.js` application
    *   Configure PM2 cluster mode to utilize all available CPU cores
    *   Maintain the current ES modules setup and existing API endpoints
    *   Add PM2 ecosystem file for consistent deployment configuration
3.  **Load Balancing:** 
    *   Deploy NGINX as reverse proxy in front of PM2-managed Node.js instances
    *   Configure round-robin load balancing across application instances
    *   Set up health checks to ensure traffic only goes to healthy instances
    *   Maintain existing CORS configuration through NGINX
4.  **Redis Caching Layer:**
    *   Introduce Redis for caching frequently accessed shortCode → longURL mappings
    *   **Cache Strategy:**
        *   On `POST /shorten`: Store `shortCode:longURL` mapping in Redis with TTL
        *   On `GET /:shortCode`: Check Redis first, fallback to MongoDB if cache miss
        *   Cache the result in Redis for subsequent requests
        *   Maintain accessCount increment in MongoDB (not cached for accuracy)
    *   **Cache Keys:** Use `url:{shortCode}` pattern for Redis keys
    *   **TTL Strategy:** Set reasonable expiration (e.g., 24 hours) to prevent stale data
5.  **Monitoring & Health Checks:**
    *   Add basic health check endpoint (`GET /health`) for load balancer
    *   Implement Redis connection monitoring
    *   Add PM2 monitoring for process health

**Implementation Notes:**
*   Preserve existing shortCode generation logic and collision detection
*   Maintain current error handling and response formats
*   Keep accessCount tracking accurate by always updating MongoDB
*   Ensure cache invalidation strategy for any future URL updates

**Benefits:** This phase significantly improves throughput and reduces database load. Redis caching handles frequent redirects, PM2 clustering utilizes multiple cores, and NGINX load balancing distributes requests efficiently. Expected capacity: 1,000-5,000 requests per second with sub-100ms response times.

**🔄 Phase 2 Status:**
- ✅ **Database Infrastructure**: Replica set configs and setup scripts ready
- 🔄 **Process Management**: PM2 configuration needed
- 🔄 **Load Balancing**: NGINX configuration needed  
- 🔄 **Redis Caching**: Redis integration needed
- 🔄 **Monitoring**: Health check endpoints needed

---

### **Phase 3: Microservices for Latency & Write Optimization - 📝 PLANNED**

**Goal:** Address potential write latency and scale the system to handle higher loads (e.g., 10,000+ requests per second) by decoupling functionalities into independent microservices.

**Flow Process:**

1.  **Split into Microservices:** The monolithic application will be broken down into three distinct services:
    *   **Shortening Service:** Handles `POST /shorten` requests, receives `longURL`s and publishes them to a message queue for async processing
    *   **Worker Service:** Consumes messages from the queue, generates unique shortCodes using the existing base62 logic, saves `longURL`/`shortCode` mappings to MongoDB, and caches them in Redis
    *   **Redirect Service:** Handles all `GET /:shortCode` requests, prioritizes Redis cache lookups, falls back to MongoDB, and increments accessCount
2.  **Async Writes:** 
    *   Introduce RabbitMQ message queue system
    *   Shortening Service publishes `longURL` to queue and returns immediate response
    *   Worker Service processes queue messages using existing shortCode generation and collision detection logic
    *   Maintain duplicate URL detection by checking MongoDB before generating new shortCodes
3.  **Service Architecture:**
    *   **Shortening Service:** Express app handling only `/shorten` endpoint
    *   **Worker Service:** Background processor using existing `generateShortCode()` utility
    *   **Redirect Service:** Express app handling `/:shortCode` with existing accessCount increment logic
4.  **Service Management:**
    *   Each microservice runs independently with PM2
    *   Shared utilities (`shortCode.js`, database config) via npm packages or shared modules
    *   Environment-based service discovery for inter-service communication
5.  **NGINX Routing:**
    *   Route `/shorten` requests to Shortening Service
    *   Route `/:shortCode` requests to Redirect Service
    *   Maintain existing CORS and health check configurations
6.  **Data Consistency:**
    *   Preserve existing MongoDB schema and indexing
    *   Maintain Redis caching strategy from Phase 2
    *   Keep accessCount accuracy through direct MongoDB updates

**Benefits:** Microservices architecture reduces write latency for users (immediate response from Shortening Service), enables independent scaling of read vs write operations, and maintains existing functionality while improving system resilience and scalability to 10,000+ requests per second.

---

### **Phase 4: Full Production Scaling**

**Goal:** Achieve the highest levels of scale, high availability, and fault tolerance to handle the article's estimated traffic (11,000 reads/sec, 1,000 writes/sec) and beyond.

**Flow Process:**

1.  **Distributed Database:**
    *   **MongoDB Sharding:** For horizontal scaling of the `URL` collection, MongoDB sharding will be implemented. This distributes data across multiple independent MongoDB clusters (shards), allowing the system to handle massive amounts of data and concurrent operations.
    *   **Replica Sets:** All MongoDB instances, including those within shards, will be configured as replica sets. This provides data redundancy and automatic failover, ensuring high availability even if a database server fails.
2.  **Advanced ID Generation:** A dedicated Node.js microservice will be created solely for generating unique, sequential IDs. This service can implement a robust distributed ID generation algorithm (like a custom counter with strong consistency guarantees or a Snowflake-inspired approach) to ensure high throughput and collision-free ID assignment across all worker instances. The Worker Service will call this ID generator service to obtain IDs before creating short URLs.
3.  **Orchestration:** A cluster orchestrator such as HashiCorp Nomad or Kubernetes will be used. This tool will automate the deployment, scaling, healing, and management of all microservices (Shortening, Worker, Redirect, ID Generator) across a cluster of physical or virtual machines. It ensures that services are always running, scaled appropriately, and can recover automatically from failures.
4.  **Monitoring:** Comprehensive monitoring will be established using Prometheus and Grafana. Prometheus will collect metrics (e.g., request rates, error rates, latency, resource utilization) from all Node.js applications, MongoDB, Redis, RabbitMQ, and the underlying infrastructure. Grafana will provide interactive dashboards for visualizing these metrics, enabling proactive identification of performance bottlenecks and rapid response to issues.
5.  **Edge Cases:**
    *   **Collision Handling:** While sequential ID generation minimizes collisions, robust mechanisms will be in place for rare scenarios, potentially involving retries or a fallback to a different ID generation strategy if a collision is detected.
    *   **Analytics:** For detailed analytics on URL usage, redirect events can be logged to a separate, scalable data pipeline (e.g., streaming to Kafka for processing by an analytics engine) rather than relying solely on HTTP 302 redirects.
6.  **Deployment:** Infrastructure as Code (IaC) tools like Ansible or Terraform will be used to automate the entire deployment process. This includes provisioning servers, configuring network settings, installing software dependencies, and deploying all microservices across multiple hosts in a consistent and repeatable manner.

**Validation:** At this stage, the system will undergo rigorous stress testing to simulate 10-year projected traffic. Validation will focus on ensuring the system's ability to handle peak loads, maintain low latency, and demonstrate high availability and fault tolerance in the face of component failures.