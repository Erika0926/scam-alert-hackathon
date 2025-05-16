import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 80,
    host: true,
    strictPort: true,
    allowedHosts: ['ec2-18-226-28-226.us-east-2.compute.amazonaws.com']
  }
});