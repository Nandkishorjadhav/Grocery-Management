/**
 * SMS Service for sending OTPs via mobile
 * Supports multiple SMS providers: Twilio, MSG91, Fast2SMS, Vonage
 */

class SMSService {
  constructor() {
    this.provider = process.env.SMS_PROVIDER || 'twilio';
    this.initialized = false;
  }

  /**
   * Initialize SMS service based on the provider
   */
  async initialize() {
    try {
      const provider = this.provider.toLowerCase();

      switch (provider) {
        case 'twilio':
          return await this.initializeTwilio();
        case 'msg91':
          return await this.initializeMSG91();
        case 'fast2sms':
          return await this.initializeFast2SMS();
        case 'vonage':
          return await this.initializeVonage();
        default:
          console.warn(`⚠️  SMS provider '${provider}' not supported. Defaulting to development mode.`);
          this.initialized = false;
          return false;
      }
    } catch (error) {
      console.error('❌ Failed to initialize SMS service:', error.message);
      this.initialized = false;
      return false;
    }
  }

  /**
   * Initialize Twilio SMS service
   * Required env vars: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER
   */
  async initializeTwilio() {
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
      console.warn('⚠️  Twilio not configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER in .env');
      return false;
    }

    try {
      // Dynamically import Twilio
      const twilio = await import('twilio');
      this.client = twilio.default(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
      this.fromNumber = process.env.TWILIO_PHONE_NUMBER;
      this.initialized = true;
      console.log('✅ Twilio SMS service initialized');
      return true;
    } catch (error) {
      console.error('❌ Twilio initialization failed:', error.message);
      console.log('💡 Install Twilio: npm install twilio');
      return false;
    }
  }

  /**
   * Initialize MSG91 SMS service (Popular in India)
   * Required env vars: MSG91_AUTH_KEY, MSG91_SENDER_ID
   */
  async initializeMSG91() {
    if (!process.env.MSG91_AUTH_KEY || !process.env.MSG91_SENDER_ID) {
      console.warn('⚠️  MSG91 not configured. Set MSG91_AUTH_KEY, MSG91_SENDER_ID in .env');
      return false;
    }

    this.msg91Config = {
      authKey: process.env.MSG91_AUTH_KEY,
      senderId: process.env.MSG91_SENDER_ID,
      route: process.env.MSG91_ROUTE || '4' // 4 = Transactional
    };
    this.initialized = true;
    console.log('✅ MSG91 SMS service initialized');
    return true;
  }

  /**
   * Initialize Fast2SMS service (Popular in India)
   * Required env vars: FAST2SMS_API_KEY
   */
  async initializeFast2SMS() {
    if (!process.env.FAST2SMS_API_KEY) {
      console.warn('⚠️  Fast2SMS not configured. Set FAST2SMS_API_KEY in .env');
      return false;
    }

    this.fast2smsConfig = {
      apiKey: process.env.FAST2SMS_API_KEY,
      senderId: process.env.FAST2SMS_SENDER_ID || 'GROCER'
    };
    this.initialized = true;
    console.log('✅ Fast2SMS service initialized');
    return true;
  }

  /**
   * Initialize Vonage (formerly Nexmo) SMS service
   * Required env vars: VONAGE_API_KEY, VONAGE_API_SECRET
   */
  async initializeVonage() {
    if (!process.env.VONAGE_API_KEY || !process.env.VONAGE_API_SECRET) {
      console.warn('⚠️  Vonage not configured. Set VONAGE_API_KEY, VONAGE_API_SECRET in .env');
      return false;
    }

    try {
      const Vonage = await import('@vonage/server-sdk');
      this.client = new Vonage.default({
        apiKey: process.env.VONAGE_API_KEY,
        apiSecret: process.env.VONAGE_API_SECRET
      });
      this.fromNumber = process.env.VONAGE_FROM_NUMBER || 'GroceryMgmt';
      this.initialized = true;
      console.log('✅ Vonage SMS service initialized');
      return true;
    } catch (error) {
      console.error('❌ Vonage initialization failed:', error.message);
      console.log('💡 Install Vonage: npm install @vonage/server-sdk');
      return false;
    }
  }

