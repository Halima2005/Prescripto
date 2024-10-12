
const addDoctor = async (req, res) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
        const imageFile = req.file;

        // Log the file to check if it's being uploaded
        console.log("File received: ", imageFile);

        if (!imageFile) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Your logic here

        res.status(200).json({ message: "Doctor added successfully", data: { name, email, password, speciality, degree, experience, about, fees, address, image: imageFile } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};




export { addDoctor };

