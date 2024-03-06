import React from "react";
import * as XLSX from "xlsx";

class ExcelReader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  handleFile = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      this.setState({ data: jsonData });
    };

    reader.readAsArrayBuffer(file);
  };

  render() {
    return (
      <div>
        <input type="file" onChange={this.handleFile} />
        <table>
          <tbody>
            {this.state.data.map((row, index) => (
              <tr key={index}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default ExcelReader;
