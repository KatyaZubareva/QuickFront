// templates.tsx

import { ProjectTemplate } from "../types/template";

export const TEMPLATES: ProjectTemplate[] = [
  {
    id: "next-ecommerce",
    name: "Интернет-магазин",
    description: "Полнофункциональный магазин на Next.js с корзиной и оплатой",
    longDescription: "Готовое решение для электронной коммерции с SSR, управлением состоянием корзины, страницами продуктов и интеграцией платежей",
    frameworks: ["Next.js", "React"],
    techStack: ["TypeScript", "Tailwind CSS", "NextAuth", "Stripe"],
    icon: (
      <svg viewBox="0 0 100 100" className="w-20 h-20">
        <rect x="10" y="10" width="80" height="15" fill="#6D28D9" />
        <rect x="10" y="30" width="20" height="60" fill="#8B5CF6" />
        <rect x="35" y="30" width="55" height="30" fill="#C4B5FD" />
        <rect x="35" y="65" width="55" height="25" fill="#A78BFA" />
      </svg>
    ),
    features: ["SSR/SSG", "API Routes", "Корзина", "Оплата", "Аутентификация", "Фильтрация"],
    previewFeatures: ["Каталог товаров", "Корзина", "Фильтры", "Оформление заказа"],
    category: "E-commerce",
    difficulty: "intermediate",
    files: {
      "pages/index.tsx": `import { NextPage } from 'next';
import CartProvider from '../components/CartProvider';
import ProductList from '../components/ProductList';

const HomePage: NextPage = () => {
  return (
    <CartProvider>
      <main className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Наш магазин</h1>
        <ProductList />
      </main>
    </CartProvider>
  );
};

export default HomePage;`,
      "pages/api/cart.ts": `import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Логика работы с корзиной
  switch (req.method) {
    case 'GET':
      // Получение корзины
      break;
    case 'POST':
      // Добавление в корзину
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end('Method Not Allowed');
  }
}`,
      "components/CartProvider.tsx": `import React, { createContext, useState, useContext } from 'react';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType>({} as CartContextType);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setItems(prev => {
      const existingItem = prev.find(item => item.product.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);`,
      "pages/_app.tsx": `import { AppProps } from 'next/app';
import { CartProvider } from '../components/CartProvider';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <CartProvider>
      <Component {...pageProps} />
    </CartProvider>
  );
}

export default MyApp;`
    },
    dependencies: {
      "next": "^13.4.0",
      "react": "^18.2.0",
      "react-dom": "^18.2.0",
      "next-auth": "^4.22.1",
      "stripe": "^12.1.1"
    }
  },
  {
    id: "react-admin",
    name: "Админ панель",
    description: "Панель управления с аналитикой и таблицами",
    longDescription: "Комплексное решение для администрирования с дашбордом, управлением пользователями, аналитикой и ролевой моделью доступа",
    frameworks: ["React", "Next.js"],
    techStack: ["TypeScript", "Tailwind CSS", "TanStack Table", "Chart.js"],
    icon: (
      <svg viewBox="0 0 100 100" className="w-20 h-20">
        <rect x="10" y="10" width="80" height="15" fill="#6D28D9" />
        <rect x="10" y="30" width="20" height="60" fill="#7C3AED" />
        <rect x="35" y="30" width="25" height="25" fill="#8B5CF6" />
        <rect x="65" y="30" width="25" height="25" fill="#8B5CF6" />
        <rect x="35" y="60" width="55" height="30" fill="#C4B5FD" />
      </svg>
    ),
    features: ["Графики", "Таблицы", "Фильтры", "Аутентификация", "Роли"],
    previewFeatures: ["Дашборд", "Управление пользователями", "Аналитика", "Настройки"],
    category: "Admin",
    difficulty: "intermediate",
    files: {
      "src/App.tsx": `import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Analytics from './pages/Analytics';
import Sidebar from './components/Sidebar';
import AuthProvider from './providers/AuthProvider';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="flex h-screen bg-gray-50">
          <Sidebar />
          <div className="flex-1 overflow-auto p-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/users" element={<Users />} />
              <Route path="/analytics" element={<Analytics />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;`,
      "src/pages/Dashboard.tsx": `import React from 'react';
import StatsCards from '../components/StatsCards';
import RecentActivity from '../components/RecentActivity';
import { useAuth } from '../providers/AuthProvider';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Панель управления</h1>
      <StatsCards />
      <RecentActivity userId={user.id} />
    </div>
  );
};

export default Dashboard;`,
      "src/components/DataTable.tsx": `import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  flexRender,
} from '@tanstack/react-table';

interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
}

export function DataTable<TData>({ data, columns }: DataTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};`,
      "src/providers/AuthProvider.tsx": `import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    // Реальная авторизация
    setUser({
      id: '1',
      name: 'Admin',
      email,
      role: 'admin'
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);`
    },
    dependencies: {
      "react": "^18.2.0",
      "react-dom": "^18.2.0",
      "react-router-dom": "^6.14.1",
      "@tanstack/react-table": "^8.7.6",
      "chart.js": "^4.3.0"
    }
  },
  {
    id: "vue-landing",
    name: "Лендинг",
    description: "Маркетинговая страница для продукта",
    longDescription: "Высококонверсионный лендинг с анимациями, формой захвата и адаптивным дизайном для презентации продукта или услуги",
    frameworks: ["Vue", "Nuxt.js"],
    techStack: ["Composition API", "Tailwind CSS", "GSAP", "VeeValidate"],
    icon: (
      <svg viewBox="0 0 100 100" className="w-20 h-20">
        <rect x="10" y="10" width="80" height="15" fill="#6D28D9" />
        <rect x="10" y="30" width="80" height="15" fill="#7C3AED" />
        <rect x="10" y="50" width="80" height="15" fill="#8B5CF6" />
        <rect x="10" y="70" width="80" height="15" fill="#C4B5FD" />
      </svg>
    ),
    features: ["Hero секция", "Преимущества", "Отзывы", "CTA форма", "Анимации", "Адаптивность"],
    previewFeatures: ["Главный экран", "О продукте", "Отзывы", "Форма захвата"],
    category: "Marketing",
    difficulty: "beginner",
    files: {
      "src/App.vue": `<template>
  <div id="app">
    <Header />
    <HeroSection />
    <Features />
    <Testimonials />
    <CtaForm />
    <Footer />
  </div>
</template>

<script setup>
import Header from './components/Header.vue';
import HeroSection from './components/HeroSection.vue';
import Features from './components/Features.vue';
import Testimonials from './components/Testimonials.vue';
import CtaForm from './components/CtaForm.vue';
import Footer from './components/Footer.vue';
</script>

<style>
@import './assets/styles/main.css';
</style>`,
      "src/components/HeroSection.vue": `<template>
  <section class="hero bg-gradient-to-b from-purple-900 to-purple-700 text-white py-20">
    <div class="container mx-auto px-4 text-center">
      <h1 class="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">{{ title }}</h1>
      <p class="text-xl mb-8 max-w-2xl mx-auto animate-fade-in delay-100">{{ subtitle }}</p>
      <button 
        @click="scrollToCTA"
        class="bg-white text-purple-900 px-8 py-3 rounded-full font-bold hover:bg-purple-100 transition-colors animate-fade-in delay-200"
      >
        Узнать больше
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const title = ref('Инновационный продукт');
const subtitle = ref('Решаем ваши проблемы эффективно');

const scrollToCTA = () => {
  const ctaSection = document.getElementById('cta');
  if (ctaSection) {
    ctaSection.scrollIntoView({ behavior: 'smooth' });
  }
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
  opacity: 0;
}

.delay-100 {
  animation-delay: 0.1s;
}

.delay-200 {
  animation-delay: 0.2s;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}
</style>`,
      "src/components/CtaForm.vue": `<template>
  <section id="cta" class="py-16 bg-gray-50">
    <div class="container mx-auto px-4 max-w-4xl">
      <div class="bg-white rounded-xl shadow-lg p-8 md:p-12">
        <h2 class="text-2xl font-bold mb-6 text-center">Оставьте заявку</h2>
        <Form @submit="handleSubmit" class="space-y-6">
          <!-- Поля формы -->
        </Form>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Form } from 'vee-validate';
import * as yup from 'yup';

const schema = yup.object({
  name: yup.string().required('Обязательное поле'),
  email: yup.string().email('Некорректный email').required('Обязательное поле'),
  phone: yup.string().matches(/^\+?[0-9]{10,15}$/, 'Некорректный телефон')
});

const handleSubmit = (values, { resetForm }) => {
  console.log('Форма отправлена:', values);
  resetForm();
};
</script>`
    },
    dependencies: {
      "vue": "^3.3.4",
      "vee-validate": "^4.7.3",
      "gsap": "^3.12.2",
      "tailwindcss": "^3.3.3"
    }
  },
  {
    id: "react-ts-clean",
    name: "Чистый React + TypeScript",
    description: "Базовый проект на React с TypeScript",
    longDescription: "Минимальная настройка проекта React с TypeScript, ESLint, Prettier и Vite для быстрого старта разработки",
    frameworks: ["React"],
    techStack: ["TypeScript", "Vite", "ESLint", "Prettier"],
    icon: (
      <svg viewBox="0 0 100 100" className="w-20 h-20">
        <rect x="10" y="10" width="80" height="80" fill="#6D28D9" />
      </svg>
    ),
    features: ["TypeScript", "ESLint", "Prettier", "Vite", "HMR"],
    previewFeatures: ["Чистая настройка", "Готовый к разработке"],
    category: "Boilerplate",
    difficulty: "beginner",
    files: {
      "src/main.tsx": `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
      "src/App.tsx": `import React, { useState } from 'react';

const App: React.FC = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">React TypeScript App</h1>
      <button
        onClick={() => setCount(count + 1)}
        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
      >
        Count: {count}
      </button>
    </div>
  );
};

export default App;`,
      "vite.config.ts": `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    hmr: {
      overlay: false,
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});`,
      "tsconfig.json": `{
  "compilerOptions": {
    "target": "ESNext",
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "module": "ESNext",
    "skipLibCheck": true,
    "strict": true,
    "jsx": "react-jsx",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"]
}`,
      ".eslintrc.json": `{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "prettier"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint", "react-refresh"],
  "root": true,
  "rules": {
    "react-refresh/only-export-components": [
      "warn",
      { "allowConstantExport": true }
    ]
  }
}`
    },
    dependencies: {
      "react": "^18.2.0",
      "react-dom": "^18.2.0",
      "typescript": "^5.1.6",
      "@types/react": "^18.2.15",
      "@types/react-dom": "^18.2.7",
      "@vitejs/plugin-react": "^4.0.3"
    }
  },
  {
    id: "next-blog",
    name: "Блог (Next.js)",
    description: "Персональный блог с Markdown и SSG",
    longDescription: "Оптимизированный блог с генерацией статичных страниц из Markdown, поддержкой синтаксиса кода и тегов",
    frameworks: ["Next.js"],
    techStack: ["TypeScript", "Tailwind CSS", "Markdown", "Gray-matter"],
    icon: (
      <svg viewBox="0 0 100 100" className="w-20 h-20">
        <rect x="10" y="10" width="80" height="15" fill="#6D28D9" />
        <rect x="10" y="30" width="80" height="10" fill="#7C3AED" />
        <rect x="10" y="45" width="55" height="45" fill="#8B5CF6" />
        <rect x="70" y="45" width="20" height="45" fill="#C4B5FD" />
      </svg>
    ),
    features: ["SSG", "Markdown", "Синтаксис кода", "Теги", "Поиск"],
    previewFeatures: ["Лента статей", "Страница статьи", "Теги", "Поиск"],
    category: "Blog",
    difficulty: "intermediate",
    files: {
      "pages/index.tsx": `import { GetStaticProps } from 'next';
import { getSortedPostsData } from '../lib/posts';
import PostList from '../components/PostList';

interface HomeProps {
  allPostsData: {
    id: string;
    title: string;
    date: string;
    tags: string[];
    excerpt: string;
  }[];
}

const Home: React.FC<HomeProps> = ({ allPostsData }) => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8">Блог</h1>
      <PostList posts={allPostsData} />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
};

