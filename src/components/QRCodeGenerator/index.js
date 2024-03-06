import React from "react";
import QRCode from "qrcode.react";

const QRCodeGenerator = ({ value }) => {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <QRCode value={value} size={280} fgColor="#212121" />
    </div>
  );
};

export default QRCodeGenerator;