  /**
   * Send OTP via SMS
   * @param {string} mobile - Mobile number with country code (e.g., +919876543210)
   * @param {string} otp - One-time password
   */
  async sendOTP(mobile, otp) {
    try {
      // Initialize if not already done
      if (!this.initialized) {
        const initialized = await this.initialize();
        if (!initialized) {
          // Development mode - log to console
          console.log(`📱 [DEV MODE] SMS to ${mobile}: Your OTP is ${otp}`);
          console.log(`💡 Configure SMS service in .env to send real SMS`);
          return { success: true, mode: 'development' };
        }
      }

      // Format mobile number
      const formattedMobile = this.formatMobileNumber(mobile);

      // Send based on provider
      switch (this.provider.toLowerCase()) {
        case 'twilio':
          return await this.sendViaTwilio(formattedMobile, otp);
        case 'msg91':
          return await this.sendViaMSG91(formattedMobile, otp);
        case 'fast2sms':
          return await this.sendViaFast2SMS(formattedMobile, otp);
        case 'vonage':
          return await this.sendViaVonage(formattedMobile, otp);
        default:
          throw new Error(`Unsupported SMS provider: ${this.provider}`);
      }
    } catch (error) {
      console.error('❌ Failed to send OTP SMS:', error.message);
      
      // Fallback to console logging in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`📱 [DEV MODE] SMS to ${mobile}: Your OTP is ${otp}`);
        return { success: true, mode: 'development' };
      }
      
      throw new Error(`Failed to send OTP SMS: ${error.message}`);
    }
  }

  /**
   * Format mobile number to ensure it has country code
   */
  formatMobileNumber(mobile) {
    // Remove any spaces, dashes, or parentheses
    let formatted = mobile.replace(/[\s\-()]/g, '');
    
    // If number doesn't start with +, add default country code
    if (!formatted.startsWith('+')) {
      const defaultCountryCode = process.env.DEFAULT_COUNTRY_CODE || '+91'; // Default to India
      formatted = defaultCountryCode + formatted;
    }
    
    return formatted;
  }

  /**
   * Send SMS via Twilio
   */
  async sendViaTwilio(mobile, otp) {
    const message = `Your Grocery Management OTP is: ${otp}. Valid for 10 minutes. Do not share this OTP with anyone.`;
    
    const result = await this.client.messages.create({
      body: message,
      from: this.fromNumber,
      to: mobile
    });

    console.log(`✅ OTP SMS sent via Twilio to ${mobile}`);
    console.log(`📱 Message SID: ${result.sid}`);
    
    return { success: true, messageId: result.sid, provider: 'twilio' };
  }

  /**
   * Send SMS via MSG91
   */
  async sendViaMSG91(mobile, otp) {
    try {
      const axios = (await import('axios')).default;
      
      const message = `Your Grocery Management OTP is ${otp}. Valid for 10 minutes. Do not share this code.`;
      
      // Clean mobile number - remove +91 prefix for MSG91
      const cleanMobile = mobile.replace('+91', '').replace('+', '').trim();
      
      // MSG91 SMS API v5
      const url = 'https://control.msg91.com/api/v5/otp';
      
      // Alternative: Use simple SMS API
      const smsUrl = `https://control.msg91.com/api/sendhttp.php`;
      const params = {
        authkey: this.msg91Config.authKey,
        mobiles: cleanMobile,
        message: message,
        sender: this.msg91Config.senderId,
        route: this.msg91Config.route,
        country: '91'
      };

      console.log(`📤 Sending SMS via MSG91 to ${cleanMobile}...`);
      
      const response = await axios.get(smsUrl, { params });

      console.log(`✅ OTP SMS sent via MSG91 to ${mobile}`);
      console.log(`📱 MSG91 Response:`, response.data);
      
      return { success: true, response: response.data, provider: 'msg91' };
    } catch (error) {
      console.error('❌ MSG91 SMS Error:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Send SMS via Fast2SMS
   */
  async sendViaFast2SMS(mobile, otp) {
    const axios = (await import('axios')).default;
    
    const message = `Your Grocery Management OTP is ${otp}. Valid for 10 minutes.`;
    
    const url = 'https://www.fast2sms.com/dev/bulkV2';
    const params = {
      authorization: this.fast2smsConfig.apiKey,
      message: message,
      numbers: mobile.replace('+91', '').replace('+', ''),
      route: 'v3',
      sender_id: this.fast2smsConfig.senderId
    };

    const response = await axios.get(url, { params });

    console.log(`✅ OTP SMS sent via Fast2SMS to ${mobile}`);
    return { success: true, response: response.data, provider: 'fast2sms' };
  }

  /**
   * Send SMS via Vonage
   */
  async sendViaVonage(mobile, otp) {
    const message = `Your Grocery Management OTP is: ${otp}. Valid for 10 minutes.`;
    
    return new Promise((resolve, reject) => {
      this.client.message.sendSms(
        this.fromNumber,
        mobile,
        message,
        (err, responseData) => {
          if (err) {
            reject(err);
          } else {
            if (responseData.messages[0].status === '0') {
              console.log(`✅ OTP SMS sent via Vonage to ${mobile}`);
              resolve({ success: true, messageId: responseData.messages[0]['message-id'], provider: 'vonage' });
            } else {
              reject(new Error(`Vonage error: ${responseData.messages[0]['error-text']}`));
            }
          }
        }
      );
    });
  }
}

// Export singleton instance
const smsService = new SMSService();
export default smsService;
