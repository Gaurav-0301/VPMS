const reg = require("../models/Registration.model")

const updateStatus = async (req, res) => {
  try {

    const id = req.params.id;
    const { status } = req.body;   // FIXED

    await reg.findByIdAndUpdate(
      id,
      { $set: { status: status } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Status Updated Successfully"
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "Status Update failed " + error
    });

  }
};

module.exports = updateStatus;