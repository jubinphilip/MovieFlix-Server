import QRCode from 'qrcode';
import dotenv from 'dotenv';
import Twilio from 'twilio';
import ImageKit from 'imagekit';

dotenv.config();

// Initialize Twilio client with account SID and Auth token from environment variables
const client = new Twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

// Initialize ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export const generateQrcode = async (bookingdetails) => {
  console.log("Whatsapp", bookingdetails);

  const bookingInfo = {
    name: bookingdetails.userid.username,
    phone: bookingdetails.userid.phone,
    Movie: bookingdetails.movieid.title,
    Showtime: bookingdetails.showid.timing,
    Theatre: bookingdetails.theatreid.theatrename,
    ticketprice: bookingdetails.amount,
    Date: bookingdetails.booked_date,
    Seats: bookingdetails.bookedSeats,
  };

  //Message for user 
  const message = `Hi ${bookingdetails.userid.username},

Your movie booking is confirmed! 🎉

Here are your booking details:

- Movie: ${bookingdetails.movieid.title}
- Contact: ${bookingdetails.userid.phone}
- Theatre: ${bookingdetails.theatreid.theatrename}
- Showtime: ${bookingdetails.showid.timing}
- Ticket Price: ₹${bookingdetails.amount}
- Booking Date: ${bookingdetails.booked_date}
- Seats: ${bookingdetails.bookedSeats.join(", ")}

Thank you for booking with us! Enjoy your movie! 🎬`;

  const bookingData = JSON.stringify(bookingInfo);

  try {
    // Generate QR Code
    const qrCodeUrl = await QRCode.toDataURL(bookingData);
    console.log('QR Code URL:', qrCodeUrl);

    // Upload QR Code to ImageKit
    const uploadResponse = await imagekit.upload({
      file: qrCodeUrl, // base64 encoded string
      fileName: "qr-code.png",
    });

    console.log('ImageKit Upload Response:', uploadResponse);

    // Send WhatsApp message
    await sendWhatsappMessage(bookingdetails.userid.phone, message, uploadResponse.url);

    return { qrCodeUrl: uploadResponse.url };
  } catch (err) {
    console.error('Error generating QR code:', err);
    throw new Error('Error generating QR code');
  }
};

// Function to send WhatsApp message
async function sendWhatsappMessage(to, message, qrCodeUrl) {
  const fullMessage = `${message}

QR Code: ${qrCodeUrl}`;

try {
  const response = await client.messages.create({
    body: fullMessage,
    from: 'whatsapp:' + process.env.Whatsapp_No,  // This is a Twilio WhatsApp sandbox number
    to: `whatsapp:+917025889751`,  // Properly formatted WhatsApp number
  });
  console.log("Message sent, SID:", response.sid);
} catch (error) {
  console.error("Error sending WhatsApp message:", error);
  throw new Error("Error sending WhatsApp message");
}
}
