const html = `<!DOCTYPE html>
<body>
  <h1>Hello World</h1>
  <p>This markup was generated by a Cloudflare Worker.</p>
</body>`
const statusCode = 301
const api = [
  {"name": "Revision Plan", "url": "https://docs.google.com/document/d/1uQWECI6QcetzX6gvcQ4YMCCDdTTYl5PSwnFvN04-78s/edit"}, 
  {"name" : "Link name2", "url": "https://linkurl1"},
  {"name" : "Link name3" , "url" : "https://linkurl3"}
  ]
const staticPage = "https://static-links-page.signalnerve.workers.dev"
class ElementHandler {
  constructor(links) {
    this.links = links
  }
  element(element) {
    const attribute = element.getAttribute(this.links)
    console.log('attribute is', attribute)
    if (links) {
        //element.setAttribute('<a href = `${api.url}`>`${api.name}`')
        element.appendChild('<a href = `${api.url}`>`${api.name}`')
    }
  }
}
async function handleRequestHTML(req) {
  //const res = await fetch(req)
  new HTMLRewriter().on("div", new ElementHandler('links'))
  return new Response({
      headers: {
        "content-type": "text/html;charset=UTF-8"
      }
    })
}
async function gatherResponse(response) {
  const { headers } = response
  const contentType = headers.get("content-type") || ""
  if (contentType.includes("application/json")) {
    return JSON.stringify(await response.json())
  }
  else if (contentType.includes("application/text")) {
    return await response.text()
  }
  else if (contentType.includes("text/html")) {
    return await response.text()
  }
  else {
    return await response.text()
  }
}
async function handleRequest(request) {
  const url = request.url
  const destinationURL = url + '/links'
  const json = JSON.stringify(api, null, 2)
  if (url){
    const init = {
    headers: {
      "content-type": "text/html;charset=UTF-8",
    },
  }
    const output = await fetch(staticPage, init)
    const results = await gatherResponse(output)
    //return new Response(results)
    const linkResponse = await handleRequestHTML(results)
    return new Response(linkResponse)
  }
  else if (url == destinationURL){
    Response.redirect(destinationURL, statusCode)
    return new Response(json, {
      headers: {
        "content-type": "application/json;charset=UTF-8"
      }
    })
  }
}
addEventListener("fetch", async event => {
  event.respondWith(handleRequest(event.request))
})
