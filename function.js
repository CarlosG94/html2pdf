window.function = function (html, fileName, breakBefore, breakAfter, breakAvoid) {
  // 1) Handle incoming parameters safely
  html = html.value || "No HTML set.";
  fileName = fileName.value || "file.pdf";
  // If these exist, split them into arrays; otherwise, empty arrays
  breakBefore = breakBefore.value ? breakBefore.value.split(",") : [];
  breakAfter = breakAfter.value ? breakAfter.value.split(",") : [];
  breakAvoid = breakAvoid.value ? breakAvoid.value.split(",") : [];

  // 2) Minimal custom CSS (tweak as needed)
  const customCSS = `
    body {
      margin: 0 !important;
      padding: 0;
      width: 100%;
      min-height: 100vh;
    }
    .page-break {
      page-break-before: always;
    }
  `;

  // 3) Build the HTML we’ll return as a data URI
  const originalHTML = `
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.2/html2pdf.bundle.min.js"></script>
    <style>${customCSS}</style>
    <div class="main">
      <button id="download" style="
        position: fixed; 
        top: 10px; 
        right: 10px; 
        z-index: 999; 
        cursor: pointer;
      ">
        Download
      </button>
      <div id="content">${html}</div>
    </div>
    <script>
      document.getElementById('download').addEventListener('click', function() {
        const button = this;
        const element = document.getElementById('content');
        button.innerText = 'Downloading...';
        
        // 4) Set html2pdf config
        const opt = {
          pagebreak: {
            mode: ['css'],
            before: ${JSON.stringify(breakBefore)},
            after: ${JSON.stringify(breakAfter)},
            avoid: ${JSON.stringify(breakAvoid)}
          },
          margin: 0,
          filename: '${fileName}',
          html2canvas: {
            useCORS: true,
            scale: 1  // no zoom
          },
          jsPDF: {
            unit: 'px',
            orientation: 'portrait',
            format: 'a4',
            hotfixes: ['px_scaling']
          }
        };
        
        // 5) Generate and save PDF
        html2pdf()
          .set(opt)
          .from(element)
          .toPdf()
          .get('pdf')
          .then(() => {
            button.innerText = 'Done 🎉';
            setTimeout(() => {
              button.innerText = 'Download';
            }, 2000);
          })
          .save();
      });
    </script>
  `;

  // Encode and return the final HTML as a data URL
  const encodedHtml = encodeURIComponent(originalHTML);
  return "data:text/html;charset=utf-8," + encodedHtml;
};
