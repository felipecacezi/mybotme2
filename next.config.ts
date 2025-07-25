import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        // Aplica CORS a todas as rotas (ou você pode especificar rotas mais específicas)
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*', // Permite qualquer origem. Em produção, considere restringir a origens específicas.
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,POST,PUT,DELETE,OPTIONS', // Métodos HTTP permitidos
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-Requested-With, Content-Type, Authorization', // Cabeçalhos permitidos
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true', // Permite o envio de credenciais (cookies, cabeçalhos de autorização)
          },
        ],
      },
    ];
  },
};

export default nextConfig;