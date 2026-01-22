# Civora - Food Delivery Web App

A modern, responsive food delivery platform built with Next.js 14, designed to provide seamless ordering experiences for customers and restaurants.

## Created by Roshan

This project was developed by Roshan as part of the Civora food delivery ecosystem.

## Features

- **Progressive Web App (PWA)**: Installable on mobile devices with offline capabilities
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Real-time Updates**: Live order tracking and status updates
- **Multi-language Support**: Internationalization with multiple language options
- **Modern UI/UX**: Clean, intuitive interface built with Tailwind CSS
- **GraphQL API**: Efficient data fetching and state management

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Apollo Client for GraphQL
- **Deployment**: Vercel
- **Version Control**: GitHub

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/civora-web.git
   cd civora-web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Deployment

This app is configured for deployment on Vercel. The `vercel.json` file contains the deployment configuration.

To deploy:
1. Connect your GitHub repository to Vercel
2. Vercel will automatically deploy on every push to the main branch

## Project Structure

```
├── app/                 # Next.js app directory
├── components/          # Reusable React components
├── lib/                 # Utility functions and configurations
├── locales/            # Internationalization files
├── public/             # Static assets
└── styles/             # Global styles
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is proprietary software developed for Civora.
