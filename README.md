# xrdPhase

**xrdPhase** is a web-based application designed for automated phase identification from X-ray diffraction (XRD) data. It provides researchers and material scientists with a user-friendly interface to upload XRD files and receive potential phase identifications, aiding in the rapid characterization of crystalline materials.

Live App: [https://xrdphase.onrender.com](https://xrdphase.onrender.com)  
GitHub Repository: [https://github.com/raymsm/xrdPhase](https://github.com/raymsm/xrdPhase)

---

## 🚀 Features

- 📁 Upload `.xy` XRD data files (2θ vs intensity).
- 🧠 Automated backend processing and phase suggestion.
- 📊 Real-time visualization of diffraction patterns.
- 🌐 Deployed online with no installation required.

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: Python (Flask)
- **Data Processing**: NumPy, SciPy, Pandas
- **Visualization**: Plotly.js
- **Deployment**: Render.com

---

## 🔧 Getting Started (Local Deployment)

To run the app locally:

### Prerequisites

- Python 3.8+
- pip

### Installation

```bash
git clone https://github.com/raymsm/xrdPhase.git
cd xrdPhase
pip install -r requirements.txt
python app.py
Navigate to http://localhost:5000 in your browser.

📂 Usage
Open the web app at https://xrdphase.onrender.com

Upload your XRD .xy file (2-column format: angle, intensity).

Click "Analyze" to begin phase identification.

View interactive plots and matching database results.

🧪 Sample Data Format
python-repl
Copy
Edit
20.0    123
20.1    135
20.2    140
...
Ensure your data file has:

No headers

Two tab- or space-separated columns

🤝 Contributing
Contributions are welcome! Here's how:

Fork the repository

Create a new branch (git checkout -b feature-name)

Make your changes

Commit (git commit -am 'Add new feature')

Push to the branch (git push origin feature-name)

Create a Pull Request

📄 License
This project is licensed under the MIT License. See LICENSE for details.

📬 Contact
Maintainer: raymsm
Project Link: https://github.com/raymsm/xrdPhase

For more information or support, open an issue on the GitHub repository.
