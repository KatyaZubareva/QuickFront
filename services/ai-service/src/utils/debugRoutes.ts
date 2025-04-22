import { Application } from 'express';

export function debugRoutes(app: Application) {
  console.log('🔍 Registered routes:');

  if (!app._router?.stack) {
    console.log('❌ No routes registered!');
    return;
  }

  const printRoutes = (stack: any[], prefix = '') => {
    stack.forEach((layer: any) => {
      if (layer.route) {
        const path = prefix + layer.route.path;
        const methods = Object.keys(layer.route.methods)
          .map((m) => m.toUpperCase())
          .join(', ');
        console.log(`🛣️  ${methods} ${path}`);
      } else if (layer.name === 'router' && layer.handle?.stack) {
        const match = layer.regexp?.toString().match(/\\\/(.*?)\\\/\?/);
        const nestedPath = match ? `/${match[1]}` : '';
        printRoutes(layer.handle.stack, prefix + nestedPath);
      }
    });
  };

  printRoutes(app._router.stack);
}
