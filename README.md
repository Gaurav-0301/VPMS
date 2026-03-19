Gatekeeper: Visitor Pass Management System
Gatekeeper is a modern, full-stack solution designed to streamline the visitor check-in process. It features automated PDF pass generation,
secure QR code verification, and real-time email notifications.

Features
Host Dashboard: Approve or Reject visitor requests with a single click.

Automated Passes: Generates professional PDF IDs with visitor photos and unique QR codes.

Email Integration: Sends approved passes directly to the visitor's inbox via Nodemailer.

Secure Auth: Role-based access control (Admin, Host, Security) using JWT.

Clean UI: Responsive design built with React, Tailwind CSS, and DaisyUI.

Tech Stack
Frontend: React.js, Tailwind CSS, Lucide Icons, React Hot Toast.

Backend: Node.js, Express.js.

Database: MongoDB (Mongoose).

Tools: JWT, PDFKit, Nodemailer, QRCode.

Setup Instructions
1. Clone the Repository
  git clone https://github.com/your-username/gatekeeper.git
  cd gatekeeper
  
2. Backend Setup
Navigate to the server directory and install dependencies:
   cd Server
   npm install
   Create a .env file in the Server folder:

Code snippet
PORT=2724
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-password
Note: For EMAIL_PASS, use a Google App Password, not your regular Gmail password.

3. Frontend Setup
Navigate to the client directory and install dependencies:
   cd ../Client
   npm install
4. Run the Application
   You will need two terminals open:

Terminal 1 (Backend):
  cd Server
  npm run dev

  
Terminal 2 (Frontend):
  cd Client
  npm run dev


Gatekeeper: Visitor Pass Management System

> Live Demo:[https://vpms-psi.vercel.app/](https://vpms-psi.vercel.app/)
> Backend API:[https://gatekeeper-sx2h.onrender.com](https://gatekeeper-sx2h.onrender.com)
