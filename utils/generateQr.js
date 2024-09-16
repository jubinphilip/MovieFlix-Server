import QRCode from 'qrcode';
import dotenv from 'dotenv';
import  Twilio  from 'twilio';

dotenv.config();

// Initialize Twilio client with account SID and Auth token from environment variables
const client = new Twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

export const generateQrcode = async (bookingdetails) => {
  console.log("Whatsapp", bookingdetails);

  const bookingInfo = {
    name: bookingdetails.userid.username,
    Movie: bookingdetails.movieid.title,
    Showtime: bookingdetails.showid.timing,
    Theatre: bookingdetails.theatreid.theatrename,
    ticketprice: bookingdetails.theatreid.ticketprice,
    Date: bookingdetails.booked_date,
    Seats: bookingdetails.bookedSeats,
  };

  const message = `Hi ${bookingdetails.userid.username},

Your movie booking is confirmed! 🎉

Here are your booking details:

- Movie: ${bookingdetails.movieid.title}
- Theatre: ${bookingdetails.theatreid.theatrename}
- Showtime: ${bookingdetails.showid.timing}
- Ticket Price: ₹${bookingdetails.theatreid.ticketprice}
- Booking Date: ${bookingdetails.booked_date}
- Seats: ${bookingdetails.bookedSeats.join(", ")}

Thank you for booking with us! Enjoy your movie! 🎬`;

  const bookingData = JSON.stringify(bookingInfo);

  try {
    // Generate QR Code
    const qrCodeUrl = await QRCode.toDataURL(bookingData);
    console.log('QR Code URL:', qrCodeUrl);

    // Send WhatsApp message
    await sendWhatsappMessage(bookingdetails.userid.phone, message);

    return { qrCodeUrl };
  } catch (err) {
    console.error('Error generating QR code:', err);
    throw new Error('Error generating QR code');
  }
};

// Function to send WhatsApp message
async function sendWhatsappMessage(to, message) {
  try {
    const response = await client.messages.create({
      body: message,
      from: 'whatsapp:' + process.env.Whatsapp_No,  // Ensure this is a Twilio WhatsApp sandbox number
      to: `whatsapp:${+917025889751}`,  // Make sure the phone number is in E.164 format (e.g., '+1234567890')
    });
    console.log("Message sent, SID:", response.sid);
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
    throw new Error("Error sending WhatsApp message");
  }
}
