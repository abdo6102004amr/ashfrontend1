# EmailJS Setup Guide

To enable email sending from the contact form, follow these steps:

## Step 1: Sign up for EmailJS
1. Go to https://www.emailjs.com/
2. Click "Sign Up" (it's free)
3. Create an account and verify your email

## Step 2: Add Email Service
1. After logging in, go to **Email Services** in the left sidebar
2. Click **"Add New Service"**
3. Choose **Gmail** (or your preferred email provider)
4. Click **"Connect Account"** and authorize EmailJS to access your Gmail
5. Once connected, you'll see your **Service ID** (e.g., `service_xxxxx`)
6. **Copy this Service ID** - you'll need it in Step 5

## Step 3: Create Email Template
1. Go to **Email Templates** in the left sidebar
2. Click **"Create New Template"**
3. In the template editor:
   - **Template Name**: Contact Form
   - **To Email**: `Ashbodysplash@gmail.com`
   - **From Name**: `{{from_name}}`
   - **From Email**: `{{from_email}}`
   - **Reply To**: `{{reply_to}}`
   - **Subject**: `New Contact Form Message from {{from_name}}`
   - **Content** (HTML or plain text):
     ```
     Name: {{from_name}}
     Email: {{from_email}}
     Phone: {{phone}}
     
     Message:
     {{message}}
     ```
4. Click **"Save"**
5. **Copy the Template ID** (e.g., `template_xxxxx`) - you'll need it in Step 5

## Step 4: Get Public Key
1. Go to **Account** → **General** in the left sidebar
2. Scroll down to **API Keys**
3. You'll see your **Public Key** (e.g., `xxxxxxxxxxxxx`)
4. **Copy this Public Key** - you'll need it in Step 5

## Step 5: Update ContactPage.js
1. Open `src/pages/ContactPage.js`
2. Find these lines (around line 20-22):
   ```javascript
   const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
   const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
   const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';
   ```
3. Replace them with your actual values:
   ```javascript
   const EMAILJS_SERVICE_ID = 'service_xxxxx';  // Your Service ID from Step 2
   const EMAILJS_TEMPLATE_ID = 'template_xxxxx'; // Your Template ID from Step 3
   const EMAILJS_PUBLIC_KEY = 'xxxxxxxxxxxxx';   // Your Public Key from Step 4
   ```
4. Save the file

## Step 6: Test
1. Restart your development server if it's running
2. Go to the Contact page
3. Fill out the form and click "Send"
4. Check your email inbox at `Ashbodysplash@gmail.com`

## Troubleshooting

**If you get an error:**
- Check the browser console (F12) for detailed error messages
- Make sure all three credentials are updated (not still "YOUR_XXX_ID")
- Verify your Service is connected and active
- Verify your Template has the correct variable names: `{{from_name}}`, `{{from_email}}`, `{{phone}}`, `{{message}}`
- Make sure your Public Key is correct

**Common Issues:**
- **"Invalid template ID"**: Check that your Template ID is correct
- **"Invalid service ID"**: Check that your Service ID is correct and the service is connected
- **"Invalid public key"**: Check that your Public Key is correct
- **"Service unavailable"**: Make sure your email service is connected and active

The form will then send emails directly to Ashbodysplash@gmail.com!

