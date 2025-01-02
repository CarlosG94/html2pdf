window.function = function (html, fileName) {
  // Hardcode A4 in portrait
  const orientation = 'portrait';
  const format = 'a4';
  const margin = 0;

  // Fallback if user-provided arguments aren't set
  html = html.value || "No HTML provided.";
  fileName = fileName.value || "file.pdf";

  // Optional custom CSS (you can expand/modify as needed)
  const customCSS = `
    body {
      margin: 0 !important;
      padding: 0;
      width: 100%;
      min-height: 100vh;
    }
    .main {
      width: 100%;
      min-height: 100vh;
      position: relative;
    }
    #content {
      width: 100%;
      min-height: 100vh;
      margin: 0;
      padding: 0;
    }
    button#download {
      cursor: pointer;
      position: fixed;
      right: 4px;
      top: 4px;
      font-weight: 600;
      background-color: #FFFFFF;
      box-shadow: 0px 0px 1px rgba(62, 65, 86, 0.24), 0px 4px 8px rgba(62, 65, 86, 0.16);
      color: rgba(44, 44, 44, 0.92);
      border: 0.5px solid #00000024;
      border-radius: 8px;
      height: 32px;
      padding: 0 12px;
      font-size: 0.75rem;
      z-index: 999;
    }
    button#download:hover {
      background-color: rgba(0, 0, 0, 0.05);
      box-shadow: 0px 0px 1px rgba(62, 65, 86, 0.32), 0px 4px 8px rgba(62, 65, 86, 0.16);
    }
    .page-break {
      page-break-before: always;
    }
    /* Optional: Avoid breaking inside certain elements */
    .avoid-break {
      page-break-inside: avoid;
    }
    ::-webkit-scrollbar {
      width: 5px;
      background-color: rgba(0, 0, 0, 0.08);
    }
    ::-webkit-scrollbar-thumb {
      background-color: rgba(0, 0, 0, 0.32);
      border-radius: 4px;
    }
  `;

  // Build the HTML that is returned as a renderable data URL
  const originalHTML = `
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.2/html2pdf.bundle.min.js"></script>
    <style>${customCSS}</style>
    <div class="main">
      <div class="header">
        <button id="download">Download</button>
      </div>
      <div id="content">${html}</div>
    </div>
    <script>
      document.getElementById('download').addEventListener('click', function() {
        var element = document.getElementById('content');
        var button = this;
        button.innerText = 'Downloading...';
        button.className = 'downloading';

        // Basic html2pdf.js options
        var opt = {
          pagebreak: { mode: ['css'] },
          margin: ${margin},
          filename: '${fileName}',
          html2canvas: {
            useCORS: true,
            scale: 1 // no zoom
          },
          jsPDF: {
            unit: 'px',
            orientation: '${orientation}',
            format: '${format}', // or [595, 842] for explicit A4 px
            hotfixes: ['px_scaling']
          }
        };

        html2pdf().set(opt).from(element).toPdf().get('pdf').then(function(pdf) {
          button.innerText = 'Done 🎉';
          button.className = 'done';
          setTimeout(function() {
            button.innerText = 'Download';
            button.className = '';
          }, 2000);
        }).save();
      });
    </script>
  `;

  // Encode and return as a data URL
  var encodedHtml = encodeURIComponent(originalHTML);
  return "data:text/html;charset=utf-8," + encodedHtml;
};
