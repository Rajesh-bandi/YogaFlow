# YogaFlow - AI-Powered Personalized Yoga Application

## Overview

YogaFlow is a comprehensive web application that provides personalized yoga routines powered by AI recommendations. The platform features stunning 3D character animations and scroll effects that create an immersive yoga experience. Users can take personalized assessments, receive custom yoga routines based on their experience level and goals, and track their progress over time. Built with modern web technologies, it features a React frontend with advanced Framer Motion animations, wellness-focused design, and an Express.js backend with PostgreSQL database integration.

## Recent Major Enhancements (January 2025)

### 3D Character Animations & Scroll Effects
- **Enhanced Hero Section**: Dynamic 3D yoga pose carousel with floating particles, energy lines, and parallax scrolling
- **Framer Motion Integration**: Advanced scroll-triggered animations with spring physics and smooth transitions
- **Interactive Elements**: Hover effects, rotation animations, and breathing meditation animations
- **Particle Systems**: Floating orbs, energy pulses, and zen flow backgrounds for immersive experience

### Advanced Visual Features
- **Scroll Animations**: Multiple animation types (fadeInUp, fadeInLeft, scale, rotateIn) with intersection observer
- **3D CSS Effects**: Perspective transformations, backface visibility, and rotate effects
- **Dynamic Background Elements**: Animated geometric patterns, flowing particles, and gradient animations
- **Yoga Character Display**: Rotating yoga pose demonstrations with pose descriptions and AI-powered overlays

### Interactive Routine Experience (January 2025)
- **Start Routine Page**: Full interactive yoga session with timer, pose progression, and completion tracking
- **Pose Details Pages**: Comprehensive pose library with step-by-step instructions, benefits, modifications, and precautions
- **Dynamic Navigation**: Seamless transitions between pose library, detailed instructions, and practice sessions
- **Progress Tracking**: Visual progress indicators and session completion celebrations

### Real ML-Powered Recommendations (January 2025)
- **Authentic Yoga Dataset**: Integrated 73 real yoga poses with difficulty levels, age ranges, benefits, and durations
- **Intelligent Pose Selection**: Multi-factor scoring algorithm considering age, experience, goals, and time availability
- **Dynamic Routine Generation**: Creates personalized routines with warmup, main sequence, and cooldown phases
- **Advanced ML Engine**: Sophisticated recommendation system with pose variety, goal alignment, and user preference matching

## User Preferences

Preferred communication style: Simple, everyday language.
Focus on stunning visual presentations with smooth 3D animations and scroll effects.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Radix UI primitives with Tailwind CSS for consistent design
- **Component Library**: shadcn/ui providing pre-built, accessible components
- **State Management**: React Query (TanStack Query) for server state management
- **Form Handling**: React Hook Form with Zod validation for type-safe forms
- **Styling**: Tailwind CSS with custom wellness-themed color palette and typography

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript for full-stack type safety
- **API Design**: RESTful endpoints following conventional HTTP methods
- **Data Validation**: Zod schemas shared between client and server
- **Storage Layer**: Abstract storage interface with in-memory implementation for development

### Database Design
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: PostgreSQL (configured for Neon serverless)
- **Schema Management**: Drizzle Kit for migrations and schema changes
- **Tables**: Users, assessments, routines, and user progress tracking

### Development Environment
- **Build Tool**: Vite for fast development and optimized production builds
- **Module System**: ESM throughout the application
- **Development Server**: Express with Vite middleware integration
- **Asset Handling**: Vite's asset processing with path resolution

### AI Recommendation System
- **Algorithm**: Custom ML recommendation engine based on user preferences
- **Input Factors**: Age group, experience level, goals, time availability, health conditions
- **Scoring System**: Multi-factor scoring algorithm that weights routines based on user profile
- **Personalization**: Dynamic routine generation based on assessment data

## External Dependencies

### UI and Design
- **Radix UI**: Accessible component primitives for forms, dialogs, and interactive elements
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Lucide React**: Consistent icon library for UI elements
- **Google Fonts**: Inter and Poppins fonts for modern typography

### Data Management
- **React Query**: Server state management and caching
- **Drizzle ORM**: Type-safe database operations and query building
- **Neon Database**: Serverless PostgreSQL hosting
- **Zod**: Runtime type validation and schema definition

### Animation & Motion
- **Framer Motion**: Advanced animation library for React with scroll triggers, spring physics, and 3D transforms
- **Custom CSS Animations**: Keyframe animations for meditation breathing, energy pulses, and zen flow effects
- **Intersection Observer API**: Scroll-triggered animations with multiple animation types

### Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Static type checking across the entire stack
- **ESLint/Prettier**: Code quality and formatting (implied by modern React setup)

### Form and Validation
- **React Hook Form**: Performant form handling with minimal re-renders
- **Hookform Resolvers**: Integration between React Hook Form and Zod validation

### Routing and Navigation
- **Wouter**: Lightweight routing solution for single-page application behavior

### Additional Utilities
- **Class Variance Authority**: Type-safe variant handling for component styling
- **clsx/twMerge**: Conditional CSS class composition
- **Date-fns**: Date manipulation and formatting utilities