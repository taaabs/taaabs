chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action == 'create_bookmark') {
    console.log(request.data)
    // const parser = new DOMParser();
    // const doc = parser.parseFromString(request.html, 'text/html');
    // // Perform your DOM operations here
    // // For example, extract some data from the parsed HTML
    // const data = {
    //   title: doc.title,
    //   // Add more data as needed
    // };
    // sendResponse(data);
  }
})
