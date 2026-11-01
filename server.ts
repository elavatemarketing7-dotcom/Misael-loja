import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'data', 'products-store.json');

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Support base64 image data in requests up to 50MB
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Helper to safely read products from disk
function readProductsStore(): any[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const data = JSON.parse(raw);
      if (Array.isArray(data)) {
        return data;
      }
    }
  } catch (err) {
    console.error('Erro ao ler products-store.json:', err);
  }
  return [];
}

// Helper to safely write products to disk
function writeProductsStore(items: any[]): boolean {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Erro ao gravar products-store.json:', err);
    return false;
  }
}

// API Endpoints for MN Store catalog
app.get('/api/products', (_req, res) => {
  const products = readProductsStore();
  res.json({ success: true, count: products.length, products });
});

app.post('/api/products', (req, res) => {
  try {
    const productData = req.body;
    if (!productData || !productData.name) {
      return res.status(400).json({ success: false, message: 'Nome da camisa é obrigatório.' });
    }

    const current = readProductsStore();
    const newProduct = {
      ...productData,
      id: productData.id || `mn-custom-${Date.now()}`
    };

    // Prepend new product so it appears at top of store
    const updated = [newProduct, ...current.filter((p) => p.id !== newProduct.id)];
    writeProductsStore(updated);

    return res.status(201).json({ success: true, product: newProduct });
  } catch (error: any) {
    console.error('Erro ao criar produto:', error);
    return res.status(500).json({ success: false, message: error.message || 'Erro interno' });
  }
});

app.put('/api/products/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const current = readProductsStore();
    const index = current.findIndex((p) => p.id === id);

    if (index === -1) {
      // If product didn't exist yet, insert it
      const newProduct = { ...updates, id };
      const updated = [newProduct, ...current];
      writeProductsStore(updated);
      return res.json({ success: true, product: newProduct });
    }

    const updatedProduct = { ...current[index], ...updates, id };
    current[index] = updatedProduct;
    writeProductsStore(current);

    return res.json({ success: true, product: updatedProduct });
  } catch (error: any) {
    console.error('Erro ao atualizar produto:', error);
    return res.status(500).json({ success: false, message: error.message || 'Erro interno' });
  }
});

app.delete('/api/products/:id', (req, res) => {
  try {
    const { id } = req.params;
    const current = readProductsStore();
    const filtered = current.filter((p) => p.id !== id);
    writeProductsStore(filtered);
    return res.json({ success: true, message: 'Produto removido com sucesso.' });
  } catch (error: any) {
    console.error('Erro ao deletar produto:', error);
    return res.status(500).json({ success: false, message: error.message || 'Erro interno' });
  }
});

app.post('/api/products/reset', (_req, res) => {
  try {
    // Re-seed default catalog
    const seedPath = path.join(__dirname, 'data', 'products-store.json');
    if (fs.existsSync(seedPath)) {
      const items = readProductsStore();
      return res.json({ success: true, message: 'Catálogo restaurado com sucesso.', products: items });
    }
    return res.json({ success: true, message: 'Catálogo restaurado.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Setup Vite middleware for development or static serving for production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MN Store server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