export default Home;`,
      "lib/posts.ts": `import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'posts');

export function getSortedPostsData() {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    const id = fileName.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    return {
      id,
      ...matterResult.data as { 
        title: string; 
        date: string; 
        tags: string[]; 
        excerpt: string 
      },
    };
  });

  return allPostsData.sort((a, b) => {
    return a.date < b.date ? 1 : -1;
  });
}

export function getPostData(id: string) {
  const fullPath = path.join(postsDirectory, \`\${id}.md\`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);

  return {
    id,
    content: matterResult.content,
    ...matterResult.data,
  };
}`,
      "components/PostList.tsx": `import React from 'react';
import Link from 'next/link';
import Tag from './Tag';

interface PostListProps {
  posts: {
    id: string;
    title: string;
    date: string;
    tags: string[];
    excerpt: string;
  }[];
}

const PostList: React.FC<PostListProps> = ({ posts }) => {
  return (
    <div className="space-y-8">
      {posts.map((post) => (
        <article key={post.id} className="border-b border-gray-200 pb-8">
          <Link href={\`/posts/\${post.id}\`}>
            <h2 className="text-2xl font-bold mb-2 hover:text-purple-600 transition-colors">
              {post.title}
            </h2>
          </Link>
          <p className="text-gray-500 mb-2">{post.date}</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.map((tag) => (
              <Tag key={tag} tag={tag} />
            ))}
          </div>
          <p className="text-gray-700">{post.excerpt}</p>
        </article>
      ))}
    </div>
  );
};

export default PostList;`
    },
    dependencies: {
      "next": "^13.4.0",
      "react": "^18.2.0",
      "react-dom": "^18.2.0",
      "gray-matter": "^4.0.3",
      "remark": "^14.0.2",
      "remark-html": "^15.0.1"
    }
  },
  {
    id: "svelte-app",
    name: "Svelte приложение",
    description: "Чистый проект на Svelte с настройкой Vite",
    longDescription: "Базовый шаблон для быстрого старта с Svelte, включая настройку Vite, ESLint и Prettier",
    frameworks: ["Svelte"],
    techStack: ["Vite", "TypeScript", "ESLint"],
    icon: (
      <svg viewBox="0 0 100 100" className="w-20 h-20">
        <rect x="10" y="10" width="80" height="80" fill="#6D28D9" />
      </svg>
    ),
    features: ["Vite", "HMR", "TypeScript", "ESLint"],
    previewFeatures: ["Чистая настройка", "Готовый к разработке"],
    category: "SPA",
    difficulty: "beginner",
    files: {
      "src/App.svelte": `<script lang="ts">
  let count = 0;
  
  function increment() {
    count += 1;
  }
</script>

<main>
  <h1>Svelte App</h1>
  <button on:click={increment}>
    Count: {count}
  </button>
</main>

<style>
  main {
    text-align: center;
    padding: 2em;
  }
</style>`,
      "vite.config.ts": `import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [svelte()],
})`,
      "svelte.config.js": `import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

export default {
  preprocess: vitePreprocess(),
}`,
      "package.json": `{
  "name": "svelte-app",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "@sveltejs/vite-plugin-svelte": "^2.0.2",
    "svelte": "^3.55.0",
    "vite": "^4.0.0"
  }
}`
    },
    dependencies: {
      "svelte": "^3.55.0",
      "@sveltejs/vite-plugin-svelte": "^2.0.2",
      "vite": "^4.0.0"
    }
  },

  // Шаблон для Angular
  {
    id: "angular-app",
    name: "Angular приложение",
    description: "Базовый проект на Angular",
    longDescription: "Стартовый шаблон Angular с настройкой модулей, компонентов и сервисов",
    frameworks: ["Angular"],
    techStack: ["TypeScript", "RxJS", "Angular CLI"],
    icon: (
      <svg viewBox="0 0 100 100" className="w-20 h-20">
        <path d="M50 10L10 30L20 70L50 90L80 70L90 30Z" fill="#6D28D9" />
      </svg>
    ),
    features: ["Components", "Modules", "Services", "RxJS"],
    previewFeatures: ["Чистая настройка", "Готовый к разработке"],
    category: "SPA",
    difficulty: "intermediate",
    files: {
      "src/app/app.component.ts": `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: \`
    <h1>{{title}}</h1>
    <button (click)="increment()">Count: {{count}}</button>
  \`,
  styles: [\`
    :host {
      display: block;
      padding: 2rem;
      text-align: center;
    }
  \`]
})
export class AppComponent {
  title = 'Angular App';
  count = 0;

  increment() {
    this.count++;
  }
}`,
      "src/app/app.module.ts": `import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}`,
      "angular.json": `{
  "projects": {
    "angular-app": {
      "architect": {
        "build": {
          "options": {
            "outputPath": "dist/angular-app"
          }
        }
      }
    }
  }
}`,
      "package.json": `{
  "name": "angular-app",
  "version": "0.0.0",
  "scripts": {
    "start": "ng serve",
    "build": "ng build"
  },
  "dependencies": {
    "@angular/core": "^16.0.0",
    "rxjs": "^7.8.0"
  },
  "devDependencies": {
    "@angular/cli": "^16.0.0"
  }
}`
    },
    dependencies: {
      "@angular/core": "^16.0.0",
      "@angular/cli": "^16.0.0",
      "rxjs": "^7.8.0"
    }
  }
];