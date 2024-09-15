import QRCode from 'qrcode';
import wbm from 'wbm';

export const generateQrcode = async (bookingdetails) => {
    console.log("Whatsapp", bookingdetails);
//Extracting details needed for booking from the argument
    const bookingInfo = {
        "name": bookingdetails.userid.username,
        "Movie": bookingdetails.movieid.title,
        "Showtime": bookingdetails.showid.timing,
        "Theatre": bookingdetails.theatreid.theatrename,
        "ticketprice": bookingdetails.theatreid.ticketprice,
        "Date": bookingdetails.booked_date,
        "Seats": bookingdetails.bookedSeats
    };
    console.log(bookingInfo);

    const bookingData = JSON.stringify(bookingInfo);
    
    try {
        // Generate QR Code
        const qrCodeUrl = await QRCode.toDataURL(bookingData);
        console.log('QR Code URL:', qrCodeUrl);

        // Define the recipient's phone number
        const phoneNumber = '+917025889751';

        // Send the QR code URL via WhatsApp using wbm
        wbm.start().then(async () => {
            const contacts = [{ phone: phoneNumber, name: bookingdetails.userid.username }];
            const message = `Hi {{name}}, your booking was successful. Here is your QR code: ${qrCodeUrl}`;
            
            await wbm.send(contacts, message);
            await wbm.end();
        }).catch(err => {
            console.error('Error sending message:', err);
        });

        return { qrCodeUrl };
    } catch (err) {
        console.error('Error generating QR code:', err);
        throw new Error('Error generating QR code');
    }
};
