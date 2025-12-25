// QR Code Fix - Use manual image instead of library
console.log('Loading QR code fix - Manual Image Version...');

// Wait for page to load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyQRFix);
} else {
    applyQRFix();
}

function applyQRFix() {
    console.log('Applying QR code fix...');

    // Override generateQRIS
    window.generateQRIS = function () {
        console.log('=== generateQRIS MANUAL IMAGE version ===');
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        const qrcodeElement = document.getElementById('qrcode');
        const placeholder = document.getElementById('qrPlaceholder');

        if (!qrcodeElement) {
            console.error('QR code element not found!');
            return;
        }

        // Clear
        qrcodeElement.innerHTML = '';

        // Hide placeholder
        if (placeholder) {
            placeholder.style.display = 'none';
        }

        // Display manual QR code image or generated placeholder
        qrcodeElement.innerHTML = `
            <div style="text-align: center;">
                <img src="qris-sample.png" 
                     alt="QR Code QRIS" 
                     style="width: 250px; height: 250px; display: block; margin: 0 auto; border-radius: 8px;"
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                <div style="display: none; padding: 40px; background: #f0f0f0; border-radius: 8px; border: 2px dashed #999;">
                    <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 10px;">
                        <i class="fas fa-qrcode" style="font-size: 60px; color: #FF6B35;"></i>
                    </div>
                    <p style="color: #333; font-size: 14px; font-weight: bold; margin-bottom: 5px;">QR Code QRIS</p>
                    <p style="color: #FF6B35; font-weight: bold; font-size: 20px; margin: 10px 0;">${formatCurrency(total)}</p>
                    <p style="color: #666; font-size: 11px; margin-top: 10px;">Scan untuk membayar</p>
                    <p style="color: #999; font-size: 10px; margin-top: 15px; padding-top: 15px; border-top: 1px dashed #ccc;">
                        💡 Tip: Letakkan gambar QR code Anda dengan nama <strong>qris-sample.png</strong> di folder kantin
                    </p>
                </div>
            </div>
        `;

        qrcodeElement.style.display = 'block';
        console.log('✓ QR display ready (manual image or placeholder)');
    };

    console.log('✓ QR code fix applied (manual image version)!');
}
