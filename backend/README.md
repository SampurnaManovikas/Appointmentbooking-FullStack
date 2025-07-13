# Appointment Booking API

A robust backend API for managing appointment bookings with email notifications, built with Node.js and Express.

## Features

- ✅ **Booking Management**: Create, read, update, and delete appointments
- ✅ **Time Slot Validation**: Prevent double bookings automatically
- ✅ **Input Validation**: Comprehensive validation for phone numbers, emails, and dates
- ✅ **Email Notifications**: Automated confirmation emails to clients and admin
- ✅ **Security**: Rate limiting, CORS, helmet protection
- ✅ **Error Handling**: Comprehensive error handling and logging
- ✅ **Production Ready**: Optimized for deployment on Render.com

## API Endpoints

### Bookings
- `GET /api/bookings/date/:date` - Get all bookings for a specific date
- `GET /api/bookings/slots/:date` - Get booked time slots for a date
- `POST /api/bookings` - Create a new booking
- `GET /api/bookings/:id` - Get booking by ID
- `PATCH /api/bookings/:id/status` - Update booking status
- `DELETE /api/bookings/:id` - Delete booking

### Email
- `POST /api/email/send-confirmation` - Send confirmation emails
- `POST /api/email/test` - Test email configuration

### Health Check
- `GET /health` - API health status

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment variables:
   ```bash
   cp .env.example .env
   ```
4. Configure your environment variables in `.env`
5. Start the server:
   ```bash
   npm start
   ```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `production` |
| `PORT` | Server port | `5000` |
| `FRONTEND_URL` | Frontend URL for CORS | `https://your-app.netlify.app` |
| `SMTP_HOST` | SMTP server host | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP server port | `587` |
| `SMTP_USER` | SMTP username | `your-email@gmail.com` |
| `SMTP_PASS` | SMTP password/app password | `your-app-password` |
| `ADMIN_EMAIL` | Admin notification email | `admin@clinic.com` |

## Deployment on Render.com

1. Push your code to GitHub
2. Connect your GitHub repository to Render
3. Set environment variables in Render dashboard
4. Deploy!

## Email Configuration

### Gmail Setup
1. Enable 2-factor authentication
2. Generate an app password
3. Use the app password in `SMTP_PASS`

### Other Email Providers
Update SMTP settings according to your provider:
- **Outlook**: `smtp-mail.outlook.com:587`
- **Yahoo**: `smtp.mail.yahoo.com:587`
- **SendGrid**: `smtp.sendgrid.net:587`

## Validation Rules

### Phone Number
- Must be exactly 10 digits
- Only numeric characters allowed
- Automatically sanitized (removes formatting)

### Email
- Must be valid email format
- Required for all bookings

### Date/Time
- Date must be in YYYY-MM-DD format
- Time must be in H:MM AM/PM format
- No past dates allowed
- No weekend bookings

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "fieldName",
      "message": "Specific error message"
    }
  ]
}
```

## Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configured for your frontend domain
- **Helmet**: Security headers
- **Input Validation**: Comprehensive validation with Joi
- **Error Sanitization**: No sensitive data in error responses

## Development

```bash
# Install dependencies
npm install

# Start development server with auto-reload
npm run dev

# Run tests
npm test
```

## Production Considerations

1. **Database**: Replace in-memory storage with MongoDB or PostgreSQL
2. **Authentication**: Add JWT authentication for admin endpoints
3. **Logging**: Implement structured logging with Winston
4. **Monitoring**: Add health checks and monitoring
5. **Caching**: Implement Redis for session management
6. **File Storage**: Add file upload capabilities if needed

## Support

For issues and questions, please contact the development team.