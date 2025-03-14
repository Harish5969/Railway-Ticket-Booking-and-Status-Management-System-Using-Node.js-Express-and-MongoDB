const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 5000;
const FRONTEND_URL = "http://localhost:5500/index.html"; // Change if needed

app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/railwayDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Schema & Model
const bookingSchema = new mongoose.Schema({
    passengerName: String,
    age: Number,
    trainNumber: String,
    status: String
}, { timestamps: true });

const Booking = mongoose.model("Booking", bookingSchema);

// Routes

// Get all bookings
app.get("/bookings", async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a new booking
app.post("/bookings", async (req, res) => {
    try {
        const newBooking = new Booking(req.body);
        await newBooking.save();
        res.status(201).json(newBooking);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update a booking
app.put("/bookings/:id", async (req, res) => {
    try {
        const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedBooking);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete a booking
app.delete("/bookings/:id", async (req, res) => {
    try {
        await Booking.findByIdAndDelete(req.params.id);
        res.json({ message: "Booking deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Server Start
app.listen(PORT, () => {
    console.log(`🚀 Backend running on port ${PORT}`);
    console.log(`🌍 Open Frontend: ${FRONTEND_URL}`);
});
