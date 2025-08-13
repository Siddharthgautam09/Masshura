# Second Email Template Setup - template_acceptance

You need to create this second email template in your EmailJS dashboard.

## Template Configuration

**Template ID:** `template_acceptance`
**Subject:** `Welcome to Masshura - Your Application is Approved! | {{company_name}}`

## Template HTML Content

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Masshura</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); padding: 40px 30px; text-align: center; color: white; border-radius: 15px 15px 0 0; box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);">
        <h1 style="margin: 0; font-size: 32px; font-weight: bold;">🎉 Congratulations!</h1>
        <p style="margin: 15px 0 0 0; font-size: 18px; opacity: 0.95;">Welcome to the Masshura Supplier Network</p>
    </div>
    
    <!-- Main Content -->
    <div style="background: white; padding: 40px 30px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
        
        <p style="font-size: 18px; margin-bottom: 25px; color: #2c3e50;">Dear {{supplier_name}},</p>
        
        <p style="font-size: 16px; margin-bottom: 20px; line-height: 1.8;">
            We are delighted to inform you that <strong>{{company_name}}</strong> has been <strong style="color: #4CAF50;">APPROVED</strong> as an official supplier partner with Masshura!
        </p>
        
        <!-- Application Details Box -->
        <div style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin: 25px 0; border-left: 5px solid #4CAF50;">
            <h3 style="margin-top: 0; color: #4CAF50; font-size: 20px;">✅ Application Approved</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 8px 0; font-weight: bold; width: 40%;">Company:</td>
                    <td style="padding: 8px 0;">{{company_name}}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: bold;">Reference Number:</td>
                    <td style="padding: 8px 0;">{{ref_no}}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: bold;">Approval Date:</td>
                    <td style="padding: 8px 0;">{{acceptance_date}}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: bold;">Status:</td>
                    <td style="padding: 8px 0; color: #4CAF50; font-weight: bold;">✅ APPROVED</td>
                </tr>
            </table>
        </div>
        
        <!-- Welcome Message -->
        <div style="background: linear-gradient(135deg, #e3f2fd 0%, #f0f9ff 100%); padding: 25px; border-radius: 10px; margin: 25px 0; border: 1px solid #e1f5fe;">
            <h3 style="margin-top: 0; color: #1976d2; font-size: 20px;">🚀 What's Next?</h3>
            <p style="margin: 15px 0; font-size: 16px;">{{message}}</p>
            
            <div style="margin: 20px 0;">
                <h4 style="color: #1976d2; margin-bottom: 10px;">Your Benefits Include:</h4>
                <ul style="padding-left: 20px; margin: 0;">
                    <li style="margin: 8px 0;">Access to exclusive supplier portal</li>
                    <li style="margin: 8px 0;">Direct communication with procurement team</li>
                    <li style="margin: 8px 0;">Priority consideration for new opportunities</li>
                    <li style="margin: 8px 0;">Monthly performance reports and feedback</li>
                </ul>
            </div>
        </div>
        
        <!-- Action Buttons -->
        <div style="text-align: center; margin: 35px 0;">
            <a href="{{portal_link}}" style="display: inline-block; background: #4CAF50; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; margin: 0 10px; box-shadow: 0 4px 10px rgba(76, 175, 80, 0.3); transition: all 0.3s ease;">
                🏢 Access Supplier Portal
            </a>
        </div>
        
        <!-- Important Information -->
        <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #ffc107;">
            <h4 style="margin-top: 0; color: #856404;">📋 Important Information:</h4>
            <ul style="color: #856404; margin: 0; padding-left: 20px;">
                <li style="margin: 5px 0;">Your supplier account is now active</li>
                <li style="margin: 5px 0;">You will receive your login credentials separately</li>
                <li style="margin: 5px 0;">All future communications will be through the portal</li>
                <li style="margin: 5px 0;">Please complete your profile setup within 7 days</li>
            </ul>
        </div>
        
        <!-- Support Information -->
        <div style="background: #f1f3f4; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h4 style="margin-top: 0; color: #5f6368;">🆘 Need Help?</h4>
            <p style="margin: 10px 0; color: #5f6368;">
                Our support team is here to help you get started:
            </p>
            <p style="margin: 10px 0;">
                <strong>Email:</strong> <a href="mailto:{{support_email}}" style="color: #1976d2;">{{support_email}}</a><br>
                <strong>Phone:</strong> +971 XX XXX XXXX (Business Hours: 9 AM - 6 PM UAE Time)
            </p>
        </div>
        
        <!-- Closing -->
        <p style="margin-top: 35px; font-size: 16px; line-height: 1.8;">
            We look forward to a successful partnership and are excited to work with {{company_name}}. 
            Together, we'll achieve great things!
        </p>
        
        <!-- Footer -->
        <div style="text-align: center; margin-top: 40px; padding-top: 25px; border-top: 2px solid #eee;">
            <p style="color: #666; margin: 0; font-size: 16px;">
                Best regards,<br>
                <strong style="color: #4CAF50; font-size: 18px;">{{from_name}}</strong><br>
                <em style="color: #999;">Supplier Partnership Team</em>
            </p>
            
            <div style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                <p style="margin: 0; font-size: 12px; color: #999;">
                    This is an automated message. Please do not reply to this email.<br>
                    For support, contact us at {{support_email}}
                </p>
            </div>
        </div>
    </div>
    
</body>
</html>
```

## Template Variables

Make sure your EmailJS template includes these variables:

- `{{supplier_name}}` - Contact person name
- `{{company_name}}` - Company name  
- `{{ref_no}}` - Reference number
- `{{acceptance_date}}` - Date of acceptance
- `{{portal_link}}` - Link to supplier portal
- `{{support_email}}` - Support email address
- `{{from_name}}` - "Masshura Team"
- `{{message}}` - Welcome message

## Setup Instructions

1. Log in to your EmailJS dashboard
2. Go to Email Templates
3. Click "Create New Template"
4. Set Template ID as: `template_acceptance`
5. Copy and paste the HTML content above
6. Save the template
7. Test using the "Test Template 2" button in your admin panel

This creates a professional welcome email that will be sent along with the account setup email when you approve suppliers.
