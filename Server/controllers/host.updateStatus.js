const reg = require("../models/Registration.model");
const sendPassEmail = require("../utils/pdfGenerator"); 

const updateStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;

    // 1. Update the record in MongoDB
   // In updateStatus controller
const updatedVisitor = await reg.findByIdAndUpdate(
  id,
  { $set: { status: status } },
  { new: true }
).lean(); 

    if (!updatedVisitor) {
      return res.status(404).json({
        success: false,
        message: "Visitor record not found",
      });
    }

    


if (status === "Approved") {
    try {
        console.log("Starting Email Generation for:", updatedVisitor.refId);
        
        
        await sendPassEmail(updatedVisitor);
        
        console.log("✅ Email sent successfully");
    } catch (err) {
       
        console.error("❌ PDF/Email Generation Error:", err.message);
        
    }
}


return res.status(200).json({
    success: true,
    message: `Status updated to ${status} and email sent.`,
    data: updatedVisitor
});

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Status Update failed: " + error.message,
    });
  }
};

module.exports = updateStatus;