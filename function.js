window.function = function (html, fileName, format, zoom, orientation, margin, breakBefore, breakAfter, breakAvoid, fidelity, customDimensions) {
	// FIDELITY MAPPING
	const fidelityMap = {
		low: 1,
		standard: 1.5,
		high: 2,
	};

	// DYNAMIC VALUES
	html = html.value ?? "No HTML set.";
	fileName = fileName.value ?? "file";
	format = format.value ?? "a4";
	zoom = zoom.value ?? "1";
	orientation = orientation.value ?? "portrait";
	margin = margin.value ?? "0";
	breakBefore = breakBefore.value ? breakBefore.value.split(",") : [];
	breakAfter = breakAfter.value ? breakAfter.value.split(",") : [];
	breakAvoid = breakAvoid.value ? breakAvoid.value.split(",") : [];
	quality = fidelityMap[fidelity.value] ?? 1.5;
	customDimensions = customDimensions.value ? customDimensions.value.split(",").map(Number) : null;

	// DOCUMENT DIMENSIONS
	const formatDimensions = {
		a0: [4967, 7022],
		a1: [3508, 4967],
		a2: [2480, 3508],
		a3: [1754, 2480],
		a4: [1240, 1754],
		a5: [874, 1240],
		a6: [620, 874],
		a7: [437, 620],
		a8: [307, 437],
		a9: [219, 307],
		a10: [154, 219],
		b0: [5906, 8350],
		b1: [4175, 5906],
		b2: [2953, 4175],
		b3: [2085, 2953],
		b4: [1476, 2085],
		b5: [1039, 1476],
		b6: [738, 1039],
		b7: [520, 738],
		b8: [366, 520],
		b9: [260, 366],
		b10: [183, 260],
		c0: [5415, 7659],
		c1: [3827, 5415],
		c2: [2705, 3827],
		c3: [1913, 2705],
		c4: [1352, 1913],
		c5: [957, 1352],
		c6: [673, 957],
		c7: [478, 673],
		c8: [337, 478],
		c9: [236, 337],
		c10: [165, 236],
		dl: [650, 1299],
		letter: [1276, 1648],
		government_letter: [1199, 1577],
		legal: [1276, 2102],
		junior_legal: [1199, 750],
		ledger: [2551, 1648],
		tabloid: [1648, 2551],
		credit_card: [319, 508],
	};

	// GET FINAL DIMESIONS FROM SELECTED FORMAT
	const dimensions = customDimensions || formatDimensions[format];
	const finalDimensions = dimensions.map((dimension) => Math.round(dimension / zoom));

	// LOG SETTINGS TO CONSOLE
	console.log(
		`Filename: ${fileName}\n` +
			`Format: ${format}\n` +
			`Dimensions: ${dimensions}\n` +
			`Zoom: ${zoom}\n` +
			`Final Dimensions: ${finalDimensions}\n` +
			`Orientation: ${orientation}\n` +
			`Margin: ${margin}\n` +
			`Break before: ${breakBefore}\n` +
			`Break after: ${breakAfter}\n` +
			`Break avoid: ${breakAvoid}\n` +
			`Quality: ${quality}`
	);

	const customCSS = `
	    body {
	        margin: 0!important;
	        min-height: 100vh;
	        width: 100%;
	        padding: 0;
	    }
	
	    .main {
	        min-height: 100vh;
	        width: 100%;
	        position: relative;
	    }
	
	    #content {
	        min-height: 100vh;
	        width: 100%;
	        margin: 0;
	        padding: 0;
	    }
	
	    /* If your background image is applied to a specific div */
	    .background-container {
	        min-height: 100vh;
	        width: 100%;
	        background-size: cover;
	        background-position: center;
	        background-repeat: no-repeat;
	        margin: 0;
	        padding: 0;
	    }
	
	    /* Button styles */
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
	
	    .avoid-break {
	        page-break-inside: avoid;
	    }
	
	    /* For images that should cover full page */
	    img.full-page {
	        width: 100%;
	        height: 100vh;
	        object-fit: cover;
	        margin: 0;
	        padding: 0;
	        display: block;
	    }
	
	    ::-webkit-scrollbar {
	        width: 5px;
	        background-color: rgb(0 0 0 / 8%);
	    }
	
	    ::-webkit-scrollbar-thumb {
	        background-color: rgb(0 0 0 / 32%);
	        border-radius: 4px;
	    }
	`;
	
	// HTML THAT IS RETURNED AS A RENDERABLE URL
	const originalHTML = `
	  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.2/html2pdf.bundle.min.js"></script>
	  <style>${customCSS}</style>
	  <div class="main">
	  <div class="header">
		<button class="button" id="download">Download</button>
	  </div>
	  <div id="content">${html}</div>
	  </div>
	  <script>
	  document.getElementById('download').addEventListener('click', function() {
		var element = document.getElementById('content');
		var button = this;
		button.innerText = 'Downloading...';
		button.className = 'downloading';
  
		var opt = {
		pagebreak: { mode: ['css'], before: ${JSON.stringify(breakBefore)}, after: ${JSON.stringify(breakAfter)}, avoid: ${JSON.stringify(breakAvoid)} },
		margin: ${margin},
		filename: '${fileName}',
		html2canvas: {
		  useCORS: true,
		  scale: ${quality}
		},
		jsPDF: {
		  unit: 'px',
		  orientation: '${orientation}',
		  format: [${finalDimensions}],
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
	var encodedHtml = encodeURIComponent(originalHTML);
	return "data:text/html;charset=utf-8," + encodedHtml;
};
