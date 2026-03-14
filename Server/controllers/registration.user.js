const Reg = require('../models/Registration.model');

module.exports.createRegistration = async (req, res) => {
    const { name, purpose, number, host, email, url, status } = req.body;

    try {
        
        if (!name || !purpose || !number || !host || !url) {
            return res.status(400).json({
                success: false,
                message: "All required fields (name, purpose, number, host, url) are required"
            });
        }

        // Create the registration document
        const newRegistration = await Reg.create({
            name,
            purpose,
            number,
            host,
            email,
            url,
            status // This will use the 'Pending' default from your schema if not provided
        });

        // Send success response
        return res.status(201).json({
            success: true,
            message: "Registration successful",
            data: newRegistration
        });

    } catch (error) {
        console.error("createregistration controller error: ", error);
        
        return res.status(500).json({
            success: false,
            message: "Internal Server Error during registration"
        });
    }
};


module.exports.registrationStatus = async (req, res) => {
  const { number } = req.params;

  try {
  
    if (!number) {
      return res.status(400).json({
        success: false,
        message: "Number is required to check the status"
      });
    }

   
    const found = await Reg.findOne({ number: number });


    if (found) {
      return res.status(200).json({
        success: true,
        data: found 
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "No registration found with this number"
      });
    }

  } catch (error) {
    console.error("registrationStatus Controller error: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};