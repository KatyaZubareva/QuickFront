//services/projectGenerator.ts
import { FileContentMap, ProjectConfig } from '../types';

interface PackageDependencies {
  [key: string]: string;
}

class ProjectGenerator {
  async generate(config: ProjectConfig): Promise<FileContentMap> {
    const files: FileContentMap = {};

    // 1. Core Project Files
    files['package.json'] = this.generatePackageJson(config);
    files['vite.config.js'] = this.generateViteConfig(config);
    files['.gitignore'] = 'node_modules\n.env\n.DS_Store\n';
    files['src/main.jsx'] = this.generateMainJsx(config);
    files['src/App.jsx'] = this.generateAppJsx(config);
    files['src/index.css'] = this.generateIndexCss(config);

    // 2. Feature Implementations
    if (config.features?.includes('Dark Mode')) {
      files['src/hooks/useDarkMode.js'] = this.generateDarkModeHook();
      files['src/components/DarkModeToggle.jsx'] = this.generateDarkModeToggle();
    }

    if (config.features?.includes('State Management')) {
      files['src/store/store.js'] = this.generateReduxStore();
      files['src/store/slices/counterSlice.js'] = this.generateReduxSlice();
    }

    if (config.features?.includes('i18n')) {
      files['src/i18n/config.js'] = this.generateI18nConfig();
      files['src/i18n/locales/en.json'] = JSON.stringify({ welcome: "Welcome" }, null, 2);
      files['src/i18n/locales/ru.json'] = JSON.stringify({ welcome: "Добро пожаловать" }, null, 2);
    }

    if (config.features?.includes('PWA')) {
      files['src/service-worker.js'] = this.generateServiceWorker();
      files['manifest.json'] = this.generateManifest(config);
    }

    if (config.features?.includes('SSR')) {
      files['server.js'] = this.generateSSRServer(config);
    }

    if (config.features?.includes('Drag & Drop')) {
      files['src/components/DragDropContainer.jsx'] = this.generateDragDropComponent();
    }

    if (config.features?.includes('Lazy Loading')) {
      files['src/components/LazyComponent.jsx'] = this.generateLazyComponent();
      files['src/utils/lazyLoad.js'] = this.generateLazyLoadUtil();
    }

    return files;
  }

  // ===== CORE FILE GENERATORS =====
  private generatePackageJson(config: ProjectConfig): string {
    const baseDeps: PackageDependencies = {
      "react": "^18.2.0",
      "react-dom": "^18.2.0",
      "vite": "^4.0.0"
    };

    const devDeps: PackageDependencies = {
      "@vitejs/plugin-react": "^3.0.0"
    };

    // Feature-specific dependencies
    if (config.features?.includes('Dark Mode')) {
      baseDeps["tailwindcss"] = "^3.0.0";
    }

    if (config.features?.includes('State Management')) {
      baseDeps["@reduxjs/toolkit"] = "^1.9.0";
      baseDeps["react-redux"] = "^8.0.5";
    }

    if (config.features?.includes('i18n')) {
      baseDeps["react-i18next"] = "^12.1.5";
      baseDeps["i18next"] = "^22.4.14";
    }

    if (config.features?.includes('PWA')) {
      devDeps["vite-plugin-pwa"] = "^0.14.4";
    }

    return JSON.stringify({
      name: config.projectName,
      version: "1.0.0",
      scripts: {
        dev: "vite",
        build: "vite build",
        preview: "vite preview"
      },
      dependencies: baseDeps,
      devDependencies: devDeps
    }, null, 2);
  }

  private generateViteConfig(config: ProjectConfig): string {
    let plugins = ['@vitejs/plugin-react()'];
    
    if (config.features?.includes('PWA')) {
      plugins.push('VitePWA({ registerType: "autoUpdate" })');
    }

    return `
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
${config.features?.includes('PWA') ? 'import { VitePWA } from "vite-plugin-pwa"' : ''}

export default defineConfig({
  plugins: [${plugins.join(', ')}],
  server: {
    port: 3000
  }
})
    `;
  }

  private generateMainJsx(config: ProjectConfig): string {
    const imports: string[] = [];
    const providers: string[] = [];

    if (config.features?.includes('State Management')) {
      imports.push(`import { Provider } from 'react-redux'`);
      imports.push(`import { store } from './store/store'`);
      providers.push(`<Provider store={store}>`);
    }

    if (config.features?.includes('i18n')) {
      imports.push(`import './i18n/config'`);
    }

    return `
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
${imports.join('\n')}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    ${providers.join('\n    ')}
      <App />
    ${providers.map(() => '</Provider>').join('\n    ')}
  </React.StrictMode>
)
    `;
  }

