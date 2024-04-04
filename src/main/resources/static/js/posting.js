let editor;

ClassicEditor
	.create(document.querySelector('#noticeDetail'), {
		language: 'ko'
	})
	.then(newEditor => {
		editor = newEditor;
	})
	.catch(error => {
		console.error(error);
	});