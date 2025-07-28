# AR Restaurant Menu 🍽️

A cutting-edge web application that revolutionizes restaurant dining experiences by combining traditional menu browsing with immersive Augmented Reality (AR) technology. Built with Next.js and Material-UI, this multi-tenant platform allows restaurants to showcase their dishes with interactive 3D models and WebAR experiences.

## 🌟 Features

### Core Functionality

- **🥽 WebAR Integration**: View 3D food models in augmented reality using A-Frame and AR.js
- **🏢 Multi-tenant Support**: Multiple restaurants with isolated data and custom branding
- **📱 QR Code System**: Contactless menu access via QR codes for seamless table-side ordering
- **🔍 Smart Search**: Real-time fuzzy matching search with category filtering
- **📊 Restaurant Dashboard**: Complete CRUD operations for menu management
- **🌐 Progressive Web App**: PWA capabilities with offline support

### User Experience

- **📱 Mobile-First Design**: Optimized for smartphones and tablets
- **🎨 Custom Theming**: Restaurant-specific branding and color schemes
- **♿ Accessibility**: ARIA labels and screen reader support
- **🌍 Multi-language Support**: International restaurant support
- **⚡ Performance Optimized**: Fast loading with image optimization and lazy loading

## 🛠 Technology Stack

### Frontend

- **Next.js 15.4.4** - React framework with App Router
- **React 19.1.0** - Latest React features and optimizations
- **TypeScript 5.x** - Static type checking for enhanced development
- **Material-UI 7.2.0** - Google's Material Design component library

### WebAR & 3D

- **A-Frame 1.7.1** - Web framework for virtual reality experiences
- **AR.js 2.2.2** - Augmented reality library for web browsers
- **Three.js 0.178.0** - 3D graphics library for model rendering

### Additional Libraries

- **react-qr-code 2.0.18** - QR code generation and customization
- **@emotion/react** - CSS-in-JS styling solution

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** (recommended: latest LTS version)
- **npm**, **yarn**, **pnpm**, or **bun** package manager
- **Modern browser** with WebRTC support for AR features
- **HTTPS connection** (required for camera access in production)

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd ar-menu
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. **Start the development server**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 🏗 Project Structure

```
ar-menu/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Landing page (multi-tenant)
│   │   ├── menu/[restaurant]/ # Dynamic restaurant menus
│   │   ├── dashboard/         # Restaurant management
│   │   ├── ar/[id]/          # Direct AR experiences
│   │   └── api/              # API routes
│   ├── components/           # Reusable React components
│   │   ├── ARViewer.tsx      # WebAR functionality
│   │   ├── MenuCard.tsx      # Menu item display
│   │   └── QRCodeDialog.tsx  # QR code generation
│   ├── data/                 # Mock data and JSON configurations
│   ├── lib/                  # Utility functions and database
│   └── types/                # TypeScript type definitions
├── public/
│   ├── images/               # Food photography
│   └── models/               # 3D GLB models
└── docs/                     # Documentation
```

## 🎯 Usage Guide

### For Restaurant Customers

1. **Scan QR Code**: Use your phone camera to scan the restaurant's QR code
2. **Browse Menu**: Search and filter through available dishes
3. **View in AR**: Tap "View in AR" on items with 3D models
4. **Experience**: Point your camera at a flat surface to see the dish in AR

### For Restaurant Owners

1. **Access Dashboard**: Navigate to `/dashboard` and log in
2. **Manage Menu**: Add, edit, or remove menu items
3. **Upload 3D Models**: Add GLB files for AR experiences
4. **Generate QR Codes**: Create table-specific or item-specific QR codes

### Demo Access

Try these sample restaurant codes:

- `bistro-secret-123` - Delicious AR Bistro
- `cafe-secret-456` - Cozy Café AR

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint code analysis
```

### Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_AR_DEBUG=false

# Optional: Analytics and Monitoring
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
```

### Adding New 3D Models

1. **Format Requirements**:

   - File format: GLB (GL Transmission Format)
   - Size: < 2MB (recommended for web performance)
   - Optimization: Use Draco compression when possible

2. **Add to Project**:

   ```bash
   # Place GLB files in public/models/
   public/models/your-dish.glb
   ```

3. **Update Menu Data**:
   ```typescript
   // In src/data/menuData.ts
   {
     id: "your-dish",
     name: "Your Dish Name",
     model3D: "/models/your-dish.glb",
     // ...other properties
   }
   ```

## 🚀 Deployment

### Production Build

```bash
# Create optimized production build
npm run build

# Test production build locally
npm run start
```

### Deployment Platforms

#### Vercel (Recommended)

1. Connect your repository to Vercel
2. Configure environment variables
3. Deploy automatically on push

#### Other Platforms

- **Netlify**: Static site deployment with edge functions
- **AWS Amplify**: Full-stack deployment with CI/CD
- **Docker**: Containerized deployment for any platform

### Deployment Checklist

- [ ] Environment variables configured
- [ ] 3D models optimized and uploaded to CDN
- [ ] HTTPS certificate configured (required for camera access)
- [ ] PWA manifest and service worker configured
- [ ] Performance monitoring setup
- [ ] Error tracking enabled

## 📱 Browser Compatibility

### Supported Browsers

- **Chrome 90+** (recommended for best AR performance)
- **Firefox 88+**
- **Safari 14+** (iOS 14.3+ for AR features)
- **Edge 90+**

### AR Requirements

- **Camera access permission**
- **WebRTC support**
- **Adequate device performance** (mid-range smartphones and above)
- **Stable internet connection** for 3D model loading

## 🤝 Contributing

We welcome contributions to improve the AR Restaurant Menu platform!

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Standards

- Follow TypeScript strict mode
- Use Material-UI components and design system
- Write comprehensive JSDoc comments
- Ensure mobile responsiveness
- Test AR functionality across devices

## 📚 Documentation

- **[Developer Documentation](./DEVELOPER_DOCUMENTATION.md)** - Comprehensive technical guide
- **[API Documentation](./docs/api.md)** - REST API endpoints and schemas
- **[Component Library](./docs/components.md)** - UI component documentation
- **[AR Implementation Guide](./docs/ar-guide.md)** - WebAR development guide

## 🔧 Troubleshooting

### Common Issues

**AR Not Working**

- Verify camera permissions are granted
- Ensure HTTPS connection (required for camera access)
- Check device compatibility and browser support
- Ensure adequate lighting conditions

**3D Models Not Loading**

- Verify GLB file format and optimization
- Check network connectivity and file size
- Validate model paths in menu data
- Test with browser developer tools

**QR Codes Not Scanning**

- Verify QR code format and restaurant secrets
- Test with multiple QR code reader apps
- Check camera focus and lighting
- Validate URL encoding

### Getting Help

- Check the [Developer Documentation](./DEVELOPER_DOCUMENTATION.md)
- Open an issue on GitHub
- Contact the development team

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **A-Frame Community** for WebAR framework
- **Material-UI Team** for the excellent component library
- **Next.js Team** for the robust React framework
- **AR.js Contributors** for making WebAR accessible

---

**Built with ❤️ for the future of dining experiences**

_For detailed technical documentation, see [DEVELOPER_DOCUMENTATION.md](./DEVELOPER_DOCUMENTATION.md)_