  private generateAppJsx(config: ProjectConfig): string {
    const imports: string[] = [];
    const components: string[] = [];

    if (config.features?.includes('Dark Mode')) {
      imports.push(`import DarkModeToggle from './components/DarkModeToggle'`);
      components.push(`<DarkModeToggle />`);
    }

    if (config.features?.includes('Drag & Drop')) {
      imports.push(`import DragDropContainer from './components/DragDropContainer'`);
      components.push(`<DragDropContainer />`);
    }

    return `
import './index.css'
${imports.join('\n')}

export default function App() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">${config.projectName}</h1>
      <p>${config.projectDescription || 'Welcome to your new app'}</p>
      ${components.join('\n      ')}
    </div>
  )
}
    `;
  }

  // ===== FEATURE GENERATORS =====
  private generateDarkModeHook(): string {
    return `
import { useState, useEffect } from 'react'

export function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('darkMode') === 'true' || 
      window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    localStorage.setItem('darkMode', isDark)
  }, [isDark])

  return [isDark, setIsDark]
}
    `;
  }

  private generateDarkModeToggle(): string {
    return `
import { useDarkMode } from '../hooks/useDarkMode'

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useDarkMode()

  return (
    <button 
      onClick={() => setIsDark(!isDark)}
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700"
    >
      {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
    </button>
  )
}
    `;
  }

  private generateReduxStore(): string {
    return `
import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './slices/counterSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer
  }
})
    `;
  }

  private generateReduxSlice(): string {
    return `
import { createSlice } from '@reduxjs/toolkit'

export const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0
  },
  reducers: {
    increment: state => { state.value += 1 },
    decrement: state => { state.value -= 1 }
  }
})

export const { increment, decrement } = counterSlice.actions
export default counterSlice.reducer
    `;
  }

  private generateI18nConfig(): string {
    return `
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import enTranslations from './locales/en.json'
import ruTranslations from './locales/ru.json'

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enTranslations },
    ru: { translation: ruTranslations }
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
})

export default i18n
    `;
  }

  private generateServiceWorker(): string {
    return `
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/main.js',
        '/assets/*'
      ])
    })
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request)
    })
  )
})
    `;
  }

  private generateManifest(config: ProjectConfig): string {
    return JSON.stringify({
      name: config.projectName,
      short_name: config.projectName,
      start_url: "/",
      display: "standalone",
      background_color: "#ffffff",
      theme_color: "#000000",
      icons: [
        {
          src: "/icon-192x192.png",
          sizes: "192x192",
          type: "image/png"
        }
      ]
    }, null, 2);
  }

  private generateSSRServer(config: ProjectConfig): string {
    return `
import express from 'express'
import { renderToString } from 'react-dom/server'
import App from './src/App'
import React from 'react'

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.static('dist'))

app.get('*', (req, res) => {
  const appHtml = renderToString(<App />)
  
  const html = \`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${config.projectName}</title>
      </head>
      <body>
        <div id="root">\${appHtml}</div>
        <script src="/client.js"></script>
      </body>
    </html>
  \`
  
  res.send(html)
})

app.listen(PORT, () => {
  console.log(\`Server is running on http://localhost:\${PORT}\`)
})
    `;
  }

  private generateDragDropComponent(): string {
    return `
import { useDrag, useDrop } from 'react-dnd'

export default function DragDropContainer() {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'BOX',
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }))

  const [, drop] = useDrop(() => ({
    accept: 'BOX',
    drop: () => ({ name: 'DropArea' })
  }))

  return (
    <div ref={drop} className="p-4 border-2 border-dashed">
      <div 
        ref={drag} 
        className="p-2 bg-blue-500 text-white cursor-move"
        style={{ opacity: isDragging ? 0.5 : 1 }}
      >
        Drag me
      </div>
    </div>
  )
}
    `;
  }

  private generateLazyComponent(): string {
    return `
import React, { Suspense } from 'react'

const LazyComponent = React.lazy(() => import('./LazyComponent'))

export default function LazyWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  )
}
    `;
  }

  private generateLazyLoadUtil(): string {
    return `
export function lazyLoad(path) {
  return () => import(\`./\${path}\`)
}
    `;
  }

  private generateIndexCss(config: ProjectConfig): string {
    let css = `
body {
  font-family: sans-serif;
  margin: 0;
  padding: 0;
}

.dark {
  background-color: #1a202c;
  color: white;
}
`;

    if (config.features?.includes('Dark Mode')) {
      css += `
@tailwind base;
@tailwind components;
@tailwind utilities;
`;
    }

    return css;
  }
}

export default ProjectGenerator;