// Generate QRIS code (simulation)
function generateQRIS() {
    console.log('=== generateQRIS called ===');
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderData = `QRIS-KANTIN-${Date.now()}-${total}`;
    console.log('Order data:', orderData);

    const qrcodeElement = document.getElementById('qrcode');
    const placeholder = document.getElementById('qrPlaceholder');
    console.log('QR element:', qrcodeElement);
    console.log('Placeholder:', placeholder);
    console.log('QRCode available:', typeof QRCode !== 'undefined');

    if (!qrcodeElement) {
        console.error('QR code element not found!');
        return;
    }

    // Clear previous QR code
    qrcodeElement.innerHTML = '';
    qrcodeElement.style.display = 'none';

    // Check if QRCode library is loaded
    if (typeof QRCode !== 'undefined') {
        console.log('QRCode library found, generating...');
        try {
            // Generate QR code
            const qrcode = new QRCode(qrcodeElement, {
                text: orderData,
                width: 250,
                height: 250,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.H
            });

            console.log('QR code generated successfully');

            // Hide placeholder and show QR code
            if (placeholder) {
                placeholder.style.display = 'none';
            }
            qrcodeElement.style.display = 'block';

        } catch (error) {
            console.error('Error generating QR code:', error);
            // Show error in QR area
            qrcodeElement.innerHTML = `
                <div style="padding: 20px; text-align: center; background: rgba(239, 68, 68, 0.1); border-radius: 8px; border: 1px solid rgba(239, 68, 68, 0.3);">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #EF4444; margin-bottom: 10px;"></i>
                    <p style="color: #EF4444; font-weight: bold; margin-bottom: 5px;">Error Generate QR Code</p>
                    <p style="color: #666; font-size: 12px;">${error.message}</p>
                </div>
            `;
            if (placeholder) placeholder.style.display = 'none';
            qrcodeElement.style.display = 'block';
        }
    } else {
        // Fallback if library not loaded
        console.error('QRCode library not loaded!');
        qrcodeElement.innerHTML = `
            <div style="padding: 40px; text-align: center; background: #f0f0f0; border-radius: 8px; border: 2px dashed #999;">
                <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 10px;">
                    <i class="fas fa-qrcode" style="font-size: 60px; color: #FF6B35;"></i>
                </div>
                <p style="color: #333; font-size: 14px; font-weight: bold; margin-bottom: 5px;">QR Code Simulasi</p>
                <p style="color: #FF6B35; font-weight: bold; font-size: 20px; margin: 10px 0;">${formatCurrency(total)}</p>
                <p style="color: #666; font-size: 11px; margin-top: 10px;">Order: ${Date.now()}</p>
                <p style="color: #999; font-size: 10px; margin-top: 5px;">Library QRCode.js tidak tersedia</p>
            </div>
        `;
        if (placeholder) placeholder.style.display = 'none';
        qrcodeElement.style.display = 'block';
    }
}
