import app from "./app.js";
import { prisma } from "./app/lib/prisma.js";

const port = process.env.PORT || 3000;

const bootstrap = async () => {
  try {
    app.post("/specialities", async (req, res) => {
      try {
        const speciality = await prisma.speciality.create({
          data: req.body
        });

        res.status(201).json({
          success: true,
          message: "Data posted successfully",
          data: speciality
        });
      } catch (error) {
        res.status(400).json({
          success: false,
          message: "Failed to create spacialty. Make sure the title is unique and all required fields (title, description, icon) are provided.",
          error: error instanceof Error ? error.message : "Unknown error"
        });
      }
    });

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
  }
}
bootstrap();