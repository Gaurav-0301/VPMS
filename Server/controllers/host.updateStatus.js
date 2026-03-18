const reg = require("../models/Registration.model");
const sendPassEmail = require("../utils/pdfGenerator"); // Import the utility we created

const updateStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;

    // 1. Update the record in MongoDB
    const updatedVisitor = await reg.findByIdAndUpdate(
      id,
      { $set: { status: status } },
      { new: true }
    );

    if (!updatedVisitor) {
      return res.status(404).json({
        success: false,
        message: "Visitor record not found",
      });
    }

    // 2. If the status is 'Approved', trigger the PDF Email utility
    if (status === "Approved") {
      // We run this as a "background" task so the API response isn't delayed
      // by the time it takes to generate a PDF and send an email.
      sendPassEmail(updatedVisitor).catch((err) => {
        console.error("PDF/Email Generation Error:", err);
      });
    }

    return res.status(200).json({
      success: true,
      message: `Status updated to ${status} successfully`,
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