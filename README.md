# Wave Rider Boat Experience

An e-commerce web app to book dolphin and whale-watching boat trips.  
Built with Node.js, Express, MongoDB, and EJS. Includes features like user login, wishlist, real-time booking availability, and admin tools.

---

## Features

- User authentication & role-based access (User/Admin)
- Add & list boat trip services (with image upload)
- Wishlist for future bookings
- Book trips with date selection and availability check
- Booking confirmation emails via Mailtrap
- View user bookings (past and upcoming)
- Admin dashboard to manage services, bookings, and users
- Booking analytics with Chart.js
- Export bookings to PDF
- Clean layout with partials and consistent design

---

## Tech Stack

- Backend: Node.js, Express
- Frontend: EJS Templates, Bootstrap 5
- Database: MongoDB with Mongoose
- Authentication: express-session
- Email: Nodemailer + Mailtrap
- File Upload: Multer
- PDF Generation: PDFKit

---

## Libraries

root folder wave-rider
npm init -y
npm install express mongoose dotenv ejs express-session connect-mongo
npm install bcrypt
npm install multer
npm install nodemailer
npm install pdfkit moment

---

## Installation

1. Clone the repository

- bash
  git clone https://github.com/doojesh/WaveRider
  cd wave-rider
