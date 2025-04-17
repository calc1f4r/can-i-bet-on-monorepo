import { TwitterApi } from 'twitter-api-v2';
import * as dotenv from 'dotenv';
import * as http from 'http';
import { URL } from 'url';
dotenv.config();

const requiredEnvVars = ['CLIENT_ID', 'CLIENT_SECRET', 'CALLBACK_URL'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars.join(', '));
  process.exit(1);
}

const CLIENT_ID = process.env.CLIENT_ID!;
const CLIENT_SECRET = process.env.CLIENT_SECRET!;
const CALLBACK_URL = process.env.CALLBACK_URL!;

const client = new TwitterApi({ clientId: CLIENT_ID, clientSecret: CLIENT_SECRET });

async function main() {
  try {
    // Generate OAuth 2.0 authorization URL
    const { url, codeVerifier, state } = client.generateOAuth2AuthLink(
      CALLBACK_URL,
      { scope: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'] }
    );

    // Create a local server to handle the callback
    const server = http.createServer(async (req, res) => {
      if (!req.url) {
        res.writeHead(400);
        res.end('Invalid request');
        return;
      }

      const urlObj = new URL(req.url, CALLBACK_URL);
      const searchParams = urlObj.searchParams;

      // Extract authorization code and state from callback
      const code = searchParams.get('code');
      const returnedState = searchParams.get('state');

      if (!code || !returnedState || returnedState !== state) {
        res.writeHead(400);
        res.end('Invalid callback parameters');
        return;
      }

      try {
        // Exchange code for access token
        const { client: userClient, refreshToken, expiresIn, accessToken } = await client.loginWithOAuth2({
          code,
          codeVerifier,
          redirectUri: CALLBACK_URL,
        });

        console.log('Access token will expire in:', expiresIn, 'seconds');

        let tweet;
        try {
          tweet = await userClient.v2.tweet(`Hello world again ${new Date().toISOString()}`);
        } catch (error) {
          // If there is an error, refresh the access token and try again
          // (this typically happens when the access token expires after 2 hours)
          const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await client.refreshOAuth2Token(refreshToken!);
          const newUserClient = new TwitterApi(newAccessToken);
          tweet = await newUserClient.v2.tweet('Hello world');
        }

        console.log('Refresh token:', refreshToken);
        console.log('New access token:', accessToken);

        console.log(`Tweet posted successfully: https://x.com/user/status/${tweet.data.id}`)
        // Send success response
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`<h1>Success!</h1><p>Tweet ID: ${tweet.data.id}</p>`);

        // Close the server
        server.close();
      } catch (error) {
        console.error('Error:', error);
        res.writeHead(500);
        res.end('Authentication failed');
        server.close();
      }
    });

    // Start local server
    server.listen(3000, async () => {
      console.log('Waiting for authentication...');
      console.log('If your browser doesn\'t open automatically, please visit:', url);
      
      try {
        // Dynamically import the 'open' package
        const open = (await import('open')).default;
        await open(url);
      } catch (error) {
        console.log('Could not open browser automatically. Please open the URL manually.');
      }
    });
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main(); 