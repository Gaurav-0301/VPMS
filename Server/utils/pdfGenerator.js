const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');
const QRCode = require('qrcode');

const dataURIToBuffer = (dataURI) => {
    if (!dataURI) return null;
    const base64Data = dataURI.split(',')[1];
    return Buffer.from(base64Data, 'base64');
};

const sendPassEmail = async (visitor) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Data Setup
            const qrCodeDataUrl = await QRCode.toDataURL(visitor.refId, {
    margin: 1,
    width: 300, 
    color: {
        dark: '#1e293b', 
        light: '#ffffff'
    }
});
            const qrBuffer = dataURIToBuffer(qrCodeDataUrl);
            const photoBuffer = dataURIToBuffer(visitor.url);
            
            // Format current date/time for the pass
            const timestamp = new Date().toLocaleString('en-IN', {
                day: '2-digit', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit', hour12: true
            });

            const doc = new PDFDocument({ size: [650, 400], margin: 0 });
            let buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            
            doc.on('end', async () => {
                const pdfData = Buffer.concat(buffers);
                
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
                });

                // --- ENHANCED EMAIL BODY ---
                await transporter.sendMail({
                    from: '"Gatekeeper System" <no-reply@gatekeeper.com>',
                    to: visitor.email,
                    subject: `✅ Pass Approved - ${visitor.refId}`,
                    html: `
                        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 500px; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
                            <h2 style="color: #059669; margin-top: 0;">Booking Successful!</h2>
                            <p>Hi <b>${visitor.name}</b>,</p>
                            <p>Your visit to meet <b>${visitor.host}</b> has been approved. Please find your digital pass attached to this email.</p>
                            <div style="background: #f0fdf4; padding: 15px; border-radius: 5px; border-left: 4px solid #059669;">
                                <strong>Instructions:</strong> Present the QR code in the attached PDF at the security gate for entry.
                            </div>
                            <p style="font-size: 12px; color: #666; margin-top: 20px;">Issued on: ${timestamp}</p>
                        </div>
                    `,
                    attachments: [{ filename: `VisitorPass_${visitor.refId}.pdf`, content: pdfData }]
                });
                resolve(true);
            });

            // --- ENHANCED PDF DESIGN ---
            
            // Background Base
            doc.rect(0, 0, 600, 350).fill('#ffffff');

            // Header Section
            doc.rect(0, 0, 600, 65).fill('#f1f5f9'); 
            doc.fillColor('#059669').fontSize(22).font('Helvetica-Bold').text('Status: Approved', 30, 22);
            doc.fillColor('#64748b').fontSize(10).font('Helvetica').text(`ISSUED: ${timestamp}`, 400, 28, { align: 'right', width: 170 });

            // Profile Photo with a slight "frame"
            if (photoBuffer) {
                doc.save();
                doc.fillColor('#e2e8f0').roundedRect(28, 88, 114, 114, 16).fill(); // border
                doc.roundedRect(30, 90, 110, 110, 15).clip();
                doc.image(photoBuffer, 30, 90, { width: 110, height: 110 });
                doc.restore();
            }

            // Visitor Details
            doc.fillColor('#1e293b').fontSize(22).font('Helvetica-Bold').text(visitor.name, 150, 100);
            doc.fillColor('#3b82f6').fontSize(14).font('Helvetica').text(visitor.purpose ? visitor.purpose.toUpperCase() : 'MEETING', 165, 132);
            
            doc.fillColor('#94a3b8').fontSize(10).text('HOSTING OFFICER', 165, 175, { characterSpacing: 1 });
            doc.fillColor('#1e293b').fontSize(18).font('Helvetica-Bold').text(visitor.host, 165, 190);

            // Ref ID label
            doc.fillColor('#94a3b8').fontSize(10).text('REF ID', 165, 225);
            doc.fillColor('#475569').fontSize(12).font('Helvetica').text(visitor.refId, 165, 240);

            // Enhanced Dashed QR Box
            doc.save();
            doc.strokeColor('#10b981').lineWidth(1.5).dash(6, { space: 4 });
            doc.roundedRect(340, 90, 230, 220, 20).stroke();
            doc.restore(); 

            if (qrBuffer) {
                doc.image(qrBuffer, 385, 115, { width: 140 });
            }

            // Footer of QR Box
            doc.fillColor('#059669').fontSize(13).font('Helvetica-Bold').text('AUTHORIZED ACCESS', 340, 265, { align: 'center', width: 230 });
            doc.fillColor('#64748b').fontSize(9).font('Helvetica').text('Scan at Security Entry', 340, 285, { align: 'center', width: 230 });

            // Bottom Brand Strip
            doc.rect(0, 330, 340, 20).fill('#0f172a');
            doc.fillColor('#ffffff').fontSize(8).text('GATEKEEPER - VISITOR MANAGEMENT SYSTEM', 20, 337);
            
            doc.fillColor('#94a3b8').fontSize(8).text(`VALID UNTIL: ${new Date().toLocaleDateString('en-IN')} | 11:59 PM`, 30, 310);

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = sendPassEmail;