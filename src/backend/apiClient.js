const https = require('https');

class ApiClient {
  constructor(baseUrl = process.env.API_BASE_URL) {
    if (!baseUrl) {
      throw new Error('API_BASE_URL is required');
    }
    this.baseUrl = baseUrl;
  }

  async makeRequest(endpoint, options = {}) {
    const url = new URL(endpoint, this.baseUrl);
    
    return new Promise((resolve, reject) => {
      const req = https.request(url, {
        ...options,
        timeout: 10000, // 10 second timeout
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      }, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve(parsed);
            } else {
              reject(new Error(parsed.error || `Request failed with status ${res.statusCode}`));
            }
          } catch (err) {
            reject(new Error(`Failed to parse response: ${err.message}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(new Error(`Network error: ${error.message}`));
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timed out'));
      });
      
      if (options.body) {
        try {
          req.write(JSON.stringify(options.body));
        } catch (err) {
          reject(new Error(`Failed to stringify request body: ${err.message}`));
        }
      }
      
      req.end();
    });
  }

  async verifySubscription(userId, token) {
    try {
      console.log('Verifying subscription for user:', userId);
      
      // Get API keys first
      const apiKeys = await this.getApiKeys();
      console.log('Got API keys response:', JSON.stringify(apiKeys, null, 2));
      
      if (!apiKeys.success || !apiKeys.stripeKey) {
        throw new Error('Failed to get API configuration');
      }

      // Use the correct endpoint and payload structure
      const response = await this.makeRequest('/get-stripe-customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'CamStem-App'
        },
        body: { userId }  // Simplified payload to match backend expectation
      });

      console.log('Stripe customer response:', JSON.stringify(response, null, 2));

      if (!response.success) {
        throw new Error(response.message || 'Failed to verify subscription');
      }

      return {
        success: true,
        hasSubscription: response.status === 'active',
        subscriptionType: response.status,
        stripeCustomerId: response.stripeCustomerId
      };
    } catch (err) {
      console.error('Subscription verification failed:', err);
      return {
        success: false,
        error: err.message
      };
    }
  }

  async getApiKeys() {
    try {
      const response = await this.makeRequest('/get-api-config', {
        method: 'POST',
        headers: {
          'X-Client-Version': process.env.npm_package_version || '1.0.0',
          'X-Client-Platform': process.platform,
          'Accept': 'application/json',
          'User-Agent': 'CamStem-App'
        }
      });

      // Only log non-sensitive parts of the response
      console.log('API Response received:', response.success);

      if (response.success && response.config) {
        return {
          success: true,
          stripeKey: response.config.stripePublishableKey,
          encryptionKey: "DA3K9Y5kdGQ217dhKehCT4Jip0ehJ7rY", // Only hardcoded key we keep
          additionalConfig: {
            ...response.config,
            stripePublishableKey: '[REDACTED]' // Don't log sensitive keys
          }
        };
      }

      throw new Error('Invalid API response structure');
    } catch (err) {
      console.error('API config retrieval failed:', err);
      return {
        success: false,
        error: `Failed to retrieve API configuration: ${err.message}`
      };
    }
  }
}

module.exports = new ApiClient();
