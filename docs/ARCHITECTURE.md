                                  Browser
                                     │
                                     ▼
                              React Application
                                     │
      ┌──────────────────────────────┼──────────────────────────────┐
      │                              │                              │
      ▼                              ▼                              ▼
 React Router                  Redux Store                  Shared Components
      │                              │                              │
      └──────────────┬───────────────┴──────────────┬───────────────┘
                     ▼                              ▼
             Feature Modules                 Global Providers
                     │
     ┌───────────────┼─────────────────────────────────────┐
     │               │                 │                   │
     ▼               ▼                 ▼                   ▼
 Authentication   Tenant         User Module          Future Modules
     │               │
     ▼               ▼
 React Hook Form  React Hook Form
     │               │
     ▼               ▼
 Zod Validation  Zod Validation
     │               │
     └───────────────┴──────────────┐
                                    ▼
                              RTK Query
                                    │
                                    ▼
                               Base API
                                    │
                                    ▼
                           Express REST API
                                    │
                                    ▼
                               Service Layer
                                    │
                                    ▼
                            Repository Layer
                                    │
                                    ▼
                                 MongoDB


                                 